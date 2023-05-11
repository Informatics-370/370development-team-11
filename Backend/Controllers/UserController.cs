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
        public async Task<IActionResult> CreateUser(User UserAdd, string name)
        {
            try
            {
                var result = await _UserRepository.AddUserAsync(UserAdd, name);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("CreateEmployee")]
        public async Task<IActionResult> CreateEmployee(Employee EmployeeAdd, string usrName, string brName, string depName, int mlAmount)
        {
            try
            {
                var result = await _UserRepository.AddEmployeeAsync(EmployeeAdd, usrName, brName, depName, mlAmount);
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
        public async Task<ActionResult> EditUser(User UserEdit, int userID)
        {
            try
            {
                var existingUser = await _UserRepository.GetUserAsync(userID);
                if (existingUser == null) return NotFound($"The user does not exist");
                existingUser.Username = UserEdit.Username;
                existingUser.Password = UserEdit.Password;
                existingUser.Role_ID = UserEdit.Role_ID;

                if(await _UserRepository.SaveChangesAsync())
                {
                    return Ok(existingUser);
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpPut]
        [Route("EditEmployee/{userID}")]
        public async Task<ActionResult> EditEmployee(Employee EmpEdit, int userID)
        {
            try
            {
                var existingEMP = await _UserRepository.GetEmployeeAsync(userID);
                if (existingEMP == null) return NotFound($"The employee does not exist");
                existingEMP.EmployeeName = EmpEdit.EmployeeName;
                existingEMP.EmployeeSurname = EmpEdit.EmployeeSurname;
                existingEMP.CellPhone_Num = EmpEdit.CellPhone_Num;
                existingEMP.Email = EmpEdit.Email;
                existingEMP.Branch_ID = EmpEdit.Branch_ID;
                existingEMP.Department_ID = EmpEdit.Department_ID;
                existingEMP.Mandate_ID = EmpEdit.Mandate_ID;

                if (await _UserRepository.SaveChangesAsync())
                {
                    return Ok(existingEMP);
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
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
        public async Task<IActionResult> CreateAdmin(Admin AdminAdd, string usrName)
        {
            try
            {
                var result = await _UserRepository.AddAdminAsync(AdminAdd, usrName);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("EditAdmin/{userID}")]
        public async Task<ActionResult> EditAdmin(Admin AdminEdit, int userID)
        {
            try
            {
                var existingADM = await _UserRepository.GetAdminAsync(userID);
                if (existingADM == null) return NotFound($"The admin does not exist");
                existingADM.AdminName = AdminEdit.AdminName;
                existingADM.AdminSurname = AdminEdit.AdminSurname;
                existingADM.CellPhone_Num = AdminEdit.CellPhone_Num;
                existingADM.Email = AdminEdit.Email;

                if (await _UserRepository.SaveChangesAsync())
                {
                    return Ok(existingADM);
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
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
    }
}
