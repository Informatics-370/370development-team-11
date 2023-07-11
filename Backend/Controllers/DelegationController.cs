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

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DelegationController : Controller
    {
        public readonly IDelegationRepository _DelegationRepository;

        public DelegationController(IDelegationRepository DelegationRepository)
        {
            _DelegationRepository = DelegationRepository;
        }

        [HttpGet]
        [Route("GetDelegations")]
        public async Task<IActionResult> GetAllDelegations()
        {
            try
            {
                var result = await _DelegationRepository.GetAllDelegationsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
