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
        public DbSet<Onboard_Status> Onboard_Status { get; set; }
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
        public DbSet<Consumable_History> Consumable_History { get; set; }

        UserRepository userrep = new UserRepository();

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
                Role_ID = 2,
                Username = "Admin",
                Password = userrep.HashPassword("Admin123"),
                Profile_Picture = "test",

            },
            new
            {
                User_Id = 2,
                Role_ID = 2,
                Username = "Admin",
                Password = "Admin",
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
 
            },
            new
            {
                Role_ID = 2,
                Name = "Admin",
                Description = "Admin",
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
              Name = "Pending",
              Description = "Pending to be rejected or accepted",

          },
          new
          {
              Vendor_Status_ID = 2,
              Name = "approved",
              Description = "Vendor is Approved",

          },
          new
          {
              Vendor_Status_ID = 3,
              Name = "Completed",
              Description = "Completed Vendor Details",

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
                Sole_Supplier_Provided = false
            },
            new
            {
                Vendor_ID = 2,
                Vendor_Status_ID = 2,
                Name = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx2",
                Email = "xxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxx",
                Number_Of_Times_Used = 0,
                Sole_Supplier_Provided = false
            }); ;

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
          

        }
    }
}