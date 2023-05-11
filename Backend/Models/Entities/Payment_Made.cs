﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Payment_Made
    {
        [Key]
        public int Payment_Made_ID { get; set; }
        [Required]
        public int Procurement_Request_ID { get; set; }

        [ForeignKey("Procurement_Request_ID")]
        public Procurement_Request Procurement_Request { get; set; }
        public DateTime Paid_On_Date { get; set; }
        public string Receipt_Upload { get; set; }
    }
}