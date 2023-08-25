using Microsoft.EntityFrameworkCore;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;

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
        public DbSet<Procurement_Request_Quote> Procurement_Request_Quote { get; set; }
        public DbSet<Procurement_Details> Procurement_Details { get; set; }
        public DbSet<Requisition_Status> Requisition_Status { get; set; }
        public DbSet<Payment_Made> Payment_Made { get; set; }
        public DbSet<Sign_Off_Status> Sign_Off_Status { get; set; }
        public DbSet<Deposit> Deposit { get; set; }
        public DbSet<Payment_Method> Payment_Method { get; set; }
        public DbSet<Proof_Of_Payment> Proof_Of_Payment { get; set; }
        public DbSet<Procurement_Payment_Status> Procurement_Payment_Status { get; set; }
        public DbSet<Procurement_Status> Procurement_Status { get; set; }
        public DbSet<Vendor> Vendor { get; set; }
        public DbSet<Vendor_Status> Vendor_Status { get; set; }
        public DbSet<Onboard_Request> Onboard_Request { get; set; }
        public DbSet<Onboard_Status> Onboard_Status { get; set; }
        public DbSet<Vendor_Detail> Vendor_Detail { get; set; }
        public DbSet<Vendor_Category> Vendor_Category { get; set; }
        public DbSet<Vendor_Fax> Vendor_Fax { get; set; }
        public DbSet<Vendor_Website> Vendor_Website { get; set; }
        public DbSet<Vendor_Vat> Vendor_Vat { get; set; }
        public DbSet<Vendor_BEE> Vendor_BEE { get; set; }
        public DbSet<Vendor_Registration> Vendor_Registration { get; set; }
        public DbSet<Vendor_Tax> Vendor_Tax { get; set; }
        public DbSet<Sole_Supplier> Sole_Supplier { get; set; }
        public DbSet<Vendor_Popia> Vendor_Popia { get; set; }
        public DbSet<Vendor_Payment_Terms> Vendor_Payment_Terms { get; set; }
        public DbSet<Vendor_Insurance> Vendor_Insurance { get; set; }
        public DbSet<Vendor_Insurance_Type> Vendor_Insurance_Type { get; set; }
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
        public DbSet<Consumable_History> Consumable_History { get; set; }
        public DbSet<AuditLog> AuditLog { get; set; }
        public DbSet<Procurement_Invoice> Procurement_Invoice { get; set; }

        UserRepository userrep = new UserRepository();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Budget_Line>()
                .HasKey(bl => new { bl.BudgetLineId });

            modelBuilder.Entity<Onboard_Request>()
               .HasKey(or => new {or.Onboard_Request_Id, or.User_Id, or.Vendor_ID });

            modelBuilder.Entity<Procurement_Asset>()
               .HasKey(pa => new { pa.Procurement_Asset_ID, pa.Procurement_Details_ID, pa.Asset_ID });

            modelBuilder.Entity<User_Access>()
                .HasKey(ua => new { ua.Role_ID, ua.Access_ID });

            modelBuilder.Entity<Vendor_Consumable>()
                .HasKey(vc => new { vc.Vendor_Consumbale_ID, vc.Consumable_ID, vc.Vendor_ID });


            modelBuilder.Entity<Consumable_Category>()
            .HasData(
            new
            {
                Consumable_Category_ID = 1,
                Name = "Kitchen",
                Description = "Mykitchen",

            }
            );
            modelBuilder.Entity<Access>()
            .HasData(
            new
            {
                Access_ID = 1,
                IsAdmin = "true",
                CanAccInv = "true",
                CanAccFin = "true",
                CanAccPro = "true",
                CanAccVen = "true",
                CanAccRep = "true",
                CanViewPenPro = "true",
                CanViewFlagPro = "true",
                CanViewFinPro = "true",
                CanAppVen = "true",
                CanEditVen = "true",
                CanDeleteVen = "true"
            }
            );

            modelBuilder.Entity<User>()
            .HasData(
            new
            {
                User_Id = 1,
                Role_ID = 2,
                Access_ID = 1,
                Username = "Admin",
                Password = userrep.HashPassword("Admin123"),
                Profile_Picture = "test",
                No_Notifications = 0

            }
            );
            modelBuilder.Entity<Admin>()
            .HasData(
            new
            {
                Admin_ID = 1,
                User_Id = 1,
                AdminName = "Admin",
                AdminSurname = "Demo",
                CellPhone_Num = "0793731393",
                Email = "moyoemailservice@gmail.com"

            }
            );

            modelBuilder.Entity<Role>()
            .HasData(
            new
            {
                Role_ID = 1,
                Name = "MD",
                Description = "Managing Director",
 
            },
            new
            {
                Role_ID = 2,
                Name = "Admin",
                Description = "Admin",
            },
            new
            {
                Role_ID = 3,
                Name = "GRC",
                Description = "GRC",
            },
            new
            {
                Role_ID = 4,
                Name = "Finance",
                Description = "Finance",
            },
            new
            {
                Role_ID = 5,
                Name = "BO",
                Description = "Budget Owner",
            },
            new
            {
                Role_ID = 6,
                Name = "Employee",
                Description = "Employee",
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

            },
            new
            {
                Department_ID = 2,
                Name = "FIN",
                Description = "Finance",

            },
            new
            {
                Department_ID = 3,
                Name = "ENG",
                Description = "Engineering",

            },
            new
            {
                Department_ID = 4,
                Name = "MTS",
                Description = "Moyo Tech Support",

            },
            new
            {
                Department_ID = 5,
                Name = "HR",
                Description = "Human Resources",

            },
            new
            {
                Department_ID = 6,
                Name = "CM",
                Description = "Client Managed",

            },
            new
            {
                Department_ID = 7,
                Name = "BD",
                Description = "Business Development",

            },
            new
            {
                Department_ID = 8,
                Name = "MBA Gen",
                Description = "MBA General",

            }
            );

           

            modelBuilder.Entity<Vendor_Status>()
          .HasData(
          new
          {
              Vendor_Status_ID = 1,
              Name = "Pending",
              Description = "Pending to be rejected or accepted",

          },
          new
          {
              Vendor_Status_ID = 2,
              Name = "In Progress",
              Description = "Vendor Details being added",

          },
          new
          {
              Vendor_Status_ID = 3,
              Name = "Completed",
              Description = "Completed Vendor Details",

          },
          new
          {
              Vendor_Status_ID = 4,
              Name = "PendingApprove",
              Description = "PendingApprove",

          },
          new
          {
              Vendor_Status_ID = 5,
              Name = "Rejected",
              Description = "Rejected",

          },
          new
          {
              Vendor_Status_ID = 6,
              Name = "Other",
              Description = "Other",
          }
          );

            modelBuilder.Entity<Vendor>()
            .HasData(
            new
            {
                Vendor_ID = 1,
                Vendor_Status_ID = 2,
                Name = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                Email = "xxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxx",
                Number_Of_Times_Used = 0,
                Sole_Supplier_Provided = false,
                PreferedVendor = true,
            },
            new
            {
                Vendor_ID = 2,
                Vendor_Status_ID = 2,
                Name = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx2",
                Email = "xxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxx",
                Number_Of_Times_Used = 0,
                Sole_Supplier_Provided = false,
                PreferedVendor = true,
            }); 

            modelBuilder.Entity<Vendor_Category>()
            .HasData(
            new
            {
                Vendor_Category_ID = 1,
                Name = "General supplier",
                Description = "General supplier",

            }
            );

            modelBuilder.Entity<Onboard_Status>()
           .HasData(
           new
           {
               Status_ID = 1,
               Name = "Pending",
               Description = "Pending",

           },  
            new
            {
                Status_ID = 2,
                Name = "Rejected",
                Description = "Rejected",
            },
            new
            {
                Status_ID = 3,
                Name = "Approve",
                Description = "Approve",
            },
            new
            {
                Status_ID = 4,
                Name = "MDRequiredApproval",
                Description = "Requires manging directors approval",
            },
            new
            {
                Status_ID = 5,
                Name = "PendingBusy",
                Description = "Request is busy being view",
            });

            modelBuilder.Entity<Contracted_Partner_Type>()
         .HasData(
         new
         {
             Contracted_Partner_Type_ID = 1,
             Name = "Controller (C)",
             Description = "Controller (C)",

         },
          new
          {
              Contracted_Partner_Type_ID = 2,
              Name = "Joint Controller (JC)",
              Description = "Joint Controller (JC)",
          },
          new
          {
              Contracted_Partner_Type_ID = 3,
              Name = "Processor (P)",
              Description = "Processor (P)",
          },
          new
          {
              Contracted_Partner_Type_ID = 4,
              Name = "Sub-Processor (SP)",
              Description = "Sub-Processor (SP)",
          });


               modelBuilder.Entity<Vendor_Insurance_Type>()
         .HasData(
         new
         {
             Vendor_Insurance_Type_ID = 1,
             Name = "General liability insurance",
             Description = "General liability insurance",

         },
          new
          {
              Vendor_Insurance_Type_ID = 2,
              Name = "Cyber insurance",
              Description = "Cyber insurance",
          },
          new
          {
              Vendor_Insurance_Type_ID = 3,
              Name = "Professional indemnity insurance",
              Description = "Professional indemnity insurance",
          },
          new
          {
              Vendor_Insurance_Type_ID = 4,
              Name = "Other specific insurance",
              Description = "Other specific insurance",
          });

          modelBuilder.Entity<Delegation_Status>()
            .HasData(
            new
            {
                Status_ID = 1,
                Name = "Inactive",
                Description = "Request is created but not active",

            },
            new
            {
                Status_ID = 2,
                Name = "Active",
                Description = "Request period is active and access is given",
            },
            new
            {
                Status_ID = 3,
                Name = "Revoked",
                Description = "Request period has passed and access revoked",
            }
            );

            modelBuilder.Entity<Notification_Type>()
            .HasData(
            new
            {
                Notification_Type_ID = 1,
                Name = "New Vendor Onboard Request",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 2,
                Name = "Vendor BEE renewal",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 3,
                Name = "Vendor Review",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 4,
                Name = "Low Inventory Stock Level Detected",
                Description = "Please review the product and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 5,
                Name = "Vendor Onboard Request Has Been Accepted",
                Description = "Please complete the create vendor process to add them to the system.",

            },
            new
            {
                Notification_Type_ID = 6,
                Name = "Vendor Onboard Request Has Been Rejected",
                Description = "Please contact the relevant person to find rejection reason.",

            },
            new
            {
                Notification_Type_ID = 7,
                Name = "New Procurement Request Has Exceeded Budget Allocation",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 8,
                Name = "Procurement Request Has Been Accepted",
                Description = "Please proceed by placing the procurement details.",

            },
            new
            {
                Notification_Type_ID = 9,
                Name = "Procurement Request Has Been Rejected",
                Description = "Please review the request for the relevant reason and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 10,
                Name = "New Procurement Request Quote Approval Required.",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 11,
                Name = "Procurement Request Has Been Approved",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 12,
                Name = "Procurement Request Has Been Finalised",
                Description = "Please ensure all items are registered on the system.",

            },
            new
            {
                Notification_Type_ID = 13,
                Name = "Vendor Sole Supplier Has Been Approved By General Manager",
                Description = "Please procced to add required details for vendor.",

            },
            new
            {
                Notification_Type_ID = 14,
                Name = "Procurement Details Has Been Flagged",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 15,
                Name = "Vendor Onboard Request Requires Management Approval",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 16,
                Name = "Flagged Procurement Details Has Been Approved",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 17,
                Name = "Flagged Procurement Details Has Been Rejected",
                Description = "Please review the request and respond accordingly.",

            },
            new
            {
                Notification_Type_ID = 18,
                Name = "New Procurement Request",
                Description = "Please review the request and respond accordingly.",
            }
            );

            modelBuilder.Entity<Help_Category>()
            .HasData(
            new
            {
                Help_Category_ID = 1,
                Name = "Vendor",
                Description = "Help related to Vendor activities.",
            },
            new
            {
                Help_Category_ID = 2,
                Name = "Finance",
                Description = "Help related to Finiance activities.",
            },
            new
            {
                Help_Category_ID = 3,
                Name = "Reports",
                Description = "Help related to Reporting activities.",
            },
            new
            {
                Help_Category_ID = 4,
                Name = "Procurment",
                Description = "Help related to Procurement activities.",
            },
            new
            {
                  Help_Category_ID = 5,
                  Name = "Administration",
                  Description = "Help related to Administration activities.",
            },
            new
            {
                   Help_Category_ID = 6,
                   Name = "Inventory",
                   Description = "Help related to Inventory activities.",
            }
            );


            modelBuilder.Entity<Requisition_Status>()
            .HasData(
            new
            {
                Requisition_Status_ID = 1,
                Name = "Accepted (Ready to order)",
                Description = "Accepted",

            },
            new
            {
                Requisition_Status_ID = 2,
                Name = "Rejected",
                Description = "Rejected",

            },
            new
            {
                Requisition_Status_ID = 3,
                Name = "Approval Required",
                Description = "Approval Required",

            },
            new
            {
                Requisition_Status_ID = 4,
                Name = "Done",
                Description = "Request Finalised",

            }
            );

            modelBuilder.Entity<Payment_Method>()
           .HasData(
           new
           {
               Payment_Method_ID = 1,
               Name = "Credit",
               Description = "Credit Card Payment",

           },
           new
           {
               Payment_Method_ID = 2,
               Name = "Cash",
               Description = "Paying with cash",

           },
           new
           {
               Payment_Method_ID = 3,
               Name = "EFT",
               Description = "Paying with EFT",

           }

           );


            modelBuilder.Entity<Procurement_Status>()
           .HasData(
           new
           {
               Procurement_Status_ID = 1,
               Name = "Awaiting Delivery",
               Description = "Procurement Details are placed",

           },
           new
           {
               Procurement_Status_ID = 2,
               Name = "Done",
               Description = "Procurement has been finalized",

           },
           new
           {
               Procurement_Status_ID = 3,
               Name = "Flagged",
               Description = "Employee is over allowed mandate limit",

           },
           new
           {
               Procurement_Status_ID = 4,
               Name = "Rejected",
               Description = "Request was Rejected",

           },
           new
           {
               Procurement_Status_ID = 5,
               Name = "Item Received and checked",
               Description = "Received and Checked",

           }
           ,
           new
           {
               Procurement_Status_ID = 6,
               Name = "Asset To Be Registered",
               Description = "Asset Received",

           },
           new
           {
               Procurement_Status_ID = 7,
               Name = "Asset Registered",
               Description = "Asset Registered",

           }
           );

            modelBuilder.Entity<Procurement_Payment_Status>()
            .HasData(
            new
            {
                Procurement_Payment_Status_ID = 1,
                Name = "Paid",
                Description = "Procurement has been paid",

            },
            new
            {
                Procurement_Payment_Status_ID = 2,
                Name = "Awaiting payment",
                Description = "Payment must still be made",

            });

            modelBuilder.Entity<Sign_Off_Status>()
            .HasData(
            new
            {
                Sign_Off_Status_ID = 1,
                Name = "No",
                Description = "Has not been signed off",

            });

            //modelBuilder.Entity<Budget_Category>()
            //.HasData(
            //new
            //{
            //    Category_ID = 1,
            //    Account_Code = "2000",
            //    Account_Name = "Accounting & Audit Fees",
            //    Description = "Accounting & Audit Fees",
            //},
            //new
            //{
            //    Category_ID = 2,
            //    Account_Code = "2020",
            //    Account_Name = "Bank Service Charges",
            //    Description = "Bank Service Charges",
            //},
            //new
            //{
            //    Category_ID = 3,
            //    Account_Code = "2111.02",
            //    Account_Name = "B-BBEE expenses: B-BBEE Audits",
            //    Description = "B-BBEE expenses: B-BBEE Audits",
            //},
            //new
            //{
            //    Category_ID = 4,
            //    Account_Code = "2430.500",
            //    Account_Name = "CIO Mentoring costs",
            //    Description = "CIO Mentoring costs",
            //},
            //new
            //{
            //    Category_ID = 5,
            //    Account_Code = "2010",
            //    Account_Name = "CIPC Costs",
            //    Description = "CIPC Costs",
            //},
            //new
            //{
            //    Category_ID = 6,
            //    Account_Code = "2080",
            //    Account_Name = "Collection charges",
            //    Description = "Collection charges",
            //},
            //new
            //{
            //    Category_ID = 7,
            //    Account_Code = "2090.001",
            //    Account_Name = "Computer Expenses: Repairs & services",
            //    Description = "Computer Expenses: Repairs & services",
            //},
            //new
            //{
            //    Category_ID = 8,
            //    Account_Code = "2990.623",
            //    Account_Name = "Cost of Sales Kumba Kapstevel: KKPS6226",
            //    Description = "Cost of Sales Kumba Kapstevel: KKPS6226",
            //},
            //new
            //{
            //    Category_ID = 9,
            //    Account_Code = "2230.037",
            //    Account_Name = "Engineering - Software Tools",
            //    Description = "Engineering - Software Tools",
            //},
            //new
            //{
            //    Category_ID = 10,
            //    Account_Code = "2150",
            //    Account_Name = "Entertainment",
            //    Description = "Entertainment",
            //},
            //new
            //{
            //    Category_ID = 11,
            //    Account_Code = "2000",
            //    Account_Name = "Entertainment Client",
            //    Description = "Entertainment Client",
            //},
            //new
            //{
            //    Category_ID = 12,
            //    Account_Code = "2000",
            //    Account_Name = "Entertainment Team",
            //    Description = "Entertainment Team",
            //},
            //new
            //{
            //    Category_ID = 13,
            //    Account_Code = "2000",
            //    Account_Name = "Insurance: Business Insurance",
            //    Description = "Insurance: Business Insurance",
            //},
            //new
            //{
            //    Category_ID = 14,
            //    Account_Code = "2000",
            //    Account_Name = "Insurance: Professional Indemnity",
            //    Description = "Insurance: Professional Indemnity",
            //},
            //new
            //{
            //    Category_ID = 15,
            //    Account_Code = "2000",
            //    Account_Name = "Katendo Cost",
            //    Description = "Katendo Cost",
            //},
            //new
            //{
            //    Category_ID = 16,
            //    Account_Code = "2000",
            //    Account_Name = "Legal Cost",
            //    Description = "Legal Cost",
            //},
            //new
            //{
            //    Category_ID = 17,
            //    Account_Code = "2000",
            //    Account_Name = "License fees: Active campaign",
            //    Description = "License fees: Active campaign",
            //},
            //new
            //{
            //    Category_ID = 18,
            //    Account_Code = "2000",
            //    Account_Name = "License Fees: Aptien",
            //    Description = "License Fees: Aptien",
            //},
            //new
            //{
            //    Category_ID = 19,
            //    Account_Code = "2000",
            //    Account_Name = "License Fees: CASM",
            //    Description = "License Fees: CASM",
            //},
            //new
            //{
            //    Category_ID = 20,
            //    Account_Code = "2000",
            //    Account_Name = "License Fees: CodeTwo",
            //    Description = "License Fees: CodeTwo",
            //},
            //new
            //{
            //    Category_ID = 21,
            //    Account_Code = "2000",
            //    Account_Name = "License Fees: Zoom",
            //    Description = "License Fees: Zoom",
            //},
            //new
            //{
            //    Category_ID = 22,
            //    Account_Code = "2000",
            //    Account_Name = "Overheads Allocated",
            //    Description = "Overheads Allocated",
            //},
            //new
            //{
            //    Category_ID = 23,
            //    Account_Code = "2000",
            //    Account_Name = "Placement Cost: Kroll Checks",
            //    Description = "Placement Cost: Kroll Checks",
            //},
            //new
            //{
            //    Category_ID = 24,
            //    Account_Code = "2000",
            //    Account_Name = "Placement Cost: Pnet/Linkedin Ads",
            //    Description = "Placement Cost: Pnet/Linkedin Ads",
            //},
            //new
            //{
            //    Category_ID = 25,
            //    Account_Code = "2000",
            //    Account_Name = "PowaREP Azure: Cost",
            //    Description = "PowaREP Azure: Cost",
            //},
            //new
            //{
            //    Category_ID = 26,
            //    Account_Code = "2000",
            //    Account_Name = "Powarep Data Services Cost",
            //    Description = "Powarep Data Services Cost",
            //},
            //new
            //{
            //    Category_ID = 27,
            //    Account_Code = "2000",
            //    Account_Name = "Product Cost: Grinrod Project 6737",
            //    Description = "Product Cost: Grinrod Project 6737",
            //},
            //new
            //{
            //    Category_ID = 28,
            //    Account_Code = "2000",
            //    Account_Name = "Product Cost: Insightsec support (1st, 2nd, 3rd)",
            //    Description = "Product Cost: Insightsec support (1st, 2nd, 3rd)",
            //},
            //new
            //{
            //    Category_ID = 29,
            //    Account_Code = "2000",
            //    Account_Name = "Product Cost: MI2",
            //    Description = "Product Cost: MI2",
            //},
            //new
            //{
            //    Category_ID = 30,
            //    Account_Code = "2000",
            //    Account_Name = "Recruitment costs",
            //    Description = "Recruitment costs",
            //},
            //new
            //{
            //    Category_ID = 31,
            //    Account_Code = "2000",
            //    Account_Name = "Recruitment: Ads",
            //    Description = "Recruitment: Ads",
            //},
            //new
            //{
            //    Category_ID = 32,
            //    Account_Code = "2000",
            //    Account_Name = "Service Partner Costs",
            //    Description = "Service Partner Costs",
            //},
            //new
            //{
            //    Category_ID = 33,
            //    Account_Code = "2000",
            //    Account_Name = "Training Costs: Advanced Excel Trainer Fees",
            //    Description = "Training Costs: Advanced Excel Trainer Fees",
            //},
            //new
            //{
            //    Category_ID = 34,
            //    Account_Code = "2000",
            //    Account_Name = "Training Costs: Microsoft Power BI Trainer Fees",
            //    Description = "Training Costs: Microsoft Power BI Trainer Fees",
            //},
            //new
            //{
            //    Category_ID = 35,
            //    Account_Code = "2000",
            //    Account_Name = "Training Costs: SQL Fundamentals Trainer Fee",
            //    Description = "Training Costs: SQL Fundamentals Trainer Fee",
            //},
            //new
            //{
            //    Category_ID = 36,
            //    Account_Code = "2000",
            //    Account_Name = "Training Costs: Tableau Trainer fees",
            //    Description = "Training Costs: Tableau Trainer fees",
            //},
            //new
            //{
            //    Category_ID = 37,
            //    Account_Code = "2000",
            //    Account_Name = "Training Offering Costs",
            //    Description = "Training Offering Costs",
            //},
            //new
            //{
            //    Category_ID = 38,
            //    Account_Code = "2000",
            //    Account_Name = "Training Offering Costs: Content development",
            //    Description = "Training Offering Costs: Content development",
            //},
            //new
            //{
            //    Category_ID = 39,
            //    Account_Code = "2000",
            //    Account_Name = "Training Offering Costs: Digital Consulting",
            //    Description = "Training Offering Costs: Digital Consulting",
            //},
            //new
            //{
            //    Category_ID = 40,
            //    Account_Code = "2000",
            //    Account_Name = "Training Offering Costs: Facilitation Cost",
            //    Description = "Training Offering Costs: Facilitation Cost",
            //},
            //new
            //{
            //    Category_ID = 41,
            //    Account_Code = "2000",
            //    Account_Name = "Training Offering Costs: LMS",
            //    Description = "Training Offering Costs: LMS",
            //},
            //new
            //{
            //    Category_ID = 42,
            //    Account_Code = "2000",
            //    Account_Name = "Travel - Local",
            //    Description = "Travel - Local",
            //},
            //new
            //{
            //    Category_ID = 43,
            //    Account_Code = "2000",
            //    Account_Name = "Travel - Local: Group Innovation",
            //    Description = "Travel - Local: Group Innovation",
            //}
            //);

        }
    }
}