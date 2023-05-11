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
    public class DepartmentController : ControllerBase
    {

        private readonly IDepartmentRepository _departmentRepository;
        public DepartmentController(IDepartmentRepository DepartmentRepository)
        {
            _departmentRepository = DepartmentRepository;
        }

        [HttpGet]
        [Route("GetDepartments")]
        public async Task<IActionResult> GetAllDepartments()
        {
            try
            {
                var result = await _departmentRepository.GetAllDepartmentsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route ("CreateDepartment")]
        public async Task<IActionResult> AddDepartment([FromBody] Department AddDepartment)
        {
            try
            {
                var result = await _departmentRepository.AddDepartmentAsync(AddDepartment);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
       
        [HttpPut]
        [Route("EditDepartment/{Department_ID}")]
        public async Task<ActionResult<Department>> EditDepartment(int Department_ID, Department EditDepartmentRequest)
        {
            try
            {
                var existingDepartment = await _departmentRepository.GetDepartmentAsync(Department_ID);
                if (existingDepartment == null) return NotFound($"The role does not exist");

                existingDepartment.Name = EditDepartmentRequest.Name;
                existingDepartment.Description = EditDepartmentRequest.Description;

                if (await _departmentRepository.SaveChangesAsync())
                {
                    return Ok(existingDepartment);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }
       
        [HttpDelete]
        [Route("DeleteDepartment/{Department_ID}")]
        public async Task<IActionResult> DeleteDepartment(int Department_ID)
        {
            try
            {
                var existingDepartment = await _departmentRepository.GetDepartmentAsync(Department_ID);
                if (existingDepartment == null) return NotFound($"The role does not exist");
                _departmentRepository.Delete(existingDepartment);
                if (await _departmentRepository.SaveChangesAsync()) return Ok(existingDepartment);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }
       
        [HttpGet]
        [Route("GetDepartment/{Department_ID}")]
        public async Task<IActionResult> GetDepartment(int Department_ID)
        {
            try
            {
                var result = await _departmentRepository.GetDepartmentAsync(Department_ID);
                if (result == null) return NotFound("Course does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("DepartmentValidation/{name}")]
        public async Task<IActionResult> DepartmentValidation([FromRoute] string name)
        {
            try
            {
                var result = await _departmentRepository.DepartmentValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
