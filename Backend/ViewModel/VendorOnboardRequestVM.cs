using ProcionAPI.Models.Entities;

namespace ProcionAPI.ViewModel
{
    public class VendorOnboardRequestVM
    {
        public int Onboard_Request_Id { get; set; }
        public int Vendor_ID { get; set; }
        public int Onboard_Request_status_ID { get; set; }
        public string EmployeeName { get; set; }
        public Vendor Vendors { get; set; }
        public string Quotes { get; set; }
    }
}
