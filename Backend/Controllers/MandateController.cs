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
    public class MandateController : ControllerBase
    {
        private readonly IMandateRepository _repository;

        public MandateController(IMandateRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllMandateLimits")]
        public async Task<IActionResult> GetAllMandateLimits()
        {
            try
            {
                var results = await _repository.GetAllMandateLimitsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetMandateLimit/{mandateId}")]
        public async Task <IActionResult> GetMandateLimit(int mandateId)
        {
            try
            {
                var result = await _repository.GetMandateLimitAsync(mandateId);
                if (result == null) return NotFound("Mandate Limit does not exist");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddMandateLimit")]
        public async Task<IActionResult> AddMandateLimit(Mandate_Limit mandate_Limit)
        {
            var _mandate_Limit = new Mandate_Limit { Date = mandate_Limit.Date, Ammount = mandate_Limit.Ammount};
            try
            {
                _repository.Add(_mandate_Limit);
                await _repository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return Ok(_mandate_Limit);
        }

        [HttpPut]
        [Route("EditMandateLimit/{mandateId}")]

        public async Task<IActionResult> EditMandateLimit(int mandateId, Mandate_Limit mandate_Limit)
        {
            try
            {
                var existingMandateLimit = await _repository.GetMandateLimitAsync(mandateId);
                if (existingMandateLimit == null) return NotFound("The mandate limit does not exist.");

                existingMandateLimit.Date = mandate_Limit.Date;
                existingMandateLimit.Ammount = mandate_Limit.Ammount;

                if(await _repository.SaveChangesAsync())
                {
                    return Ok(existingMandateLimit);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteMandateLimit/{mandateId}")]
        public async Task<IActionResult> DeleteMandateLimit(int mandateId)
        {
            try
            {
                var existingMandateLimit = await _repository.GetMandateLimitAsync(mandateId);

                if (existingMandateLimit == null) return NotFound("The Mandate limit does not exist");

                _repository.Delete(existingMandateLimit);
                if (await _repository.SaveChangesAsync()) return Ok(existingMandateLimit);
            }
            catch (Exception )
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
        
}
