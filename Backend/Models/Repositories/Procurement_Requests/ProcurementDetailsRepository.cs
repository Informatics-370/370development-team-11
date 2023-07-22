﻿using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public class ProcurementDetailsRepository : IProcurementDetailsRepository
    {
        private readonly AppDBContext _dbContext;

        public ProcurementDetailsRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Procurement_Request> GetProcurementRequestByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Procurement_Request> query = _dbContext.Procurement_Request.Include(x => x.Vendor).ThenInclude(x => x.Vendor_Status).Include(x => x.User).ThenInclude(x=> x.Role).Include(x => x.Requisition_Status).Where(x=> x.Procurement_Request_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Procurement_Details[]> CreateProcurementDetailsAsync(Procurement_Details ProcurementDetails)
        {
            Employee existingEmployee = await _dbContext.Employee.FirstOrDefaultAsync(x => x.EmployeeID == ProcurementDetails.EmployeeID);

            if (existingEmployee != null)
            {
                ProcurementDetails.Employee = existingEmployee;
            }

            Procurement_Request existingProcurementRequest = await _dbContext.Procurement_Request.FirstOrDefaultAsync(x => x.Procurement_Request_ID == ProcurementDetails.Procurement_Request_ID);

            if (existingProcurementRequest != null)
            {
                ProcurementDetails.Procurement_Request = existingProcurementRequest;

               
            }

            //Vendor_Status existingVendorStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(x => x.Vendor_Status_ID == ProcurementDetails.Procurement_Request.Vendor.Vendor_Status_ID);

            //if (existingVendorStatus != null)
            //{
            //    ProcurementDetails.Procurement_Request.Vendor.Vendor_Status = existingVendorStatus;
            //}

            //Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(x => x.Role_ID == ProcurementDetails.Procurement_Request.User.Role_ID);

            //if (existingRole != null)
            //{
            //    ProcurementDetails.Procurement_Request.User.Role = existingRole;
            //}

            Sign_Off_Status existingSignOffStatus = await _dbContext.Sign_Off_Status.FirstOrDefaultAsync(x => x.Sign_Off_Status_ID == ProcurementDetails.Sign_Off_Status_ID);

            if (existingSignOffStatus != null)
            {
                ProcurementDetails.Sign_Off_Status = existingSignOffStatus;
            }

            Procurement_Payment_Status existingProcurementPaymentStatus = await _dbContext.Procurement_Payment_Status.FirstOrDefaultAsync(x => x.Procurement_Payment_Status_ID == ProcurementDetails.Procurement_Payment_Status_ID);

            if (existingProcurementPaymentStatus != null)
            {
                ProcurementDetails.Procurement_Payment_Status = existingProcurementPaymentStatus;
            }

            Budget_Line existingBudgetLine = await _dbContext.Budget_Line.FirstOrDefaultAsync(x => x.Account_Code == ProcurementDetails.Account_Code);

            if (existingBudgetLine != null)
            {
                ProcurementDetails.Budget_Line = existingBudgetLine;
            }

            Procurement_Status existingProcurementStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == ProcurementDetails.Procurement_Status_ID);

            if (existingProcurementStatus != null)
            {
                ProcurementDetails.Procurement_Status = existingProcurementStatus;
            }

            Payment_Method existingPaymentMethod = await _dbContext.Payment_Method.FirstOrDefaultAsync(x => x.Payment_Method_ID == ProcurementDetails.Payment_Method_ID);

            if (existingPaymentMethod != null)
            {
                ProcurementDetails.Payment_Method = existingPaymentMethod;
            }

            await _dbContext.Procurement_Details.AddAsync(ProcurementDetails);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Details[] { ProcurementDetails };
        }

        public async Task<Deposit[]> AddDepositAsync(Deposit DepositDetails)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == DepositDetails.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                DepositDetails.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Deposit.AddAsync(DepositDetails);
            await _dbContext.SaveChangesAsync();

            return new Deposit[] { DepositDetails };
        }

        public async Task<Payment_Made[]> AddPaymentMadeAsync(Payment_Made PaymentMadeDetails)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == PaymentMadeDetails.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                PaymentMadeDetails.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Payment_Made.AddAsync(PaymentMadeDetails);
            await _dbContext.SaveChangesAsync();

            return new Payment_Made[] { PaymentMadeDetails };
        }

        public async Task<Proof_Of_Payment[]> AddProofOfPaymentAsync(Proof_Of_Payment AddPOP)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddPOP.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                AddPOP.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Proof_Of_Payment.AddAsync(AddPOP);
            await _dbContext.SaveChangesAsync();

            return new Proof_Of_Payment[] { AddPOP };
        }

        public async Task<Procurement_Consumable[]> AddProcurementConsumableAsync(Procurement_Consumable AddProcurementConsumable)
        {
            

            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddProcurementConsumable.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                AddProcurementConsumable.Procurement_Details = existingProcurementDetails;
            }

            Consumable existingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == AddProcurementConsumable.Consumable_ID);

            if (existingConsumable != null)
            {
                AddProcurementConsumable.Consumable = existingConsumable;
            }


            await _dbContext.Procurement_Consumable.AddAsync(AddProcurementConsumable);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Consumable[] { AddProcurementConsumable };
        }

        public async Task<Vendor_Consumable[]> AddVendorConsumableAsync(Vendor_Consumable AddVendorConsumable)
        {


            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == AddVendorConsumable.Vendor_ID);

            if (existingVendor != null)
            {
                AddVendorConsumable.Vendor = existingVendor;
            }

            Consumable existingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == AddVendorConsumable.Consumable_ID);

            if (existingConsumable != null)
            {
                AddVendorConsumable.Consumables = existingConsumable;
            }


            await _dbContext.Vendor_Consumable.AddAsync(AddVendorConsumable);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Consumable[] { AddVendorConsumable };
        }

        public async Task<Asset[]> AddAssetAsync(Asset AddAsset)
        {

            await _dbContext.Asset.AddAsync(AddAsset);
            await _dbContext.SaveChangesAsync();

            return new Asset[] { AddAsset };
        }

        public async Task<Procurement_Asset[]> AddProcurementAssetAsync(Procurement_Asset AddProcurementAsset)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddProcurementAsset.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                AddProcurementAsset.Procurement_Details = existingProcurementDetails;
            }

            Asset existingAssets= await _dbContext.Asset.FirstOrDefaultAsync(x => x.Asset_ID == AddProcurementAsset.Asset_ID);

            if (existingAssets != null)
            {
                AddProcurementAsset.Asset = existingAssets;
            }


            await _dbContext.Procurement_Asset.AddAsync(AddProcurementAsset);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Asset[] { AddProcurementAsset };
        }

        public async Task<Vendor_Asset[]> AddVendorAssetAsync(Vendor_Asset AddVendorAsset)
        {


            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == AddVendorAsset.Vendor_ID);

            if (existingVendor != null)
            {
                AddVendorAsset.Vendor = existingVendor;
            }

            Asset existingAssets = await _dbContext.Asset.FirstOrDefaultAsync(x => x.Asset_ID == AddVendorAsset.Asset_ID);

            if (existingAssets != null)
            {
                AddVendorAsset.Asset = existingAssets;
            }


            await _dbContext.Vendor_Asset.AddAsync(AddVendorAsset);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Asset[] { AddVendorAsset };
        }
    }
}
