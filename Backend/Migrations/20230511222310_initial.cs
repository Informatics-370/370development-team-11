using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcionAPI.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Asset",
                columns: table => new
                {
                    Asset_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asset", x => x.Asset_ID);
                });

            migrationBuilder.CreateTable(
                name: "Branch",
                columns: table => new
                {
                    Branch_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Street = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Postal_Code = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    Province = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branch", x => x.Branch_ID);
                });

            migrationBuilder.CreateTable(
                name: "Budget_Category",
                columns: table => new
                {
                    Category_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Account_Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budget_Category", x => x.Category_ID);
                });

            migrationBuilder.CreateTable(
                name: "Consumable_Category",
                columns: table => new
                {
                    Consumable_Category_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consumable_Category", x => x.Consumable_Category_ID);
                });

            migrationBuilder.CreateTable(
                name: "Contracted_Partner_Type",
                columns: table => new
                {
                    Contracted_Partner_Type_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracted_Partner_Type", x => x.Contracted_Partner_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Department_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Department_ID);
                });

            migrationBuilder.CreateTable(
                name: "Help_Category",
                columns: table => new
                {
                    Help_Category_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Help_Category", x => x.Help_Category_ID);
                });

            migrationBuilder.CreateTable(
                name: "Importance_Level",
                columns: table => new
                {
                    Importance_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Importance_Level", x => x.Importance_ID);
                });

            migrationBuilder.CreateTable(
                name: "Mandate_Limit",
                columns: table => new
                {
                    Mandate_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ammount = table.Column<double>(type: "float", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mandate_Limit", x => x.Mandate_ID);
                });

            migrationBuilder.CreateTable(
                name: "Notification_Type",
                columns: table => new
                {
                    Notification_Type_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification_Type", x => x.Notification_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "Payment_Method",
                columns: table => new
                {
                    Payment_Method_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment_Method", x => x.Payment_Method_ID);
                });

            migrationBuilder.CreateTable(
                name: "Procurement_Payment_Status",
                columns: table => new
                {
                    Procurement_Payment_Status_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procurement_Payment_Status", x => x.Procurement_Payment_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "Procurement_Status",
                columns: table => new
                {
                    Procurement_Status_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procurement_Status", x => x.Procurement_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "Requisition_Status",
                columns: table => new
                {
                    Requisition_Status_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requisition_Status", x => x.Requisition_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Role_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Role_ID);
                });

            migrationBuilder.CreateTable(
                name: "Sign_Off_Status",
                columns: table => new
                {
                    Sign_Off_Status_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sign_Off_Status", x => x.Sign_Off_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "VAT",
                columns: table => new
                {
                    VatID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VAT", x => x.VatID);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Category",
                columns: table => new
                {
                    Vendor_Category_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Category", x => x.Vendor_Category_ID);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Status",
                columns: table => new
                {
                    Vendor_Status_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Status", x => x.Vendor_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "Consumable",
                columns: table => new
                {
                    Consumable_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Consumable_Category_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    On_Hand = table.Column<int>(type: "int", nullable: false),
                    Minimum_Reorder_Quantity = table.Column<int>(type: "int", nullable: false),
                    Maximum_Reorder_Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consumable", x => x.Consumable_ID);
                    table.ForeignKey(
                        name: "FK_Consumable_Consumable_Category_Consumable_Category_ID",
                        column: x => x.Consumable_Category_ID,
                        principalTable: "Consumable_Category",
                        principalColumn: "Consumable_Category_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Budget_Allocation",
                columns: table => new
                {
                    Budget_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Department_ID = table.Column<int>(type: "int", nullable: false),
                    Date_Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budget_Allocation", x => x.Budget_ID);
                    table.ForeignKey(
                        name: "FK_Budget_Allocation_Department_Department_ID",
                        column: x => x.Department_ID,
                        principalTable: "Department",
                        principalColumn: "Department_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HELP",
                columns: table => new
                {
                    Help_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Help_Category_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Video = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    User_Manual = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HELP", x => x.Help_ID);
                    table.ForeignKey(
                        name: "FK_HELP_Help_Category_Help_Category_ID",
                        column: x => x.Help_Category_ID,
                        principalTable: "Help_Category",
                        principalColumn: "Help_Category_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    User_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Role_ID = table.Column<int>(type: "int", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Password = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Profile_Picture = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.User_Id);
                    table.ForeignKey(
                        name: "FK_User_Role_Role_ID",
                        column: x => x.Role_ID,
                        principalTable: "Role",
                        principalColumn: "Role_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor",
                columns: table => new
                {
                    Vendor_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Status_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Number_Of_Times_Used = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor", x => x.Vendor_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Vendor_Status_Vendor_Status_ID",
                        column: x => x.Vendor_Status_ID,
                        principalTable: "Vendor_Status",
                        principalColumn: "Vendor_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Budget_Line",
                columns: table => new
                {
                    Account_Code = table.Column<int>(type: "int", nullable: false),
                    Budget_ID = table.Column<int>(type: "int", nullable: false),
                    Category_ID = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BudgetAmt = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ActualAmt = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Variance = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budget_Line", x => new { x.Account_Code, x.Budget_ID, x.Category_ID });
                    table.ForeignKey(
                        name: "FK_Budget_Line_Budget_Allocation_Budget_ID",
                        column: x => x.Budget_ID,
                        principalTable: "Budget_Allocation",
                        principalColumn: "Budget_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Budget_Line_Budget_Category_Category_ID",
                        column: x => x.Category_ID,
                        principalTable: "Budget_Category",
                        principalColumn: "Category_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Admin",
                columns: table => new
                {
                    Admin_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    AdminName = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    AdminSurname = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    CellPhone_Num = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admin", x => x.Admin_ID);
                    table.ForeignKey(
                        name: "FK_Admin_User_User_Id",
                        column: x => x.User_Id,
                        principalTable: "User",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Department_ID = table.Column<int>(type: "int", nullable: false),
                    Branch_ID = table.Column<int>(type: "int", nullable: false),
                    Mandate_ID = table.Column<int>(type: "int", nullable: false),
                    EmployeeName = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    EmployeeSurname = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    CellPhone_Num = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmployeeID);
                    table.ForeignKey(
                        name: "FK_Employee_Branch_Branch_ID",
                        column: x => x.Branch_ID,
                        principalTable: "Branch",
                        principalColumn: "Branch_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_Department_Department_ID",
                        column: x => x.Department_ID,
                        principalTable: "Department",
                        principalColumn: "Department_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_Mandate_Limit_Mandate_ID",
                        column: x => x.Mandate_ID,
                        principalTable: "Mandate_Limit",
                        principalColumn: "Mandate_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_User_User_Id",
                        column: x => x.User_Id,
                        principalTable: "User",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Onboard_Request",
                columns: table => new
                {
                    Onboard_Request_Id = table.Column<int>(type: "int", nullable: false),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Vendor_ID = table.Column<int>(type: "int", nullable: false),
                    Quotes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Onboard_Request", x => new { x.Onboard_Request_Id, x.User_Id, x.Vendor_ID });
                    table.ForeignKey(
                        name: "FK_Onboard_Request_User_User_Id",
                        column: x => x.User_Id,
                        principalTable: "User",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Onboard_Request_Vendor_Vendor_ID",
                        column: x => x.Vendor_ID,
                        principalTable: "Vendor",
                        principalColumn: "Vendor_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Detail",
                columns: table => new
                {
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Category_ID = table.Column<int>(type: "int", nullable: false),
                    Vendor_ID = table.Column<int>(type: "int", nullable: false),
                    Telephone_Num = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Contact_Person_Title = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    Contact_Person_Name = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    Contact_Person_ContactNum = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Contact_Person_Email = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Registered_Address = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FaxProvided = table.Column<bool>(type: "bit", nullable: false),
                    WebsiteProvided = table.Column<bool>(type: "bit", nullable: false),
                    Description_GSP = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VatRegistered = table.Column<bool>(type: "bit", nullable: false),
                    Registration_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Income_Tax_Num_Provided = table.Column<bool>(type: "bit", nullable: false),
                    SoleSupplierProvided = table.Column<bool>(type: "bit", nullable: false),
                    POPIA_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Payment_Terms_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Insurance_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Signed_Agreement_Provided = table.Column<bool>(type: "bit", nullable: false),
                    License_Num_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Bank_Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Account_Holder = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Bank_Account_Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Branch_Code = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    Account_Type = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Bank_Contact_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Bank_Contact_PhoneNum = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    BankStampedConfirtmation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BeeRegistered = table.Column<bool>(type: "bit", nullable: false),
                    DueDIllegenceRequired = table.Column<bool>(type: "bit", nullable: false),
                    DateAccepted = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Detail", x => x.Vendor_Detail_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Detail_Vendor_Category_Vendor_Category_ID",
                        column: x => x.Vendor_Category_ID,
                        principalTable: "Vendor_Category",
                        principalColumn: "Vendor_Category_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Vendor_Detail_Vendor_Vendor_ID",
                        column: x => x.Vendor_ID,
                        principalTable: "Vendor",
                        principalColumn: "Vendor_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Delegation_Of_Authority",
                columns: table => new
                {
                    Delegation_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Admin_ID = table.Column<int>(type: "int", nullable: false),
                    From_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    To_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Delegation_Document = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Delegation_Of_Authority", x => x.Delegation_ID);
                    table.ForeignKey(
                        name: "FK_Delegation_Of_Authority_Admin_Admin_ID",
                        column: x => x.Admin_ID,
                        principalTable: "Admin",
                        principalColumn: "Admin_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Delegation_Of_Authority_User_User_Id",
                        column: x => x.User_Id,
                        principalTable: "User",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Calender_Items",
                columns: table => new
                {
                    Calender_Item_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Importance_ID = table.Column<int>(type: "int", nullable: false),
                    Admin_ID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calender_Items", x => x.Calender_Item_ID);
                    table.ForeignKey(
                        name: "FK_Calender_Items_Admin_Admin_ID",
                        column: x => x.Admin_ID,
                        principalTable: "Admin",
                        principalColumn: "Admin_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Calender_Items_Employee_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Employee",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Calender_Items_Importance_Level_Importance_ID",
                        column: x => x.Importance_ID,
                        principalTable: "Importance_Level",
                        principalColumn: "Importance_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Procurement_Request",
                columns: table => new
                {
                    Procurement_Request_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Requisition_Status_ID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Vendor_ID = table.Column<int>(type: "int", nullable: false),
                    Sign_Off_Status_ID = table.Column<int>(type: "int", nullable: false),
                    Procurement_Payment_Status_ID = table.Column<int>(type: "int", nullable: false),
                    Account_Code = table.Column<int>(type: "int", nullable: false),
                    Procurement_Status_ID = table.Column<int>(type: "int", nullable: false),
                    Payment_Method_ID = table.Column<int>(type: "int", nullable: false),
                    Budget_ID = table.Column<int>(type: "int", nullable: false),
                    Category_ID = table.Column<int>(type: "int", nullable: false),
                    Item_Type = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Buyer_Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Buyer_Email = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Deposit_Required = table.Column<bool>(type: "bit", nullable: false),
                    Full_Payment_Due_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Total_Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Payment_Made = table.Column<bool>(type: "bit", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Proof_Of_Payment_Required = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procurement_Request", x => x.Procurement_Request_ID);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Budget_Line_Account_Code_Budget_ID_Category_ID",
                        columns: x => new { x.Account_Code, x.Budget_ID, x.Category_ID },
                        principalTable: "Budget_Line",
                        principalColumns: new[] { "Account_Code", "Budget_ID", "Category_ID" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Employee_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Employee",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Payment_Method_Payment_Method_ID",
                        column: x => x.Payment_Method_ID,
                        principalTable: "Payment_Method",
                        principalColumn: "Payment_Method_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Procurement_Payment_Status_Procurement_Payment_Status_ID",
                        column: x => x.Procurement_Payment_Status_ID,
                        principalTable: "Procurement_Payment_Status",
                        principalColumn: "Procurement_Payment_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Procurement_Status_Procurement_Status_ID",
                        column: x => x.Procurement_Status_ID,
                        principalTable: "Procurement_Status",
                        principalColumn: "Procurement_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Requisition_Status_Requisition_Status_ID",
                        column: x => x.Requisition_Status_ID,
                        principalTable: "Requisition_Status",
                        principalColumn: "Requisition_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Sign_Off_Status_Sign_Off_Status_ID",
                        column: x => x.Sign_Off_Status_ID,
                        principalTable: "Sign_Off_Status",
                        principalColumn: "Sign_Off_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Request_Vendor_Vendor_ID",
                        column: x => x.Vendor_ID,
                        principalTable: "Vendor",
                        principalColumn: "Vendor_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Due_Dillegence",
                columns: table => new
                {
                    Due_Diligence_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Due_Diligence_Doc = table.Column<bool>(type: "bit", nullable: false),
                    Mutual_Nda_Signed = table.Column<bool>(type: "bit", nullable: false),
                    Basic_Company_Info_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Group_Structure_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Income_Tax_Number_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Tax_Clearance_Certificate_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Vat_Number_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Vat_Reg_Certificate_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Company_Reg_Doc_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Letter_Of_Good_Standing_Provided = table.Column<bool>(type: "bit", nullable: false),
                    B_BBEE_Certificate_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Direcor_Details_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Company_Resolution_Agreement_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Subcontractor_Name_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Company_Details_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Individual_Details_Provided = table.Column<bool>(type: "bit", nullable: false),
                    General_Liability_Insurance_Present = table.Column<bool>(type: "bit", nullable: false),
                    Cyber_Insurance_Present = table.Column<bool>(type: "bit", nullable: false),
                    Proffesional_Indemnity_Insurance_Present = table.Column<bool>(type: "bit", nullable: false),
                    Other_Insurance_Required = table.Column<bool>(type: "bit", nullable: false),
                    Licenses_Required = table.Column<bool>(type: "bit", nullable: false),
                    Accreditation_Required = table.Column<bool>(type: "bit", nullable: false),
                    Proffesional_Membership_Required = table.Column<bool>(type: "bit", nullable: false),
                    Business_Continuity_Present = table.Column<bool>(type: "bit", nullable: false),
                    DIsaster_Recovery_Plan_Present = table.Column<bool>(type: "bit", nullable: false),
                    POPI_Present = table.Column<bool>(type: "bit", nullable: false),
                    Data_Security_Breaches_Present = table.Column<bool>(type: "bit", nullable: false),
                    Site_Visits_Present = table.Column<bool>(type: "bit", nullable: false),
                    Information_Security_Policy_Present = table.Column<bool>(type: "bit", nullable: false),
                    Privacy_Policy_Present_Present = table.Column<bool>(type: "bit", nullable: false),
                    Data_Retention_Destruction_Policy_Present = table.Column<bool>(type: "bit", nullable: false),
                    Anti_Bribery_Corruption_Policy_Present = table.Column<bool>(type: "bit", nullable: false),
                    Ethics_Policy_Present = table.Column<bool>(type: "bit", nullable: false),
                    Conflict_Of_Interest_Policy_Present = table.Column<bool>(type: "bit", nullable: false),
                    Customer_Complaints_Policy_Present = table.Column<bool>(type: "bit", nullable: false),
                    Business_References_Present = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Due_Dillegence", x => x.Due_Diligence_ID);
                    table.ForeignKey(
                        name: "FK_Due_Dillegence_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sole_Supplier",
                columns: table => new
                {
                    Sole_Supplier_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    MD_Approval = table.Column<bool>(type: "bit", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sole_Supplier", x => x.Sole_Supplier_ID);
                    table.ForeignKey(
                        name: "FK_Sole_Supplier_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Agreement",
                columns: table => new
                {
                    Agreement_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Signed_Agreement_Doc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Agreement", x => x.Agreement_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Agreement_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Asset",
                columns: table => new
                {
                    Vendor_Asset_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_ID = table.Column<int>(type: "int", nullable: false),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Quotes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Asset", x => x.Vendor_Asset_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Asset_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Vendor_Asset_Vendor_Vendor_ID",
                        column: x => x.Vendor_ID,
                        principalTable: "Vendor",
                        principalColumn: "Vendor_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Consumable",
                columns: table => new
                {
                    Vendor_Consumbale_ID = table.Column<int>(type: "int", nullable: false),
                    Consumable_ID = table.Column<int>(type: "int", nullable: false),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Quotes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Consumable", x => new { x.Vendor_Consumbale_ID, x.Consumable_ID, x.Vendor_Detail_ID });
                    table.ForeignKey(
                        name: "FK_Vendor_Consumable_Consumable_Consumable_ID",
                        column: x => x.Consumable_ID,
                        principalTable: "Consumable",
                        principalColumn: "Consumable_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Vendor_Consumable_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Fax",
                columns: table => new
                {
                    Fax_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Fax = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Fax", x => x.Fax_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Fax_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Insurance",
                columns: table => new
                {
                    Insurance_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Confirmation_Doc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Insurance", x => x.Insurance_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Insurance_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_License",
                columns: table => new
                {
                    License_No = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    License_Doc_Upload = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_License", x => x.License_No);
                    table.ForeignKey(
                        name: "FK_Vendor_License_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Payment_Terms",
                columns: table => new
                {
                    Payment_Terms_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Payment_Terms = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Payment_Terms", x => x.Payment_Terms_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Payment_Terms_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Popia",
                columns: table => new
                {
                    POPIA_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    POPIA_Declaration = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Popia", x => x.POPIA_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Popia_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Registration",
                columns: table => new
                {
                    Company_Registration_Number = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Proof_Of_Registration_Doc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Registration", x => x.Company_Registration_Number);
                    table.ForeignKey(
                        name: "FK_Vendor_Registration_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Tax",
                columns: table => new
                {
                    Income_Tax_Num = table.Column<int>(type: "int", nullable: false),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    Tax_Clearance_Cert = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Tax", x => x.Income_Tax_Num);
                    table.ForeignKey(
                        name: "FK_Vendor_Tax_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Vat",
                columns: table => new
                {
                    Vat_Registration_Number = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    VAT_Registration_Document = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Vat", x => x.Vat_Registration_Number);
                    table.ForeignKey(
                        name: "FK_Vendor_Vat_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vendor_Website",
                columns: table => new
                {
                    Website_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendor_Detail_ID = table.Column<int>(type: "int", nullable: false),
                    URL = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor_Website", x => x.Website_ID);
                    table.ForeignKey(
                        name: "FK_Vendor_Website_Vendor_Detail_Vendor_Detail_ID",
                        column: x => x.Vendor_Detail_ID,
                        principalTable: "Vendor_Detail",
                        principalColumn: "Vendor_Detail_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Delegation_Status",
                columns: table => new
                {
                    Status_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Delegation_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Delegation_Status", x => x.Status_ID);
                    table.ForeignKey(
                        name: "FK_Delegation_Status_Delegation_Of_Authority_Delegation_ID",
                        column: x => x.Delegation_ID,
                        principalTable: "Delegation_Of_Authority",
                        principalColumn: "Delegation_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Temporary_Access",
                columns: table => new
                {
                    Temp_Access_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Delegation_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Temporary_Access", x => x.Temp_Access_ID);
                    table.ForeignKey(
                        name: "FK_Temporary_Access_Delegation_Of_Authority_Delegation_ID",
                        column: x => x.Delegation_ID,
                        principalTable: "Delegation_Of_Authority",
                        principalColumn: "Delegation_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    Notification_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Calender_Item_ID = table.Column<int>(type: "int", nullable: false),
                    Notification_Type_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Due_Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Notification_ID);
                    table.ForeignKey(
                        name: "FK_Notification_Calender_Items_Calender_Item_ID",
                        column: x => x.Calender_Item_ID,
                        principalTable: "Calender_Items",
                        principalColumn: "Calender_Item_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notification_Notification_Type_Notification_Type_ID",
                        column: x => x.Notification_Type_ID,
                        principalTable: "Notification_Type",
                        principalColumn: "Notification_Type_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payment_Made",
                columns: table => new
                {
                    Payment_Made_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Procurement_Request_ID = table.Column<int>(type: "int", nullable: false),
                    Paid_On_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Receipt_Upload = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment_Made", x => x.Payment_Made_ID);
                    table.ForeignKey(
                        name: "FK_Payment_Made_Procurement_Request_Procurement_Request_ID",
                        column: x => x.Procurement_Request_ID,
                        principalTable: "Procurement_Request",
                        principalColumn: "Procurement_Request_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Procurement_Asset",
                columns: table => new
                {
                    Procurement_Asset_ID = table.Column<int>(type: "int", nullable: false),
                    Procurement_Request_ID = table.Column<int>(type: "int", nullable: false),
                    Asset_ID = table.Column<int>(type: "int", nullable: false),
                    Invoice_Document = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procurement_Asset", x => new { x.Procurement_Asset_ID, x.Procurement_Request_ID, x.Asset_ID });
                    table.ForeignKey(
                        name: "FK_Procurement_Asset_Asset_Asset_ID",
                        column: x => x.Asset_ID,
                        principalTable: "Asset",
                        principalColumn: "Asset_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Asset_Procurement_Request_Procurement_Request_ID",
                        column: x => x.Procurement_Request_ID,
                        principalTable: "Procurement_Request",
                        principalColumn: "Procurement_Request_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Procurement_Consumable",
                columns: table => new
                {
                    Procurement_Consumable_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Procurement_Request_ID = table.Column<int>(type: "int", nullable: false),
                    Consumable_ID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Invoice_Document = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procurement_Consumable", x => x.Procurement_Consumable_ID);
                    table.ForeignKey(
                        name: "FK_Procurement_Consumable_Consumable_Consumable_ID",
                        column: x => x.Consumable_ID,
                        principalTable: "Consumable",
                        principalColumn: "Consumable_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Procurement_Consumable_Procurement_Request_Procurement_Request_ID",
                        column: x => x.Procurement_Request_ID,
                        principalTable: "Procurement_Request",
                        principalColumn: "Procurement_Request_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Proof_Of_Payment",
                columns: table => new
                {
                    Proof_Of_Payment_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Procurement_Request_ID = table.Column<int>(type: "int", nullable: false),
                    Proof_Of_Payment_Doc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proof_Of_Payment", x => x.Proof_Of_Payment_ID);
                    table.ForeignKey(
                        name: "FK_Proof_Of_Payment_Procurement_Request_Procurement_Request_ID",
                        column: x => x.Procurement_Request_ID,
                        principalTable: "Procurement_Request",
                        principalColumn: "Procurement_Request_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "POPI",
                columns: table => new
                {
                    POPI_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Contracted_Partner_Type_ID = table.Column<int>(type: "int", nullable: false),
                    Due_Diligence_ID = table.Column<int>(type: "int", nullable: false),
                    Personal_Data_Purpose = table.Column<bool>(type: "bit", nullable: false),
                    DataProcessing_JointController_Agreement = table.Column<bool>(type: "bit", nullable: false),
                    Confidentiality_Importance_Highlighted = table.Column<bool>(type: "bit", nullable: false),
                    Contract_Audits_Provisions_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Activity_Liability_Present = table.Column<bool>(type: "bit", nullable: false),
                    Third_Party_Data_Processing_Provisioned = table.Column<bool>(type: "bit", nullable: false),
                    Contract_End_Data_Management_Provided = table.Column<bool>(type: "bit", nullable: false),
                    Personal_Data_Processing_Details_Present = table.Column<bool>(type: "bit", nullable: false),
                    Processing_Activities_Certification_Held = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_POPI", x => x.POPI_ID);
                    table.ForeignKey(
                        name: "FK_POPI_Contracted_Partner_Type_Contracted_Partner_Type_ID",
                        column: x => x.Contracted_Partner_Type_ID,
                        principalTable: "Contracted_Partner_Type",
                        principalColumn: "Contracted_Partner_Type_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_POPI_Due_Dillegence_Due_Diligence_ID",
                        column: x => x.Due_Diligence_ID,
                        principalTable: "Due_Dillegence",
                        principalColumn: "Due_Diligence_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Access",
                columns: table => new
                {
                    Access_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Temp_Access_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Access", x => x.Access_ID);
                    table.ForeignKey(
                        name: "FK_Access_Temporary_Access_Temp_Access_ID",
                        column: x => x.Temp_Access_ID,
                        principalTable: "Temporary_Access",
                        principalColumn: "Temp_Access_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "User_Access",
                columns: table => new
                {
                    Role_ID = table.Column<int>(type: "int", nullable: false),
                    Access_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Access", x => new { x.Role_ID, x.Access_ID });
                    table.ForeignKey(
                        name: "FK_User_Access_Access_Access_ID",
                        column: x => x.Access_ID,
                        principalTable: "Access",
                        principalColumn: "Access_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_User_Access_Role_Role_ID",
                        column: x => x.Role_ID,
                        principalTable: "Role",
                        principalColumn: "Role_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Branch",
                columns: new[] { "Branch_ID", "City", "Name", "Postal_Code", "Province", "Street" },
                values: new object[] { 1, "Pretoria", "Pretoria", "0042", "Gauteng", "Jean Ave" });

            migrationBuilder.InsertData(
                table: "Consumable_Category",
                columns: new[] { "Consumable_Category_ID", "Description", "Name" },
                values: new object[] { 1, "Mykitchen", "Kitchen" });

            migrationBuilder.InsertData(
                table: "Department",
                columns: new[] { "Department_ID", "Description", "Name" },
                values: new object[] { 1, "Business Enablement", "BE" });

            migrationBuilder.InsertData(
                table: "Mandate_Limit",
                columns: new[] { "Mandate_ID", "Ammount", "Date" },
                values: new object[] { 1, 10000.0, new DateTime(2023, 5, 12, 0, 23, 10, 142, DateTimeKind.Local).AddTicks(4369) });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Role_ID", "Description", "Name" },
                values: new object[] { 1, "Managing Director", "MD" });

            migrationBuilder.InsertData(
                table: "Vendor_Status",
                columns: new[] { "Vendor_Status_ID", "Description", "Name" },
                values: new object[] { 1, "more", "pain" });

            migrationBuilder.InsertData(
                table: "Consumable",
                columns: new[] { "Consumable_ID", "Consumable_Category_ID", "Description", "Maximum_Reorder_Quantity", "Minimum_Reorder_Quantity", "Name", "On_Hand" },
                values: new object[] { 1, 1, "Bonaqua", 100, 50, "Water", 2 });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "User_Id", "Password", "Profile_Picture", "Role_ID", "Username" },
                values: new object[] { 1, "JDoe123", "test", 1, "JDoe" });

            migrationBuilder.InsertData(
                table: "Employee",
                columns: new[] { "EmployeeID", "Branch_ID", "CellPhone_Num", "Department_ID", "Email", "EmployeeName", "EmployeeSurname", "Mandate_ID", "User_Id" },
                values: new object[] { 1, 1, "074 845 2548", 1, "jdoe@gmail.com", "John", "Doe", 1, 1 });

            migrationBuilder.CreateIndex(
                name: "IX_Access_Temp_Access_ID",
                table: "Access",
                column: "Temp_Access_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Admin_User_Id",
                table: "Admin",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Budget_Allocation_Department_ID",
                table: "Budget_Allocation",
                column: "Department_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Budget_Line_Budget_ID",
                table: "Budget_Line",
                column: "Budget_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Budget_Line_Category_ID",
                table: "Budget_Line",
                column: "Category_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Calender_Items_Admin_ID",
                table: "Calender_Items",
                column: "Admin_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Calender_Items_EmployeeID",
                table: "Calender_Items",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_Calender_Items_Importance_ID",
                table: "Calender_Items",
                column: "Importance_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Consumable_Consumable_Category_ID",
                table: "Consumable",
                column: "Consumable_Category_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Delegation_Of_Authority_Admin_ID",
                table: "Delegation_Of_Authority",
                column: "Admin_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Delegation_Of_Authority_User_Id",
                table: "Delegation_Of_Authority",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Delegation_Status_Delegation_ID",
                table: "Delegation_Status",
                column: "Delegation_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Due_Dillegence_Vendor_Detail_ID",
                table: "Due_Dillegence",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Branch_ID",
                table: "Employee",
                column: "Branch_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Department_ID",
                table: "Employee",
                column: "Department_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Mandate_ID",
                table: "Employee",
                column: "Mandate_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_User_Id",
                table: "Employee",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_HELP_Help_Category_ID",
                table: "HELP",
                column: "Help_Category_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_Calender_Item_ID",
                table: "Notification",
                column: "Calender_Item_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_Notification_Type_ID",
                table: "Notification",
                column: "Notification_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Onboard_Request_User_Id",
                table: "Onboard_Request",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Onboard_Request_Vendor_ID",
                table: "Onboard_Request",
                column: "Vendor_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_Made_Procurement_Request_ID",
                table: "Payment_Made",
                column: "Procurement_Request_ID");

            migrationBuilder.CreateIndex(
                name: "IX_POPI_Contracted_Partner_Type_ID",
                table: "POPI",
                column: "Contracted_Partner_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_POPI_Due_Diligence_ID",
                table: "POPI",
                column: "Due_Diligence_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Asset_Asset_ID",
                table: "Procurement_Asset",
                column: "Asset_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Asset_Procurement_Request_ID",
                table: "Procurement_Asset",
                column: "Procurement_Request_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Consumable_Consumable_ID",
                table: "Procurement_Consumable",
                column: "Consumable_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Consumable_Procurement_Request_ID",
                table: "Procurement_Consumable",
                column: "Procurement_Request_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Account_Code_Budget_ID_Category_ID",
                table: "Procurement_Request",
                columns: new[] { "Account_Code", "Budget_ID", "Category_ID" });

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_EmployeeID",
                table: "Procurement_Request",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Payment_Method_ID",
                table: "Procurement_Request",
                column: "Payment_Method_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Procurement_Payment_Status_ID",
                table: "Procurement_Request",
                column: "Procurement_Payment_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Procurement_Status_ID",
                table: "Procurement_Request",
                column: "Procurement_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Requisition_Status_ID",
                table: "Procurement_Request",
                column: "Requisition_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Sign_Off_Status_ID",
                table: "Procurement_Request",
                column: "Sign_Off_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Procurement_Request_Vendor_ID",
                table: "Procurement_Request",
                column: "Vendor_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Proof_Of_Payment_Procurement_Request_ID",
                table: "Proof_Of_Payment",
                column: "Procurement_Request_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Sole_Supplier_Vendor_Detail_ID",
                table: "Sole_Supplier",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Temporary_Access_Delegation_ID",
                table: "Temporary_Access",
                column: "Delegation_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_ID",
                table: "User",
                column: "Role_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Access_Access_ID",
                table: "User_Access",
                column: "Access_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Vendor_Status_ID",
                table: "Vendor",
                column: "Vendor_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Agreement_Vendor_Detail_ID",
                table: "Vendor_Agreement",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Asset_Vendor_Detail_ID",
                table: "Vendor_Asset",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Asset_Vendor_ID",
                table: "Vendor_Asset",
                column: "Vendor_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Consumable_Consumable_ID",
                table: "Vendor_Consumable",
                column: "Consumable_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Consumable_Vendor_Detail_ID",
                table: "Vendor_Consumable",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Detail_Vendor_Category_ID",
                table: "Vendor_Detail",
                column: "Vendor_Category_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Detail_Vendor_ID",
                table: "Vendor_Detail",
                column: "Vendor_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Fax_Vendor_Detail_ID",
                table: "Vendor_Fax",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Insurance_Vendor_Detail_ID",
                table: "Vendor_Insurance",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_License_Vendor_Detail_ID",
                table: "Vendor_License",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Payment_Terms_Vendor_Detail_ID",
                table: "Vendor_Payment_Terms",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Popia_Vendor_Detail_ID",
                table: "Vendor_Popia",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Registration_Vendor_Detail_ID",
                table: "Vendor_Registration",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Tax_Vendor_Detail_ID",
                table: "Vendor_Tax",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Vat_Vendor_Detail_ID",
                table: "Vendor_Vat",
                column: "Vendor_Detail_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Vendor_Website_Vendor_Detail_ID",
                table: "Vendor_Website",
                column: "Vendor_Detail_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Delegation_Status");

            migrationBuilder.DropTable(
                name: "HELP");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "Onboard_Request");

            migrationBuilder.DropTable(
                name: "Payment_Made");

            migrationBuilder.DropTable(
                name: "POPI");

            migrationBuilder.DropTable(
                name: "Procurement_Asset");

            migrationBuilder.DropTable(
                name: "Procurement_Consumable");

            migrationBuilder.DropTable(
                name: "Proof_Of_Payment");

            migrationBuilder.DropTable(
                name: "Sole_Supplier");

            migrationBuilder.DropTable(
                name: "User_Access");

            migrationBuilder.DropTable(
                name: "VAT");

            migrationBuilder.DropTable(
                name: "Vendor_Agreement");

            migrationBuilder.DropTable(
                name: "Vendor_Asset");

            migrationBuilder.DropTable(
                name: "Vendor_Consumable");

            migrationBuilder.DropTable(
                name: "Vendor_Fax");

            migrationBuilder.DropTable(
                name: "Vendor_Insurance");

            migrationBuilder.DropTable(
                name: "Vendor_License");

            migrationBuilder.DropTable(
                name: "Vendor_Payment_Terms");

            migrationBuilder.DropTable(
                name: "Vendor_Popia");

            migrationBuilder.DropTable(
                name: "Vendor_Registration");

            migrationBuilder.DropTable(
                name: "Vendor_Tax");

            migrationBuilder.DropTable(
                name: "Vendor_Vat");

            migrationBuilder.DropTable(
                name: "Vendor_Website");

            migrationBuilder.DropTable(
                name: "Help_Category");

            migrationBuilder.DropTable(
                name: "Calender_Items");

            migrationBuilder.DropTable(
                name: "Notification_Type");

            migrationBuilder.DropTable(
                name: "Contracted_Partner_Type");

            migrationBuilder.DropTable(
                name: "Due_Dillegence");

            migrationBuilder.DropTable(
                name: "Asset");

            migrationBuilder.DropTable(
                name: "Procurement_Request");

            migrationBuilder.DropTable(
                name: "Access");

            migrationBuilder.DropTable(
                name: "Consumable");

            migrationBuilder.DropTable(
                name: "Importance_Level");

            migrationBuilder.DropTable(
                name: "Vendor_Detail");

            migrationBuilder.DropTable(
                name: "Budget_Line");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Payment_Method");

            migrationBuilder.DropTable(
                name: "Procurement_Payment_Status");

            migrationBuilder.DropTable(
                name: "Procurement_Status");

            migrationBuilder.DropTable(
                name: "Requisition_Status");

            migrationBuilder.DropTable(
                name: "Sign_Off_Status");

            migrationBuilder.DropTable(
                name: "Temporary_Access");

            migrationBuilder.DropTable(
                name: "Consumable_Category");

            migrationBuilder.DropTable(
                name: "Vendor_Category");

            migrationBuilder.DropTable(
                name: "Vendor");

            migrationBuilder.DropTable(
                name: "Budget_Allocation");

            migrationBuilder.DropTable(
                name: "Budget_Category");

            migrationBuilder.DropTable(
                name: "Branch");

            migrationBuilder.DropTable(
                name: "Mandate_Limit");

            migrationBuilder.DropTable(
                name: "Delegation_Of_Authority");

            migrationBuilder.DropTable(
                name: "Vendor_Status");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "Admin");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
