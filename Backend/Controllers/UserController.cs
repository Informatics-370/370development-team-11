using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Net.Http.Headers;
using System.Runtime.Intrinsics.Arm;

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

//----------------------------------------------------------------------------------------------------- NORMAL LOGIN -------------------------------------------------------------------------------------
        [HttpPost("login/{UserName}/{Password}")]
        public async Task<IActionResult> Login([FromRoute] string UserName, [FromRoute] string Password)
        {
            var dep = "";

            if (await _UserRepository.GetUserByUsername(UserName) != null)
            {
                bool isCredentialsValid = await _UserRepository.VerifyCredentials(UserName, Password);
                if (isCredentialsValid == true)
                {
                    User user = await _UserRepository.GetUserByUsername(UserName);

                    if(user.Role.Name == "Admin")
                    {
                        Admin adm = await _UserRepository.GetAdminByUserNameAsync(UserName);
                        dep = "All";
                    }
                    else
                    {
                        Employee emp = await _UserRepository.GetEmployeeByUserNameAsync(UserName);
                        dep = emp.Department.Name;
                    }

                    

                    // Generate token
                    var token = GenerateToken(user, dep);

                    // Return the token as a response to the Angular frontend
                    return Ok(new { token });
                }
            }

            else if (await _UserRepository.GetAdminByEmailAsync(UserName) != null)
            {
                Admin AdminLogin = await _UserRepository.GetAdminByEmailAsync(UserName);
                var MyUsername = AdminLogin.User.Username;
                bool isCredentialsValid = await _UserRepository.VerifyCredentials(MyUsername, Password);
                if (isCredentialsValid == true)
                {
                    User user = await _UserRepository.GetUserByUsername(MyUsername);
                    dep = "All";

                    // Generate token
                    var token = GenerateToken(user, dep);

                    // Return the token as a response to the Angular frontend
                    return Ok(new { token });
                }
            }

            else if (await _UserRepository.GetEmployeeByEmailAsync(UserName) != null)
            {
                Employee EmpLogin = await _UserRepository.GetEmployeeByEmailAsync(UserName);
                var MyUsername = EmpLogin.User.Username;
                bool isCredentialsValid = await _UserRepository.VerifyCredentials(MyUsername, Password);
                if (isCredentialsValid == true)
                {
                    User user = await _UserRepository.GetUserByUsername(MyUsername);
                    Employee emp = await _UserRepository.GetEmployeeByUserNameAsync(UserName);
                    dep = emp.Department.Name;

                    // Generate token
                    var token = GenerateToken(user, dep);

                    // Return the token as a response to the Angular frontend
                    return Ok(new { token });
                }
            }
            

            return Unauthorized(new { error = "Invalid credentials" });
        }
        private string GenerateToken(User user, string dep)
        {
            
            byte[] key;
            using (var randomNumberGenerator = new RNGCryptoServiceProvider())
            {
                key = new byte[32]; // 256 bits
                randomNumberGenerator.GetBytes(key);
            }
            string encodedKey = Convert.ToBase64String(key);

            var tokenHandler = new JwtSecurityTokenHandler();
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role.Name),
                    new Claim("Department", dep),
                    new Claim("CanAccInv", user.Access.CanAccInv),
                    new Claim("CanAccFin", user.Access.CanAccFin),
                    new Claim("CanAccPro", user.Access.CanAccPro),
                    new Claim("CanAccVen", user.Access.CanAccVen),
                    new Claim("CanAccRep", user.Access.CanAccRep),
                    new Claim("CanViewPenPro", user.Access.CanViewPenPro),
                    new Claim("CanViewFlagPro", user.Access.CanViewFlagPro),
                    new Claim("CanViewFinPro", user.Access.CanViewFinPro),
                    new Claim("CanAppVen", user.Access.CanAppVen),
                    new Claim("CanEditVen", user.Access.CanEditVen),
                    new Claim("CanDeleteVen", user.Access.CanDeleteVen),
                    new Claim("TemAccess", "No"),
                    new Claim("TempAccessUsername", "None"),
            
                }),
                Expires = DateTime.UtcNow.AddHours(3), // Set token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        //-------------------------------------------------------------------------------------------------TEMP ACCESS LOGIN-------------------------------------------------------------------------------

        [HttpPost("loginWithTemp/{UserName}/{Password}/{TempUsername}")]
        public async Task<IActionResult> LoginWithTemp([FromRoute] string UserName, [FromRoute] string Password, Temporary_Access TempAcc, [FromRoute] string TempUsername)
        {
            var dep = "";

            if (await _UserRepository.GetUserByUsername(UserName) != null)
            {
                bool isCredentialsValid = await _UserRepository.VerifyCredentials(UserName, Password);
                if (isCredentialsValid == true)
                {
                    User user = await _UserRepository.GetUserByUsername(UserName);
                    if (user.Role.Name == "Admin")
                    {
                        Admin adm = await _UserRepository.GetAdminByUserNameAsync(UserName);
                        dep = "All";
                    }
                    else
                    {
                        Employee emp = await _UserRepository.GetEmployeeByUserNameAsync(UserName);
                        dep = emp.Department.Name;
                    }

                    // Generate token
                    var token = GenerateTokenWithTemp(user, TempAcc, TempUsername, dep);

                    // Return the token as a response to the Angular frontend
                    return Ok(new { token });
                }
            }

            else if (await _UserRepository.GetAdminByEmailAsync(UserName) != null)
            {
                Admin AdminLogin = await _UserRepository.GetAdminByEmailAsync(UserName);
                var MyUsername = AdminLogin.User.Username;
                bool isCredentialsValid = await _UserRepository.VerifyCredentials(MyUsername, Password);
                if (isCredentialsValid == true)
                {
                    User user = await _UserRepository.GetUserByUsername(MyUsername);
                    dep = "All";

                    // Generate token
                    var token = GenerateTokenWithTemp(user, TempAcc, TempUsername, dep);

                    // Return the token as a response to the Angular frontend
                    return Ok(new { token });
                }
            }

            else if (await _UserRepository.GetEmployeeByEmailAsync(UserName) != null)
            {
                Employee EmpLogin = await _UserRepository.GetEmployeeByEmailAsync(UserName);
                var MyUsername = EmpLogin.User.Username;
                bool isCredentialsValid = await _UserRepository.VerifyCredentials(MyUsername, Password);
                if (isCredentialsValid == true)
                {
                    User user = await _UserRepository.GetUserByUsername(MyUsername);
                    Employee emp = await _UserRepository.GetEmployeeByUserNameAsync(UserName);
                    dep = emp.Department.Name;

                    // Generate token
                    var token = GenerateTokenWithTemp(user, TempAcc, TempUsername, dep);

                    // Return the token as a response to the Angular frontend
                    return Ok(new { token });
                }
            }


            return Unauthorized(new { error = "Invalid credentials" });
        }

        private string GenerateTokenWithTemp(User user, Temporary_Access TempAcc, string TempUsername, string dep)
        {
            byte[] key;
            using (var randomNumberGenerator = new RNGCryptoServiceProvider())
            {
                key = new byte[32]; // 256 bits
                randomNumberGenerator.GetBytes(key);
            }
            string encodedKey = Convert.ToBase64String(key);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role.Name),
                    new Claim("Department", dep),
                    new Claim("TemAccessRole", TempAcc.Name),
                    new Claim("CanAccInv", TempAcc.CanAccInv),
                    new Claim("CanAccFin", TempAcc.CanAccFin),
                    new Claim("CanAccPro", TempAcc.CanAccPro),
                    new Claim("CanAccVen", TempAcc.CanAccVen),
                    new Claim("CanAccRep", TempAcc.CanAccRep),
                    new Claim("CanViewPenPro", TempAcc.CanViewPenPro),
                    new Claim("CanViewFlagPro", TempAcc.CanViewFlagPro),
                    new Claim("CanViewFinPro", TempAcc.CanViewFinPro),
                    new Claim("CanAppVen", TempAcc.CanAppVen),
                    new Claim("CanEditVen", TempAcc.CanEditVen),
                    new Claim("CanDeleteVen", TempAcc.CanDeleteVen),
                    new Claim("TempAccessUsername", TempUsername)
                }),
                Expires = DateTime.UtcNow.AddHours(3), // Set token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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

        [HttpGet]
        [Route("GetEmployeeByEmail/{Email}")]
        public async Task<IActionResult> GetEmployeeByEmail(string Email)
        {
            try
            {
                var result = await _UserRepository.GetEmployeeByEmailAsync(Email);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetEmployeeByDepartment/{dep}")]
        public async Task<IActionResult> GetEmployeeByDepartment(string dep)
        {
            try
            {
                var result = await _UserRepository.GetEmployeeByDepartmentAsync(dep);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetAdminByEmail/{Email}")]
        public async Task<IActionResult> GetAdminByEmail(string Email)
        {
            try
            {
                var result = await _UserRepository.GetAdminByEmailAsync(Email);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetEmployeeByUsername/{username}")]
        public async Task<IActionResult> GetEmployeeByUserNameAsync(string username)
        {
            try
            {
                var result = await _UserRepository.GetEmployeeByUserNameAsync(username);
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

        [HttpGet]
        [Route("GetUserByUsername/{username}")]
        public async Task<IActionResult> GetUserByUserNameAsync(string username)
        {
            try
            {
                var result = await _UserRepository.GetUserByUserNameAsync(username);
                if (result == null) return NotFound("User does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetUserByRole/{role}")]
        public async Task<IActionResult> GetUserByRole(string role)
        {
            try
            {
                var result = await _UserRepository.GetUserByRoleAsync(role);
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
        [Route("UpdatePassword/{userID}/{NewPassword}")]
        public async Task<ActionResult> UpdatePassword([FromRoute] int userID, [FromRoute] string NewPassword)
        {
            try
            {
                var result = await _UserRepository.UpdateUserPassword(userID, NewPassword);
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
                if (existingUser == null)
                {
                    return NotFound($"The employee does not exist");
                }
                else
                {
                    _UserRepository.Delete(existingUser);
                    if (await _UserRepository.SaveChangesAsync())
                    {
                        return Ok(existingUser);
                    }
                }
                
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
                var existingUser = await _UserRepository.GetDeleteUserAsync(userID);
                if (existingUser == null)
                {
                    return NotFound($"The user does not exist");
                }
                else
                {
                    _UserRepository.Delete(existingUser);
                    if (await _UserRepository.SaveChangesAsync())
                    {
                        return Ok(existingUser);
                    }
                }
                
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpDelete]
        [Route("DeleteUserAccess/{userID}")]
        public async Task<IActionResult> DeleteUserAccess(int userID)
        {
            try
            {
                var existingAccess = await _UserRepository.GetAccessAsync(userID);
                Console.WriteLine(existingAccess.Access_ID);
                _UserRepository.Delete(existingAccess);
                if (await _UserRepository.SaveChangesAsync())
                {
                    return Ok(existingAccess);
                }

               
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

        [HttpGet]
        [Route("GetAdminByUsername/{username}")]
        public async Task<IActionResult> GetAdminByUserNameAsync(string username)
        {
            try
            {
                var result = await _UserRepository.GetAdminByUserNameAsync(username);
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
                if (existingUser == null)
                {
                    return NotFound($"The admin does not exist");
                }
                else
                {
                    _UserRepository.Delete(existingUser);
                    if (await _UserRepository.SaveChangesAsync())
                    {
                        return Ok(existingUser);
                    }
                }
                
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpGet]
        [Route("CreateUserValidation/{name}")]
        public async Task<IActionResult> CreateUserValidation([FromRoute] string name)
        {
            try
            {
                var result = await _UserRepository.CreateUserValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("CreateUserRoleValidation/{department}/{role}")]
        public async Task<IActionResult> CreateUserRoleValidation([FromRoute] string department, [FromRoute] string role)
        {
            try
            {
                var result = await _UserRepository.CreateUserRoleValidationAsync(department, role);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("EditUserValidation/{name}/{id}")]
        public async Task<IActionResult> EditUserValidation([FromRoute] string name, int id)
        {
            try
            {
                var result = await _UserRepository.EditUserValidationAsync(name, id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpPost, DisableRequestSizeLimit]
        [Route("uploadPhoto")]
        public async Task<IActionResult> Upload()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var folderName = Path.Combine("Files", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file == null || file.Length == 0) return BadRequest("No file selected");
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                return Ok(new {dbPath});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("VerifyCredentials/{Username}/{Password}")]
        public async Task<IActionResult> VerifyUserCredentials([FromRoute] string UserName, [FromRoute] string Password)
        {
            bool isCredentialsValid = await _UserRepository.VerifyCredentials(UserName, Password);
            if (isCredentialsValid == true)
            {
                return Ok(isCredentialsValid);
            }

            return Unauthorized(new { error = "Invalid credentials" });
        }

        [HttpPut]
        [Route("ResetNotif/{username}")]
        public async Task<ActionResult> ResetNumNotifications([FromRoute] string username)
        {
            try
            {
                var result = await _UserRepository.ResetNumNotifications(username);
                return Ok(result);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPost]
        [Route("AddLog")]
        public async Task<IActionResult> AddLog(AuditLog LogAdd)
        {
            try
            {
                var result = await _UserRepository.AddLogAsync(LogAdd);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetLogs")]
        public async Task<IActionResult> GetAllLogs()
        {
            try
            {
                var result = await _UserRepository.GetAllLogsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("UserDeleteNotificationValidation/{id}")]
        public async Task<IActionResult> UserDeleteNotificationValidation([FromRoute] int id)
        {
            try
            {
                var result = await _UserRepository.UserDeleteNotificationValidationAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("UserDeleteDelegationValidation/{id}/{username}")]
        public async Task<IActionResult> UserDeleteDelegationValidation([FromRoute] int id, [FromRoute] string username)
        {
            try
            {
                var result = await _UserRepository.UserDeleteDelegationValidationAsync(id, username);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("UserDeleteProcurementRequestValidation/{id}")]
        public async Task<IActionResult> UserDeleteProcurementRequestValidation([FromRoute] int id)
        {
            try
            {
                var result = await _UserRepository.UserDeleteProcurementRequestValidationAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("UserDeleteOnboardRequestValidation/{id}")]
        public async Task<IActionResult> UserDeleteOnboardRequestValidation([FromRoute] int id)
        {
            try
            {
                var result = await _UserRepository.UserDeleteOnboardRequestValidationAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("EmployeeDeleteProcurementDetailsValidation/{id}")]
        public async Task<IActionResult> EmployeeDeleteProcurementDetailsValidation([FromRoute] int id)
        {
            try
            {
                var result = await _UserRepository.EmployeeDeleteProcurementDetailsValidationAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("AdminDeleteDelegationValidation/{id}")]
        public async Task<IActionResult> AdminDeleteDelegationValidation([FromRoute] int id)
        {
            try
            {
                var result = await _UserRepository.AdminDeleteDelegationValidationAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
