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

    public class RoleController: ControllerBase
    {
        private readonly IRoleRepository _RoleRepository;

        public RoleController(IRoleRepository RoleRepository)
        {
            _RoleRepository = RoleRepository;
        }

        [HttpPost]
        [Route("CreateRole")]
        public async Task<IActionResult> CreateRole([FromBody] Role RoleAdd)
        {
            try
            {
                var result = await _RoleRepository.AddRoleAsync(RoleAdd);
                return Ok(result);
            }
            catch (Exception) 
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var result = await _RoleRepository.GetAllRoleAsync();
                return Ok(result);
            }
            catch (Exception) 
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetRole/{roleID}")]
        public async Task<IActionResult> GetRoleAsync(int roleID)
        {
            try
            {
                var result = await _RoleRepository.GetRoleAsync(roleID);
                if (result == null) return NotFound("Role does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        
        [HttpPut]
        [Route("EditRole/{roleID}")]
        public async Task<ActionResult<Role>> EditRole([FromRoute] int roleID, Role RoleEdit)
        {
            try
            {
                var result = await _RoleRepository.UpdateRoleAsync(roleID, RoleEdit);
                return Ok(result);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpDelete]
        [Route("DeleteRole/{roleID}")]
        public async Task<IActionResult> DeleteRole(int roleID)
        {
            try
            {
                var existingRole = await _RoleRepository.GetRoleAsync(roleID);
                if (existingRole == null) return NotFound($"The role does not exist");
                _RoleRepository.Delete(existingRole);
                if (await _RoleRepository.SaveChangesAsync()) return Ok(existingRole);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpGet]
        [Route("CreateRoleValidation/{name}")]
        public async Task<IActionResult> CreateRoleValidation([FromRoute] string name)
        {
            try
            {
                var result = await _RoleRepository.CreateRoleValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("EditRoleValidation/{name}/{id}")]
        public async Task<IActionResult> EditRoleValidation([FromRoute] string name, int id)
        {
            try
            {
                var result = await _RoleRepository.EditRoleValidationAsync(name, id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}