using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.TimeSeries;
using Microsoft.ML.TimeSeries;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories.Consumables
{
    public class ConsumableRepository : IConsumableRepository
    {
        private readonly AppDBContext _dbContext;

        public ConsumableRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<Consumable[]> GetAllConsumableAsync()
        {
            IQueryable<Consumable> query = _dbContext.Consumable.Include(c => c.Consumable_Category);
            return await query.ToArrayAsync();
        }

        public async Task<Consumable[]> AddConsumableAsync(Consumable ConsumableAdd)
        {
            // Check if the category already exists
            Consumable_Category existingCategory = await _dbContext.Consumable_Category.FirstOrDefaultAsync(c => c.Name == ConsumableAdd.Consumable_Category.Name);

            if (existingCategory != null)
            {
                // Category already exists, assign its ID to the new consumable
                ConsumableAdd.Consumable_Category = existingCategory;
            }
            await _dbContext.AddAsync(ConsumableAdd);
            await _dbContext.SaveChangesAsync();

            var HistData = new List<Consumable_History>();

            var StockAmt = ConsumableAdd.On_Hand;
            var DCap = DateTime.UtcNow;

            var HistoryAdd = new Consumable_History
            {
                Consumable = ConsumableAdd,
                StockAmt = StockAmt,
                DateCaptured = DCap
            };

            HistData.Add(HistoryAdd);
            await _dbContext.Consumable_History.AddRangeAsync(HistData);
            await _dbContext.SaveChangesAsync();

            return new Consumable[] { ConsumableAdd };
        }


        public async Task<Consumable> ConsumableValidationAsync(string name, string category)
        {
            //Consumable ExistingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Name == name && x.Consumable_Category.Name == category);
            Consumable ExistingConsumable = await _dbContext.Consumable.Include(x => x.Consumable_Category).FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower() && x.Consumable_Category.Name == category);



            if (ExistingConsumable != null)
            {
                return ExistingConsumable;
            }

            else
            {
                return null;
            }
        }

        public async Task<Consumable> GetConsumablesByIDAsync(int id)
        {
            Consumable ChosenConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == id);
            return ChosenConsumable;
        }

        public async Task<Consumable_History> GetConsumableHistoryByIDAsync(int id)
        {
            Consumable_History ChosenHist = await _dbContext.Consumable_History.FirstOrDefaultAsync(x => x.Consumable_ID == id);
            return ChosenHist;
        }

        public async Task<Consumable> DeleteConsumableAsync(int id)
        {
            var hasHistory = await _dbContext.Consumable_History.FirstOrDefaultAsync(x => x.Consumable_ID == id);

            if (hasHistory != null)
            {
                var histRemove = _dbContext.Consumable_History.Where(x => x.Consumable_ID == id);
                _dbContext.Consumable_History.RemoveRange(histRemove);
            }
            var ConsumableToDelete = await _dbContext.Consumable.FindAsync(id);
            _dbContext.Consumable.Remove(ConsumableToDelete);
            await _dbContext.SaveChangesAsync();

            return ConsumableToDelete;
        }
        public async Task<Consumable> UpdateConsumableAsync(int id, Consumable Request)
        {
            var consumable = await _dbContext.Consumable.FindAsync(id);

            consumable.Name = Request.Name;
            consumable.Description = Request.Description;
            consumable.On_Hand = Request.On_Hand;
            consumable.Minimum_Reorder_Quantity = Request.Minimum_Reorder_Quantity;
            consumable.Maximum_Reorder_Quantity = Request.Maximum_Reorder_Quantity;

            consumable.Consumable_Category = new Consumable_Category();

            Consumable_Category existingCategory = await _dbContext.Consumable_Category.FirstOrDefaultAsync(c => c.Name == Request.Consumable_Category.Name);

            consumable.Consumable_Category = existingCategory;

            await _dbContext.SaveChangesAsync();

            return consumable;
        }

        public async Task<Consumable_History[]> UpdateStockAsync(Consumable_History HistoryAdd)
        {
            Consumable ExistingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(c => c.Name == HistoryAdd.Consumable.Name);

            // Update Stock of Consumable
            ExistingConsumable.On_Hand = HistoryAdd.StockAmt;

            // Add the new history entry
            var history = new Consumable_History
            {
                Consumable_ID = ExistingConsumable.Consumable_ID,
                StockAmt = HistoryAdd.StockAmt,
                DateCaptured = HistoryAdd.DateCaptured
            };
            await _dbContext.Consumable_History.AddAsync(history);
            await _dbContext.SaveChangesAsync();

            return new Consumable_History[] { history };
        }

        public class StockData
        {
            [LoadColumn(0)]
            public float DateCaptured;

            [LoadColumn(1)]
            public float StockAmt;

            [LoadColumn(2)]
            public float Year;
        }

        public class StockPrediction
        {
            [ColumnName("Score")]
            public float[] PredictedStockAmt;
        }

        public async Task<Notification[]> AddNotificationAsync(Notification ConsumableNotif)
        {

            Notification_Type existingNotificationType = await _dbContext.Notification_Type.FirstOrDefaultAsync(x => x.Notification_Type_ID == ConsumableNotif.Notification_Type_ID);

            if (existingNotificationType != null)
            {
                ConsumableNotif.Notification_Type = existingNotificationType;
            }

            var existingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.User_Id == ConsumableNotif.User_Id);

            if (existingUser != null)
            {
                ConsumableNotif.User = existingUser;
                ConsumableNotif.User.No_Notifications = existingUser.No_Notifications + 1;
                ConsumableNotif.User.No_InvNotifications = existingUser.No_InvNotifications + 1;
            }


            await _dbContext.Notification.AddAsync(ConsumableNotif);
            await _dbContext.SaveChangesAsync();

            return new Notification[] { ConsumableNotif };
        }



        public async Task<IEnumerable<(int Year, int Month, int ActualAmount, int PredictedAmount)>> PredictStockLevelAsync(int id)
        {
            try
            {
                var Stock = new List<float>();

                // Retrieve data from the Consumable_History table for the specified ID
                var consumablesData = await _dbContext.Consumable_History
                    .Where(consumable => consumable.Consumable_ID == id)
                    .OrderBy(consumable => consumable.DateCaptured)
                    .Select(consumable => new StockData
                    {
                        DateCaptured = consumable.DateCaptured.Month,
                        Year = consumable.DateCaptured.Year,
                        StockAmt = consumable.StockAmt
                    })
                    .ToListAsync();

                // Create MLContext
                var mlContext = new MLContext();

                // Load data
                var dataView = mlContext.Data.LoadFromEnumerable(consumablesData);

                



                // Create a forecast engine
                var forecastingEstimator = mlContext.Forecasting.ForecastBySsa(
                    outputColumnName: "Score",
                    inputColumnName: "StockAmt",
                    windowSize: 12,
                    seriesLength: consumablesData.Count,
                    trainSize: consumablesData.Count,
                    horizon: 12);

                var forecastTransformer = forecastingEstimator.Fit(dataView);
                var forecastEngine = forecastTransformer.CreateTimeSeriesEngine<StockData, StockPrediction>(mlContext);

                // Predict monthly stock levels for the following year
                var predictions = new List<(int Year, int Month, int ActualAmount, int PredictedAmount)>();

                // Use the last available data point as input for prediction
                var lastDataPoint = consumablesData.Last();
                var StockLevelHist = consumablesData.ToList();

                var adjustedYear = lastDataPoint.Year;


                for (int month = 1; month <= 12; month++)
                {
                    // Adjust the month based on the last available data point
                    var adjustedMonth = lastDataPoint.DateCaptured + month;



                    if (adjustedMonth >= 13)
                    {
                        adjustedMonth = adjustedMonth - 12;
                        if (adjustedMonth == 1)
                        {
                            adjustedYear = adjustedYear + 1;
                        }
                    }
                   


                    var Predictions = new List<float>();
                    var Actuals = new List<float>();
                    foreach (var Data in StockLevelHist)
                    {


                        if (Data.DateCaptured == adjustedMonth)
                        {
                            Actuals.Add(Data.StockAmt);

                            var inputData = new StockData
                            {
                                DateCaptured = adjustedMonth,
                                StockAmt = Data.StockAmt
                            };

                            var prediction = forecastEngine.Predict(inputData);
                           
                            Predictions.Add(prediction.PredictedStockAmt[month - 1]);
                        }
                    }

                    var MonthAverage = Predictions.Average();
                    var ActualsMonthAverage = Actuals.Average();
                    var Accuracy = (ActualsMonthAverage - MonthAverage) / ActualsMonthAverage;
                    predictions.Add((Year: (int)adjustedYear, Month: (int)adjustedMonth, ActualAmount: (int)Math.Round(ActualsMonthAverage), PredictedAmount: (int)Math.Round(MonthAverage))); ;



                }

                return predictions;
            }
            catch (Exception ex)
            {

             
                throw;
            }
        }

        public async Task<ReportData> GetReportData(string startDate, string endDate)
        {
            DateTime startDateTime = DateTime.Parse(startDate);
            DateTime endDateTime = DateTime.Parse(endDate);

            var consumableIds = _dbContext.Consumable_History
                             .Where(h => h.DateCaptured >= startDateTime && h.DateCaptured <= endDateTime)
                             .Select(h => h.Consumable_ID)
                             .Distinct()
                             .ToList();

            var consumablesWithHistory = _dbContext.Consumable
                    .Where(c => consumableIds.Contains(c.Consumable_ID))
                    .Select(c => new {
                        Consumable = c,
                        History = _dbContext.Consumable_History
                                   .Where(h => h.Consumable_ID == c.Consumable_ID && h.DateCaptured >= startDateTime && h.DateCaptured <= endDateTime)
                                   .ToList()
                    })
                    .ToList();

            var reportData = new ReportData
            {
                Consumables = consumablesWithHistory.Select(cwh => new ConsumableWithHistory
                {
                    Consumable = cwh.Consumable,
                    History = cwh.History
                }).ToList()
            };

            return reportData;
        }

        public async Task<Procurement_Consumable> ValidateConsumableToDeleteAsync(int ID)
        {
            Procurement_Consumable ExistingRecord = await _dbContext.Procurement_Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == ID);


            return ExistingRecord;
        }
    }
}
