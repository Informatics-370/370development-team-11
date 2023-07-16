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




namespace ProcionAPI.Models.Repositories
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

            // Add the consumable to the database and save changes
            await _dbContext.AddAsync(ConsumableAdd);
            await _dbContext.SaveChangesAsync();

            // Generate dummy data for Consumable_History
            var dummyData = new List<Consumable_History>();

            var random = new Random();

            for (int i = 0; i < 1000; i++)
            {
                var histAmt = random.Next(1, 51);
                var histDate = DateTime.UtcNow.AddMonths(-i).AddMonths(-1);

                var dummyHistory = new Consumable_History
                {
                    Consumable = ConsumableAdd,
                    StockAmt = histAmt,
                    DateCaptured = histDate
                };

                dummyData.Add(dummyHistory);
            }

            // Add the dummy data to the database and save changes
            await _dbContext.Consumable_History.AddRangeAsync(dummyData);
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





        public async Task<IEnumerable<(int Year,int Month,int ActualAmount, int PredictedAmount)>> PredictStockLevelAsync(int id)
        {
            try
            {
                var Stock = new List<float>();

                // Retrieve data from the Consumable_History table for the specified ID
                var consumablesData = await _dbContext.Consumable_History
                    .Where(consumable => consumable.Consumable_ID == id)
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

                Console.WriteLine(nameof(StockData.DateCaptured) + " + " + nameof(StockData.StockAmt));

                //// Define the pipeline
                //var pipeline = mlContext.Transforms.NormalizeMinMax(nameof(StockData.StockAmt))
                //    .Append(mlContext.Transforms.Concatenate("Features", nameof(StockData.DateCaptured), nameof(StockData.StockAmt)));

                //// Train the model
                //var trainedModel = pipeline.Fit(dataView);



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
                var predictions = new List<(int Year,int Month,int ActualAmount, int PredictedAmount)>();

                // Use the last available data point as input for prediction
                var lastDataPoint = consumablesData.Last();
                var StockLevelHist = consumablesData.ToList();

                var adjustedYear = (lastDataPoint.Year);

                for (int month = 1; month <= 12; month++)
                {
                    // Adjust the month based on the last available data point
                    var adjustedMonth = (lastDataPoint.DateCaptured + month);

                    

                    if (adjustedMonth >= 13)
                    {
                        adjustedMonth = adjustedMonth - 12;
                        if (adjustedMonth == 1)
                        {
                            adjustedYear = adjustedYear + 1;
                        }
                    }
                    Console.WriteLine(adjustedMonth);


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
                            Console.WriteLine("Month: " + inputData.DateCaptured + " Previous: " + inputData.StockAmt + " Prediction: " + prediction.PredictedStockAmt[month - 1]);
                            Predictions.Add(prediction.PredictedStockAmt[month - 1]);
                        }
                    }

                    var MonthAverage = Predictions.Average();
                    var ActualsMonthAverage = Actuals.Average();
                    Console.WriteLine(MonthAverage);
                    var Accuracy = (ActualsMonthAverage - MonthAverage) / ActualsMonthAverage;
                    Console.WriteLine("Accuracy: " + Accuracy);
                    predictions.Add((Year: (int)adjustedYear, Month: (int)adjustedMonth,ActualAmount: (int)Math.Round(ActualsMonthAverage), PredictedAmount: (int)Math.Round(MonthAverage))); ;



                }

                return predictions;
            }
            catch (Exception ex)
            {

                 Console.WriteLine(ex.Message);
                throw;
            }
        }

        //public async Task<IEnumerable<int>> PredictStockLevelAsync(int id)
        //{
        //    // Retrieve data from the Consumable_History table for the specified ID
        //    var consumablesData = await _dbContext.Consumable_History
        //        .Where(consumable => consumable.Consumable_ID == id)
        //        .Select(consumable => new StockData
        //        {
        //            DateCaptured = consumable.DateCaptured.Month,
        //            StockAmt = consumable.StockAmt
        //        })
        //        .ToListAsync();

        //    // Create MLContext
        //    var mlContext = new MLContext();

        //    // Load data
        //    var dataView = mlContext.Data.LoadFromEnumerable(consumablesData);

        //    // Define the pipeline
        //    var pipeline = mlContext.Transforms.Concatenate("Features", nameof(StockData.DateCaptured), nameof(StockData.StockAmt))
        //        .Append(mlContext.Transforms.NormalizeMinMax("Features"));

        //    // Train the model
        //    var trainedModel = pipeline.Fit(dataView);

        //    // Create a forecast engine
        //    var forecastingEstimator = mlContext.Forecasting.ForecastBySsa(
        //        outputColumnName: nameof(StockPrediction.PredictedStockAmt),
        //        inputColumnName: "Features",
        //        windowSize: 12, // Size of the seasonal window
        //        seriesLength: 12, // Number of time steps in the series
        //        trainSize: (int)(consumablesData.Count * 0.2), // Number of data points used for training
        //        horizon: 12); // Number of future time steps to forecast

        //    var forecastTransformer = forecastingEstimator.Fit(dataView) as SsaForecastingTransformer;
        //    Console.WriteLine("Transformer Success");
        //    var forecastEngine = (forecastTransformer as SsaForecastingTransformer).CreateTimeSeriesEngine<StockData, StockPrediction>(mlContext);

        //    // Make the forecast
        //    var predictions = Enumerable.Range(1, 12)
        //        .Select(month => forecastEngine.Predict(new StockData { DateCaptured = month }).PredictedStockAmt)
        //        .Select(p => (int)Math.Round(p));

        //    return predictions;
        //}

        //public async Task<IEnumerable<int>> PredictStockLevelAsync(int id)
        //{
        //    // Retrieve data from the Consumable_History table for the specified ID
        //    var consumablesData = await _dbContext.Consumable_History
        //        .Where(consumable => consumable.Consumable_ID == id)
        //        .Select(consumable => new StockData
        //        {
        //            DateCaptured = consumable.DateCaptured.Month,
        //            StockAmt = consumable.StockAmt
        //        })
        //        .ToListAsync();

        //    // Create MLContext
        //    var mlContext = new MLContext();

        //    // Load data
        //    var dataView = mlContext.Data.LoadFromEnumerable(consumablesData);

        //    // Split the data into training and testing datasets
        //    var trainTestSplit = mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);

        //    // Define the pipeline
        //    var pipeline = mlContext.Transforms.Concatenate("Label", nameof(StockData.DateCaptured))
        //        .Append(mlContext.Transforms.CopyColumns("Features", nameof(StockData.StockAmt)))
        //        .Append(mlContext.Transforms.NormalizeMinMax("Features"));

        //    // Train the model
        //    var trainedModel = pipeline.Fit(trainTestSplit.TrainSet);

        //    // Evaluate the model
        //    var testSetTransformed = trainedModel.Transform(trainTestSplit.TestSet);
        //    var metrics = mlContext.Regression.Evaluate(testSetTransformed);

        //    Console.WriteLine($"R-Squared: {metrics.RSquared}");
        //    Console.WriteLine($"Root Mean Squared Error: {metrics.RootMeanSquaredError}");

        //    // Create a prediction engine
        //    var predictionEngine = mlContext.Model.CreatePredictionEngine<StockData, StockPrediction>(trainedModel);

        //    // Predict monthly stock levels for the following year
        //    var predictions = new List<int>();
        //    for (int month = 1; month <= 12; month++)
        //    {
        //        var inputData = new StockData { DateCaptured = month };
        //        var prediction = predictionEngine.Predict(inputData);
        //        predictions.Add((int)Math.Round(prediction.PredictedStockAmt));
        //    }

        //    return predictions;
        //}

        //public async Task<IEnumerable<int>> PredictStockLevelAsync(int id)
        //{
        //    // Load the ML.NET model
        //    var mlContext = new MLContext();
        //    var model = await mlContext.Model.LoadAsync<YourModelClass>("path_to_model");

        //    // Get the consumable with the specified ID.
        //    var consumable = await _dbContext.Consumable.FindAsync(id);

        //    // Get the months for the prediction keys.
        //    var predictionKeys = new List<int>();
        //    var currentDate = DateTime.Now.AddMonths(1); // Start from the next month
        //    for (int i = 0; i < 12; i++)
        //    {
        //        predictionKeys.Add(currentDate.Month);
        //        currentDate = currentDate.AddMonths(1);
        //    }

        //    // Get the stock amounts and months from the consumable history
        //    var historyData = await _dbContext.Consumable_History
        //        .Select(history => new ModelInput
        //        {
        //            Month = history.DateCaptured.Month,
        //            StockAmount = (float)history.StockAmount
        //        })
        //        .ToListAsync();

        //    // Create input data for prediction
        //    var inputData = new List<ModelInput>();
        //    inputData.AddRange(historyData); // Add historical data
        //    inputData.AddRange(predictionKeys.Select(key => new ModelInput { Month = key })); // Add prediction keys

        //    // Predict stock levels for the following year
        //    var predictions = model.Transform(mlContext.Data.LoadFromEnumerable(inputData));
        //    var predictedStockLevels = predictions.GetColumn<float>("Score").ToArray();

        //    // Return the predicted stock levels for the following year
        //    return predictedStockLevels.Skip(historyData.Count).Select(stockLevel => (int)Math.Round(stockLevel));
        //}
    }
}
