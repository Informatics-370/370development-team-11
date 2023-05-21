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
    public class UserController : Controller
    {
        public readonly IUserRepository _UserRepository;

        public UserController(IUserRepository UserRepository)
        {
            _UserRepository = UserRepository;
        }

        [HttpGet]
        [Route("GetEmployees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            try
            {
                var result = await _UserRepository.GetAllEmployeesAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("Login/{Username}/{Password}")]
        public async Task<IActionResult> Login([FromRoute] string Username, [FromRoute] string Password)
        {
            try
            {
                var result = await _UserRepository.Login(Username, Password);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var result = await _UserRepository.GetAllUsersAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetEmployee/{userID}")]
        public async Task<IActionResult> GetEmployeeAsync(int userID)
        {
            try
            {
                var result = await _UserRepository.GetEmployeeAsync(userID);
                if (result == null) return NotFound("Employee does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<IActionResult> CreateUser(User UserAdd)
        {
            try
            {
                var result = await _UserRepository.AddUserAsync(UserAdd);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("CreateEmployee")]
        public async Task<IActionResult> CreateEmployee(Employee EmployeeAdd)
        {
            try
            {
                var result = await _UserRepository.AddEmployeeAsync(EmployeeAdd);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetUser/{userID}")]
        public async Task<IActionResult> GetUserAsync(int userID)
        {
            try
            {
                var result = await _UserRepository.GetUserAsync(userID);
                if (result == null) return NotFound("User does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPut]
        [Route("EditUser/{userID}")]
        public async Task<ActionResult> EditUser( User UserEdit, [FromRoute] int userID)
        {
            try
            {
                var result = await _UserRepository.UpdateUserAsync(UserEdit, userID);
                return Ok(result);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            
        }

        [HttpPut]
        [Route("EditEmployee/{userID}")]
        public async Task<ActionResult> EditEmployee(Employee EmpEdit, [FromRoute] int userID)
        {
            try
            {
                var result = await _UserRepository.UpdateEmployeeAsync(EmpEdit, userID);
                return Ok(result);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpDelete]
        [Route("DeleteEmployee/{userID}")]
        public async Task<IActionResult> DeleteEmployee(int userID)
        {
            try
            {
                var existingUser = await _UserRepository.GetEmployeeAsync(userID);
                if (existingUser == null) return NotFound($"The employee does not exist");
                _UserRepository.Delete(existingUser);
                if (await _UserRepository.SaveChangesAsync()) return Ok(existingUser);
            }
            catch {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpDelete]
        [Route("DeleteUser/{userID}")]
        public async Task<IActionResult> DeleteUser(int userID)
        {
            try
            {
                var existingUser = await _UserRepository.GetUserAsync(userID);
                if (existingUser == null) return NotFound($"The user does not exist");
                _UserRepository.Delete(existingUser);
                if (await _UserRepository.SaveChangesAsync()) return Ok(existingUser);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpGet]
        [Route("GetAdmins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            try
            {
                var result = await _UserRepository.GetAllAdminsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetAdmin/{userID}")]
        public async Task<IActionResult> GetAdminAsync(int userID)
        {
            try
            {
                var result = await _UserRepository.GetAdminAsync(userID);
                if (result == null) return NotFound("Admin does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPost]
        [Route("CreateAdmin")]
        public async Task<IActionResult> CreateAdmin(Admin AdminAdd)
        {
            try
            {
                var result = await _UserRepository.AddAdminAsync(AdminAdd);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("EditAdmin/{userID}")]
        public async Task<ActionResult> EditAdmin(Admin AdminEdit, [FromRoute] int userID)
        {
            try
            {
                var result = await _UserRepository.UpdateAdminAsync(AdminEdit, userID);
                return Ok(result);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpDelete]
        [Route("DeleteAdmin/{userID}")]
        public async Task<IActionResult> DeleteAdmin(int userID)
        {
            try
            {
                var existingUser = await _UserRepository.GetAdminAsync(userID);
                if (existingUser == null) return NotFound($"The admin does not exist");
                _UserRepository.Delete(existingUser);
                if (await _UserRepository.SaveChangesAsync()) return Ok(existingUser);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpGet]
        [Route("UserValidation/{name}")]
        public async Task<IActionResult> UserValidation([FromRoute] string name)
        {
            try
            {
                var result = await _UserRepository.UserValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
