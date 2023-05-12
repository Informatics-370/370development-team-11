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


        [HttpPost]
        [Route("CreateCategory")]
        public async Task<IActionResult> CreateConsumable([FromBody] Consumable_Category CategoryAdd)
        {
            try
            {
                var result = await _consumableCategoryRepository.AddCategoryAsync(CategoryAdd);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetConsumableCategoryByID/{id}")]
        public async Task<IActionResult> GetConsumableByID([FromRoute] int id)
        {
            try
            {
                var result = await _consumableCategoryRepository.GetCategoryByIDAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateConsumableCategory/{id}")]
        public async Task<IActionResult> UpdateCategory([FromRoute] int id, Consumable_Category CategoryRequest)
        {
            try
            {
                var result = await _consumableCategoryRepository.UpdateConsumableCategoryAsync(id, CategoryRequest);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int id)
        {
            try
            {
                var result = await _consumableCategoryRepository.DeleteCategoryAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("CategoryValidation/{name}/{description}")]
        public async Task<IActionResult> ConsumableValidation([FromRoute] string name, [FromRoute] string description)
        {
            try
            {
                var result = await _consumableCategoryRepository.CategoryValidationAsync(name, description);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
