using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using Microsoft.AspNetCore.Cors;

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
        public async Task<IActionResult> GetBudgetLine(int accountCode)
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

        public async Task<IActionResult> EditBudgetLine(int accountCode, Budget_Line budgetLine)
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
        public async Task<IActionResult> DeleteBudgetLine(int accountCode)
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

    }
}
