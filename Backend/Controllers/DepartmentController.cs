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
        [Route("GetAllDepartments")]
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
        [Route ("AddDepartment")]
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
        [Route ("EditDepartment{Department_ID}")]
        public async Task<ActionResult> EditDepartment([FromRoute] int Department_ID, Department EditDepartmentRequest)
        {
            var results = await _departmentRepository.EditDepartmentAsync(Department_ID, EditDepartmentRequest);
            return Ok(results);
        }

        [HttpDelete]
        [Route("DeleteDepartment{Department_ID}")]
        public async Task<ActionResult> DeleteDepartment([FromRoute] int Department_ID)
        {
            var results = await _departmentRepository.DeleteDepartmentAsync(Department_ID);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetDepartment{Department_ID}")]
        public async Task<IActionResult> GetDepartment([FromRoute] int Department_ID)
        {
            try
            {
                var result = await _departmentRepository.GetDepartmentAsync(Department_ID);
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
