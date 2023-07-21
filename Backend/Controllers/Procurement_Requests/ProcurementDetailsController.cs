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




    }
}
