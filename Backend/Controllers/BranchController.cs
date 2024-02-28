using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using NuGet.Protocol.Core.Types;

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
            [Route("GetBranches")]
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
            [Route("CreateBranch")]
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
        [Route("EditBranch/{branch_ID}")]
        public async Task<ActionResult<Branch>> EditBranch(int Branch_ID, Branch EditBranchRequest)
        {
            try
            {
                var existingBranch = await _branchRepository.GetBranchAsync(Branch_ID);
                if (existingBranch == null) return NotFound($"The role does not exist");

                existingBranch.Name = EditBranchRequest.Name;
                existingBranch.Street = EditBranchRequest.Street;
                existingBranch.City = EditBranchRequest.City;
                existingBranch.Postal_Code = EditBranchRequest.Postal_Code;
                existingBranch.Province = EditBranchRequest.Province;


                if (await _branchRepository.SaveChangesAsync())
                {
                    return Ok(existingBranch);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpDelete]
        [Route("DeleteBranch/{Branch_ID}")]
        public async Task<IActionResult> DeleteBranch(int Branch_ID)
        {
            try
            {
                var existingBranch = await _branchRepository.GetBranchAsync(Branch_ID);
                if (existingBranch == null) return NotFound($"The role does not exist");
                _branchRepository.Delete(existingBranch);
                if (await _branchRepository.SaveChangesAsync()) return Ok(existingBranch);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpGet]
        [Route("GetBranch/{Branch_ID}")]
        public async Task<IActionResult> GetBranch(int Branch_ID)
        {
            try
            {
                var result = await _branchRepository.GetBranchAsync(Branch_ID);
                if (result == null) return NotFound("Course does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("BranchValidation/{street}")]
        public async Task<IActionResult> BranchValidation([FromRoute] string street)
        {
            try
            {
                var result = await _branchRepository.BranchValidationAsync(street);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("EditBranchValidation/{street}/{id}")]
        public async Task<IActionResult> EditBranchValidation([FromRoute] string street, int id)
        {
            try
            {
                var result = await _branchRepository.EditBranchValidationAsync(street, id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("BranchDeleteUserValidation/{id}")]
        public async Task<IActionResult> BranchDeleteUserValidation([FromRoute] int id)
        {
            try
            {
                var result = await _branchRepository.BranchDeleteUserValidationAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

    }
}
