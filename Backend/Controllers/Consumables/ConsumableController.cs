using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using ProcionAPI.Models.Repositories.Consumables;

namespace ProcionAPI.Controllers.Consumables
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumableController : ControllerBase
    {
        private readonly IConsumableRepository _consumableRepository;

        public ConsumableController(IConsumableRepository ConsumableRepository)
        {
            _consumableRepository = ConsumableRepository;
        }

        [HttpPost]
        [Route("CreateConsumable")]
        public async Task<IActionResult> CreateConsumable([FromBody] Consumable ConsumableAdd)
        {
            try
            {
                var result = await _consumableRepository.AddConsumableAsync(ConsumableAdd);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetConsumables")]
        public async Task<IActionResult> GetAllConsumables()
        {
            try
            {
                var result = await _consumableRepository.GetAllConsumableAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetConsumableByID/{id}")]
        public async Task<IActionResult> GetConsumableByID([FromRoute] int id)
        {
            try
            {
                var result = await _consumableRepository.GetConsumablesByIDAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ConsumableValidation/{name}/{category}")]
        public async Task<IActionResult> ConsumableValidation([FromRoute] string name, [FromRoute] string category)
        {
            try
            {
                var result = await _consumableRepository.ConsumableValidationAsync(name, category);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteConsumable/{id}")]
        public async Task<IActionResult> DeleteConsumable([FromRoute] int id)
        {
            try
            {
                var result = await _consumableRepository.DeleteConsumableAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateConsumable/{id}")]
        public async Task<IActionResult> UpdateConsumable([FromRoute] int id, Consumable ConsumableRequest)
        {
            try
            {
                var result = await _consumableRepository.UpdateConsumableAsync(id, ConsumableRequest);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("UpdateStock")]
        public async Task<IActionResult> UpdateStock([FromBody] Consumable_History HistoryRequest)
        {
            try
            {
                var result = await _consumableRepository.UpdateStockAsync(HistoryRequest);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("PredictConsumable/{id}")]
        public async Task<IActionResult> PredictConsumable([FromRoute] int id)
        {
            try
            {
                var result = await _consumableRepository.PredictStockLevelAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("ConsumableAddNotification")]
        public async Task<IActionResult> ConsumableAddNotification(Notification ConsumableNotif)
        {
            try
            {
                var result = await _consumableRepository.AddNotificationAsync(ConsumableNotif);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

    }
}
