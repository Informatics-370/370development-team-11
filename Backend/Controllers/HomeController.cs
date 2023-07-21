using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Net.Http.Headers;
using Hangfire;
using System.Reflection;
using System.CodeDom;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : Controller
    {
        public readonly IDelegationRepository _DelegationRepository;
        public HomeController(IDelegationRepository delegatorRepository)
        {
            _DelegationRepository = delegatorRepository;
        }

        public readonly IVendorRepository _VendorRepository;
        public HomeController(IVendorRepository VendorRepository)
        {
            _VendorRepository = VendorRepository;
        }

        [HttpGet]
        [Route("FireAndForgetJob")]
        public string FireAndForgetJob()
        {
            //Fire - and - Forget Jobs
            //Fire - and - forget jobs are executed only once and almost immediately after creation.
            var jobId = BackgroundJob.Enqueue(() => Console.WriteLine("Welcome user in Fire and Forget Job Demo!"));

            return $"Job ID: {jobId}. Welcome user in Fire and Forget Job Demo!";
        }

        [HttpGet]
        [Route("DelayedJob")]
        public string DelayedJob( )
        {
            //var selectedDate = new DateTimeOffset(date, TimeSpan.Zero);

            //BackgroundJob.Schedule(() => getBEE(VendorID, date, 1), selectedDate.AddYears(1).AddDays(-21));

            //BackgroundJob.Schedule(() => getBEE(VendorID, date, 2), selectedDate.AddYears(1).AddDays(-7));

            //BackgroundJob.Schedule(() => getBEE(VendorID, date, 3), selectedDate.AddYears(1));


            return "Added new delayed jobs!";

        }

        

        [HttpGet]
        [Route("ContinuousJob")]
        public string ContinuousJob()
        {
            //Fire - and - Forget Jobs
            //Fire - and - forget jobs are executed only once and almost immediately after creation.
            var parentjobId = BackgroundJob.Enqueue(() => Console.WriteLine("Welcome user in Fire and Forget Job Demo!"));

            //Continuations
            //Continuations are executed when its parent job has been finished.
            BackgroundJob.ContinueJobWith(parentjobId, () => Console.WriteLine("Welcome Sachchi in Continuos Job Demo!"));

            return "Welcome user in Continuos Job Demo!";
        }

        //[HttpGet]
        //[Route("RecurringJobNotification")]
        //public string RecurringJobsNotification()
        //{
        //    //Recurring Jobs
        //    //Recurring jobs fire many times on the specified CRON schedule.
        //    RecurringJob.AddOrUpdate(() => CheckDelegationRequests(), Cron.Minutely, TimeZoneInfo.Local);

        //    return "Welcome user in Recurring Job Demo!";
        //}

        [HttpGet]
        [Route("RecurringJobDelegation")]
        public string RecurringJobs()
        {
            //Recurring Jobs
            //Recurring jobs fire many times on the specified CRON schedule.
            RecurringJob.AddOrUpdate(() => CheckDelegationRequests(), Cron.Daily, TimeZoneInfo.Local);

            return "Welcome user in Recurring Job Demo!";
        }

        [HttpPut]
        [Route("CheckDelegation")]
        public async Task<IActionResult> CheckDelegationRequests()
        {
            try
            {
                var doa = await _DelegationRepository.GetAllDelegationsAsync();
                var doas = await _DelegationRepository.GetAllStatusesAsync();
                int inactiveID = 0;
                int activeID = 0;
                int revokedID = 0;

                foreach (var s in doas)
                {
                    if (s.Name == "Inactive")
                    {
                        inactiveID = s.Status_ID;
                    }

                    if (s.Name == "Active")
                    {
                        activeID = s.Status_ID;
                    }

                    if (s.Name == "Revoked")
                    {
                        revokedID = s.Status_ID;
                    }
                }

                foreach (var d in doa)
                {

                    if (d.DelegationStatus_ID == inactiveID)
                    {
                        if (d.From_Date == DateTime.Today)
                        {
                            await _DelegationRepository.UpdateDelegationStatusAsync(activeID, d.Delegation_ID);
                            
                        }
                    }
                    else if(d.DelegationStatus_ID == activeID)
                    {
                        if(d.To_Date == DateTime.Today)
                        {
                           await _DelegationRepository.UpdateDelegationStatusAsync(revokedID, d.Delegation_ID);
                        }
                    }
                }

                return Ok(doa);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("BatchesJob")]
        public string BatchesJob()
        {
            //Batches - This option is available into hangfire Pro only
            //Batch is a group of background jobs that is created atomically and considered as a single entity.
            //Commenting the code as it's only available into Pro version


            //var batchId = BatchJob.StartNew(x =>
            //{
            //    x.Enqueue(() => Console.WriteLine("Batch Job 1"));
            //    x.Enqueue(() => Console.WriteLine("Batch Job 2"));
            //});

            return "Welcome user in Batches Job Demo!";
        }

        [HttpGet]
        [Route("BatchContinuationsJob")]
        public string BatchContinuationsJob()
        {
            //Batch Continuations - This option is available into hangfire Pro only
            //Batch continuation is fired when all background jobs in a parent batch finished.
            //Commenting the code as it's only available into Pro version

            //var batchId = BatchJob.StartNew(x =>
            //{
            //    x.Enqueue(() => Console.WriteLine("Batch Job 1"));
            //    x.Enqueue(() => Console.WriteLine("Batch Job 2"));
            //});

            //BatchJob.ContinueBatchWith(batchId, x =>
            //{
            //    x.Enqueue(() => Console.WriteLine("Last Job"));
            //});

            return "Welcome user in Batch Continuations Job Demo!";
        }
    }
}
