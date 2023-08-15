using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using Microsoft.AspNetCore.Cors;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetAllocationController : ControllerBase
    {
        private readonly IBudgetAllocationRepository _repository;

        public BudgetAllocationController(IBudgetAllocationRepository repository)
        {
            _repository = repository;
        }
        [HttpGet]
        [Route("GetAllBudgetCategories")]
        public async Task<IActionResult> GetAllBudgetCategories()
        {
            try
            {
                var results = await _repository.GetAllBudgetCategoriesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetBudgetCategory/{budgetCategoryId}")]
        public async Task<IActionResult> GetBudgetCategory(int budgetCategoryId)
        {
            try
            {
                var result = await _repository.GetBudgetCategoryAsync(budgetCategoryId);
                if (result == null) return NotFound("Budget Category does not exist");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpGet]
        [Route("GetAllBudgetAllocations")]
        public async Task<IActionResult> GetAllBudgetAllocations()
        {
            try
            {
                var results = await _repository.GetAllBudgetAllocationsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetBudgetAllocation/{budgetAllocationId}")]
        public async Task<IActionResult> GetBudgetAllocation(int budgetAllocationId)
        {
            try
            {
                var result = await _repository.GetBudgetAllocationAsync(budgetAllocationId);
                if (result == null) return NotFound("Budget Allocation does not exist");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetAllBudgetLines")]
        public async Task<IActionResult> GetAllBudgetLines()
        {
            try
            {
                var results = await _repository.GetAllBudgetLinesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetBudgetLine/{accountCode}")]
        public async Task<IActionResult> GetBudgetLine(string accountCode)
        {
            try
            {
                var result = await _repository.GetBudgetLineAsync(accountCode);
                if (result == null) return NotFound("Budget Line does not exist");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetBudgetLinesForAllocation/{allocationId}")]
        public async Task<IActionResult> GetBudgetLinesForAllocation(int allocationId)
        {
            try
            {
                var result = await _repository.GetBudgetLinesForAllocationAsync(allocationId);
                if (result == null) return NotFound("Budget Lines do not exist");
                return Ok(result);
            }
            catch(Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddBudgetCategory")]
        public async Task<IActionResult> AddBudgetCategory(Budget_Category budget_Category)
        {
            var _budget_Category = new Budget_Category{  Account_Name = budget_Category.Account_Name, Description= budget_Category.Description};
            try
            {
                _repository.Add(_budget_Category);
                await _repository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return Ok(_budget_Category);
        }

        [HttpPost]
        [Route("AddBudgetAllocation")]
        public async Task<IActionResult> AddBudgetAllocation(Budget_Allocation budget_Allocation)
        {
            
            try
            {
                var result = await _repository.AddBudgetAllocationAsync(budget_Allocation);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddBudgetLine")]
        public async Task<IActionResult> AddBudgetLine(Budget_Line budget_Line)
        {

            try
            {

                var result = await _repository.AddBudgetLineAsync(budget_Line);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("EditBudgetCategory/{budgetCategoryId}")]

        public async Task<IActionResult> EditBudgetCategory(int budgetCategoryId, Budget_Category budgetCategory)
        {
            try
            {
                var existingBudgetCategory = await _repository.GetBudgetCategoryAsync(budgetCategoryId);
                if (existingBudgetCategory == null) return NotFound("The budget category does not exist.");

                existingBudgetCategory.Account_Name = budgetCategory.Account_Name;
                existingBudgetCategory.Description = budgetCategory.Description;

                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingBudgetCategory);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            return BadRequest("Your request is invalid.");
        }

        [HttpPut]
        [Route("EditBudgetAllocation/{budgetAllocationId}")]

        public async Task<IActionResult> EditBudgetAllocation(int budgetAllocationId, Budget_Allocation budgetAllocation)
        {
            try
            {
                var existingBudgetAllocation = await _repository.GetBudgetAllocationAsync(budgetAllocationId);
                if (existingBudgetAllocation == null) return NotFound("The budget line does not exist.");

                existingBudgetAllocation.Total = budgetAllocation.Total;
                existingBudgetAllocation.Year = budgetAllocation.Year;
                existingBudgetAllocation.Date_Created = budgetAllocation.Date_Created;
                existingBudgetAllocation.Department_ID = budgetAllocation.Department_ID;

                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingBudgetAllocation);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            return BadRequest("Your request is invalid.");
        }

        [HttpPut]
        [Route("EditBudgetLine/{accountCode}")]

        public async Task<IActionResult> EditBudgetLine(string accountCode, Budget_Line budgetLine)
        {
            try
            {
                var result = await _repository.UpdateBudgetLineAsync(budgetLine, accountCode);

                return Ok(result);

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        [HttpDelete]
        [Route("DeleteBudgetCategory/{budgetCategoryId}")]
        public async Task<IActionResult> DeleteBudgetCategory(int budgetCategoryId)
        {
            try
            {
                var existingBudgetCategory = await _repository.GetBudgetCategoryAsync(budgetCategoryId);

                if (existingBudgetCategory == null) return NotFound("The budget category does not exist");

                _repository.Delete(existingBudgetCategory);
                if (await _repository.SaveChangesAsync()) return Ok(existingBudgetCategory);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteBudgetAllocation/{budgetAllocationId}")]
        public async Task<IActionResult> DeleteBudgetAllocation(int budgetAllocationId)
        {
            try
            {
                var existingBudgetAllocation = await _repository.GetBudgetAllocationAsync(budgetAllocationId);

                if (existingBudgetAllocation == null) return NotFound("The budget allocation does not exist");

                _repository.Delete(existingBudgetAllocation);
                if (await _repository.SaveChangesAsync()) return Ok(existingBudgetAllocation);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteBudgetLine/{accountCode}")]
        public async Task<IActionResult> DeleteBudgetLine(string accountCode)
        {
            try
            {
                var existingBudgetLine = await _repository.GetBudgetLineAsync(accountCode);

                if (existingBudgetLine == null) return NotFound("The budget line does not exist");

                _repository.Delete(existingBudgetLine);
                if (await _repository.SaveChangesAsync()) return Ok(existingBudgetLine);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpGet]
        [Route("BudgetCategoryValidation/{name}")]
        public async Task<IActionResult> BudgetCategoryValidation([FromRoute] string name)
        {
            try
            {
                var result = await _repository.BudgetCategoryValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("BudgetAllocationValidation/{departmentName}/{year}")]
        public async Task<IActionResult> BudgetAllocationValidation([FromRoute] string departmentName, int year)
        {
            try
            {
                var result = await _repository.BudgetAllocationValidationAsync(departmentName, year);
                return Ok(result);
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("ExportExcel/{bai}")]
        public async Task<IActionResult> ExportExcel(int bai)
        {

            var budgetline = await _repository.GetBudgetAllocationExportAsync(bai);

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Budget Allocation");
            var currentRow = 8;
            var currentCol = 1;
            decimal atotal = 0;
            
            worksheet.Cell(1, 1).Value = "Department: " + budgetline[0].Budget_Allocation.Department.Description;
            worksheet.Cell(1, 1).Style.Font.FontSize = 14;

            worksheet.Cell(2, 1).Value = "FY: " + budgetline[0].Budget_Allocation.Year;
            worksheet.Cell(2, 1).Style.Font.FontSize = 14;

            foreach (var at in budgetline)
            {
                atotal = atotal + at.ActualAmt;
            }

            //worksheet.Row(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            //worksheet.Row(4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            //worksheet.Row(5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            

            worksheet.Row(4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Row(4).Height = 15.0;
            worksheet.Row(4).Style.Font.Bold = true;
            worksheet.Row(4).Style.Font.FontSize = 12;
            worksheet.Row(4).Style.Font.FontColor = XLColor.White;

            worksheet.Cell(4, 2).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(4, 3).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(4, 4).Style.Fill.BackgroundColor = XLColor.Cobalt;

            worksheet.Cell(4, 2).Value = "Budgeted Total";
            worksheet.Cell(4, 3).Value = "Actual Total";
            worksheet.Cell(4, 4).Value = "Variance";

            worksheet.Cell(5, 2).Style.NumberFormat.Format = "R #,##0.00";
            worksheet.Cell(5, 3).Style.NumberFormat.Format = "R #,##0.00";
            worksheet.Cell(5, 4).Style.NumberFormat.Format = "R #,##0.00 ;R (#,##0.00)";

            worksheet.Row(5).Style.Font.FontSize = 12;
            worksheet.Cell(5, 1).Value = "Total Expenses:";
            worksheet.Cell(5, 1).Style.Font.Bold = true;

            worksheet.Cell(5, 2).Value = budgetline[0].Budget_Allocation.Total;
            worksheet.Cell(5, 3).Value = atotal;
            worksheet.Cell(5, 4).Value = budgetline[0].Budget_Allocation.Total - atotal;



            worksheet.Row(7).Height = 15.0;
            worksheet.Row(7).Style.Font.Bold = true;
            worksheet.Row(7).Style.Font.FontSize = 12;
            worksheet.Row(7).Style.Font.FontColor = XLColor.White;
            worksheet.Cell(7, 1).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(7, 2).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(7, 3).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(7, 4).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(7, 5).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Cell(7, 6).Style.Fill.BackgroundColor = XLColor.Cobalt;
            worksheet.Row(7).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            

            worksheet.Cell(7, 1).Value = "Account Name";
            worksheet.Cell(7, 2).Value = "Account Code";
            worksheet.Cell(7, 3).Value = "Month";
            worksheet.Cell(7, 4).Value = "Budgeted Amount";
            worksheet.Cell(7, 5).Value = "Actual Amount";
            worksheet.Cell(7, 6).Value = "Actual Variance";

            foreach (var bl in budgetline)
            {
                worksheet.Row(currentRow).Style.Font.FontSize = 12;

                worksheet.Cell(currentRow, 1).Value = bl.Budget_Category.Description;
                worksheet.Cell(currentRow, 2).Value = bl.Account_Code;
                worksheet.Cell(currentRow, 3).Value = bl.Month;
                worksheet.Cell(currentRow, 4).Value = bl.BudgetAmt;
                worksheet.Cell(currentRow, 5).Value = bl.ActualAmt;
                worksheet.Cell(currentRow, 6).Value = bl.Variance;

                worksheet.Cell(currentRow, 4).Style.NumberFormat.Format = "R #,##0.00";
                worksheet.Cell(currentRow, 5).Style.NumberFormat.Format = "R #,##0.00";
                worksheet.Cell(currentRow, 6).Style.NumberFormat.Format = "R #,##0 ;R (#,##0)";
                worksheet.Cell(currentRow, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(currentRow, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                worksheet.Cell(currentRow, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                currentRow++;

                worksheet.Columns().AdjustToContents();
            }

            worksheet.Column(2).Width = 15.5;
            worksheet.Column(3).Width = 13.0;


            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Budget Allocation - " + budgetline[0].Budget_Allocation.Department.Name + ".xlsx");
        }
        [HttpGet]
        [Route("GetVarianceByDepartment")]
        public async Task<IActionResult> GetVarianceByDepartment()
        {
            try
            {
                var result = await _repository.GetVarianceByDepartmentAsync();
                return Ok(result);
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("GetMonthlyBudgetData/{year}")]
        public async Task<IActionResult> GetMonthlyBudgetData([FromRoute] int year)
        {
            try
            {
                var result = await _repository.GetMonthlyBudgetDataForCategory(year);
                return Ok(result);
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("GetYearlyTotalsForCategory/{year}")]

        public async Task<IActionResult> GetYearlyTotalsForCategory([FromRoute] int year)
        {
            try
            {
                var result = await _repository.GetYearlyTotalsForCategories(year);
                return Ok(result);
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("GetMonthlyTotals/{year}")]
        public async Task<IActionResult> GetMonthlyTotals([FromRoute] int year)
        {
            try
            {
                var result = await _repository.GetMonthlyTotals(year);
                return Ok(result);
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }

    }
}
