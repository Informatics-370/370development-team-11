using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Org.BouncyCastle.Asn1.Cmp;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using System.Data.SqlTypes;
using System.Net.Mime;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Net.Http.Headers;
using Hangfire;
using System.Reflection;
using System.CodeDom;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : Controller
    {
        private readonly IReportsRepository _ReportsRepository;
        public ReportsController(IReportsRepository ReportsRepository)
        {
            _ReportsRepository = ReportsRepository;
        }


        [HttpGet]
        [Route("getBEESpendReport")]
        public async Task<IActionResult> getBEESpendReport()
        {
            try
            {
                var result = await _ReportsRepository.getBEESpendReportAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


    }
}
