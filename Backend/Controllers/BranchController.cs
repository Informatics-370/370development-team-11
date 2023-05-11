using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        


        private readonly IBranchRepository _branchRepository;
            public BranchController(IBranchRepository BranchRepository)
            {
            _branchRepository = BranchRepository;
            }

            [HttpGet]
            [Route("GetAllBranches")]
            public async Task<IActionResult> GetAllBranches()
            {
                try
                {
                    var result = await _branchRepository.GetAllBranchesAsync();
                    return Ok(result);
                }
                catch (Exception)
                {

                    return StatusCode(500, "Internal Server Error. Please contact support.");
                }
            }

            [HttpPost]
            [Route("AddBranch")]
            public async Task<IActionResult> AddBranch([FromBody] Branch AddBranch)
            {
                try
                {
                    var result = await _branchRepository.AddBranchAsync(AddBranch);
                    return Ok(result);
                }
                catch (Exception)
                {

                    return StatusCode(500, "Internal Server Error. Please contact support.");
                }
            }

            [HttpPut]
            [Route("EditBranch{Branch_ID}")]
            public async Task<ActionResult> EditBranch([FromRoute] int Branch_ID, Branch EditBranchRequest)
            {
                var results = await _branchRepository.EditBranchAsync(Branch_ID, EditBranchRequest);
                return Ok(results);
            }

            [HttpDelete]
            [Route("DeleteBranch{Branch_ID}")]
            public async Task<ActionResult> DeleteBranch([FromRoute] int Branch_ID)
            {
                var results = await _branchRepository.DeleteBranchAsync(Branch_ID);
                return Ok(results);
            }

            [HttpGet]
            [Route("GetBranch{Branch_ID}")]
            public async Task<IActionResult> GetBranch([FromRoute] int Branch_ID)
            {
                try
                {
                    var result = await _branchRepository.GetBranchAsync(Branch_ID);
                    return Ok(result);
                }
                catch (Exception)
                {
                    return StatusCode(500, "Internal Server Error. Please Contact Support");
                    throw;
                }
            }
        
    }
}
