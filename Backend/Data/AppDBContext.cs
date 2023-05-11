﻿using Microsoft.EntityFrameworkCore;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options)
            : base(options)
        {
        }

        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<Branch> Branch { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<Mandate_Limit> Mandate_Limit { get; set; }
        public DbSet<Budget_Allocation> Budget_Allocation { get; set; }
        public DbSet<Budget_Category> Budget_Category { get; set; }
        public DbSet<Budget_Line> Budget_Line { get; set; }
        public DbSet<Access> Access { get; set; }
        public DbSet<Temporary_Access> Temporary_Access { get; set; }
        public DbSet<Delegation_Of_Authority> Delegation_Of_Authority { get; set; }
        public DbSet<Delegation_Status> Delegation_Status { get; set; }
        public DbSet<Calender_Item> Calender_Items { get; set; }
        public DbSet<Importance_Level> Importance_Level { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<Notification_Type> Notification_Type { get; set; }
        public DbSet<Procurement_Request> Procurement_Request { get; set; }
        public DbSet<Requisition_Status> Requisition_Status { get; set; }
        public DbSet<Payment_Made> Payment_Made { get; set; }
        public DbSet<Sign_Off_Status> Sign_Off_Status { get; set; }
        public DbSet<Payment_Method> Payment_Method { get; set; }
        public DbSet<Proof_Of_Payment> Proof_Of_Payment { get; set; }
        public DbSet<Procurement_Payment_Status> Procurement_Payment_Status { get; set; }
        public DbSet<Procurement_Status> Procurement_Status { get; set; }
        public DbSet<Vendor> Vendor { get; set; }
        public DbSet<Vendor_Status> Vendor_Status { get; set; }
        public DbSet<Onboard_Request> Onboard_Request { get; set; }
        public DbSet<Vendor_Detail> Vendor_Detail { get; set; }
        public DbSet<Vendor_Category> Vendor_Category { get; set; }
        public DbSet<Vendor_Fax> Vendor_Fax { get; set; }
        public DbSet<Vendor_Website> Vendor_Website { get; set; }
        public DbSet<Vendor_Vat> Vendor_Vat { get; set; }
        public DbSet<Vendor_Registration> Vendor_Registration { get; set; }
        public DbSet<Vendor_Tax> Vendor_Tax { get; set; }
        public DbSet<Sole_Supplier> Sole_Supplier { get; set; }
        public DbSet<Vendor_Popia> Vendor_Popia { get; set; }
        public DbSet<Vendor_Payment_Terms> Vendor_Payment_Terms { get; set; }
        public DbSet<Vendor_Insurance> Vendor_Insurance { get; set; }
        public DbSet<Vendor_Agreement> Vendor_Agreement { get; set; }
        public DbSet<Vendor_License> Vendor_License { get; set; }
        public DbSet<Due_Dillegence> Due_Dillegence { get; set; }
        public DbSet<POPI> POPI { get; set; }
        public DbSet<Contracted_Partner_Type> Contracted_Partner_Type { get; set; }
        public DbSet<VAT> VAT { get; set; }
        public DbSet<HELP> HELP { get; set; }
        public DbSet<Help_Category> Help_Category { get; set; }
        public DbSet<Consumable> Consumable { get; set; }
        public DbSet<Consumable_Category> Consumable_Category { get; set; }
        public DbSet<Procurement_Consumable> Procurement_Consumable { get; set; }
        public DbSet<Vendor_Consumable> Vendor_Consumable { get; set; }
        public DbSet<Asset> Asset { get; set; } 
        public DbSet<Vendor_Asset> Vendor_Asset { get; set; }
        public DbSet<Procurement_Asset> Procurement_Asset { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Budget_Line>()
                .HasKey(bl => new { bl.Account_Code, bl.Budget_ID, bl.Category_ID });

            modelBuilder.Entity<Onboard_Request>()
               .HasKey(or => new {or.Onboard_Request_Id, or.User_Id, or.Vendor_ID });

            modelBuilder.Entity<Procurement_Asset>()
               .HasKey(pa => new { pa.Procurement_Asset_ID, pa.Procurement_Request_ID, pa.Asset_ID });

            modelBuilder.Entity<User_Access>()
                .HasKey(ua => new { ua.Role_ID, ua.Access_ID });

            modelBuilder.Entity<Vendor_Consumable>()
                .HasKey(vc => new { vc.Vendor_Consumbale_ID, vc.Consumable_ID, vc.Vendor_Detail_ID });


            modelBuilder.Entity<Consumable>()
            .HasData(
            new
            {
                Consumable_ID = 1,
                Consumable_Category_ID = 1,
                Name = "Water",
                Description = "Bonaqua",
                On_Hand = 2,
                Minimum_Reorder_Quantity = 50,
                Maximum_Reorder_Quantity = 100

            }
            );

            modelBuilder.Entity<Consumable_Category>()
            .HasData(
            new
            {
                Consumable_Category_ID = 1,
                Name = "Kitchen",
                Description = "Mykitchen",

            }
            );

            modelBuilder.Entity<User>()
            .HasData(
            new
            {
                User_Id = 1,
                Role_ID = 1,
                Username = "JDoe",
                Password = "JDoe123",
                Profile_Picture = "test",

            }
            );

            modelBuilder.Entity<Role>()
            .HasData(
            new
            {
                Role_ID = 1,
                Name = "MD",
                Description = "Managing Director",
 
            }
            );

            modelBuilder.Entity<Employee>()
            .HasData(
            new
            {
                EmployeeID = 1,
                User_Id = 1,
                Department_ID = 1,
                Branch_ID = 1,
                Mandate_ID = 1,
                EmployeeName = "John",
                EmployeeSurname = "Doe",
                CellPhone_Num = "074 845 2548",
                Email = "jdoe@gmail.com",

            }
            );

            modelBuilder.Entity<Mandate_Limit>()
            .HasData(
            new
            {
                Mandate_ID = 1,
                Ammount = 10000.00,
                Date = DateTime.Now,
            }
            );

            modelBuilder.Entity<Branch>()
            .HasData(
            new
            {
                Branch_ID = 1,
                Name = "Pretoria",
                Street = "Jean Ave",
                City = "Pretoria",
                Postal_Code = "0042",
                Province = "Gauteng",

            }
            );

            modelBuilder.Entity<Department>()
            .HasData(
            new
            {
                Department_ID = 1,
                Name = "BE",
                Description = "Business Enablement",

            }
            );

            modelBuilder.Entity<Vendor_Status>()
           .HasData(
           new
           {
               Vendor_Status_ID = 1,
               Name = "pain",
               Description = "more",

           }
           );

            //modelBuilder.Entity<Vendor>()
            //.HasData(
            //new
            //{
            //    Vendor_ID = 1,
            //    Vendor_Status_ID = 1,
            //    Name = "why",
            //    Email = "BE@gmail.com",
            //    Number_Of_Times_Used = 0,
            //}, 
            //new
            //{
            //    Vendor_ID = 2,
            //    Vendor_Status_ID = 1,
            //    Name = "tell",
            //    Email = "tell@gmail.com",
            //    Number_Of_Times_Used = 0,
            //},
            //new
            //{
            //    Vendor_ID = 3,
            //    Vendor_Status_ID = 1,
            //    Name = "tebooll",
            //    Email = "tebooll@gmail.com",
            //    Number_Of_Times_Used = 0,
            //},
            //new
            //{
            //    Vendor_ID = 4,
            //    Vendor_Status_ID = 1,
            //    Name = "te",
            //    Email = "te@wgmail.com",
            //    Number_Of_Times_Used = 0,
            //}
            //);

            //modelBuilder.Entity<Onboard_Request>()
            //.HasData(
            //new
            //{
            //    Onboard_Request_Id = 1,
            //    User_Id = 1,
            //    Vendor_ID = 1,
            //    Quotes = "BE",
            //},
            //new
            //{
            //    Onboard_Request_Id = 1,
            //    User_Id = 1,
            //    Vendor_ID = 2,
            //    Quotes = "SOwhy",
            //},
            //new
            //{
            //    Onboard_Request_Id = 2,
            //    User_Id = 1,
            //    Vendor_ID = 3,
            //    Quotes = "ohno",
            //},
            //new
            //{
            //    Onboard_Request_Id = 2,
            //    User_Id = 1,
            //    Vendor_ID = 4,
            //    Quotes = "anyway",
            //}
            //);

        }
    }
}