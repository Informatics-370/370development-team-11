﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Deposit
    {
        [Key]
        public int Procurement_Deposit_ID { get; set; }
        [Required]
        public int Procurement_Details_ID { get; set; }
        [ForeignKey("Procurement_Details_ID")]
        public Procurement_Details Procurement_Details { get; set; }
        public DateTime Deposit_Due_Date { get; set; }
        public decimal Deposit_Amount { get; set; }
        public decimal Amount_Outstanding { get; set; }
    }
}
