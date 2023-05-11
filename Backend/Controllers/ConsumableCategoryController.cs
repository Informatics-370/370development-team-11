using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;




namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumableCategoryController : ControllerBase
    {
        private readonly IConsumableCategoryRepository _consumableCategoryRepository;

        public ConsumableCategoryController(IConsumableCategoryRepository ConsumableCategoryRepository)
        {
            _consumableCategoryRepository = ConsumableCategoryRepository;
        }

        [HttpGet]
        [Route("GetConsumableCategories")]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var result = await _consumableCategoryRepository.GetAllCategoriesAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
