using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories.Procurement_Requests;


namespace ProcionAPI.Controllers.Procurement_Requests
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcurementDetailsController : Controller
    {
        private readonly IProcurementDetailsRepository _ProcurementDetailsRepository;

        public ProcurementDetailsController(IProcurementDetailsRepository ProcurementDetailsRepository)
        {
            _ProcurementDetailsRepository = ProcurementDetailsRepository;
        }

        [HttpGet]
        [Route("GetProcurementRequestByID/{ProcurementRequestID}")]
        public async Task<IActionResult> GetProcurementRequestByID(int ProcurementRequestID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementRequestByIDAsync(ProcurementRequestID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddProcurementDetails")]
        public async Task<IActionResult> CreateProcurementDetails(Procurement_Details ProcurementDetails)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.CreateProcurementDetailsAsync(ProcurementDetails);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


    }
}
