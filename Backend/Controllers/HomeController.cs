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
                        if (d.From_Date <= DateTime.Today)
                        {
                            Notification newNotification = new Notification();
                            
                            await _DelegationRepository.UpdateDelegationStatusAsync(activeID, d.Delegation_ID);
                            await _DelegationRepository.AddActiveNotificationaAsync(d.User_Id, newNotification, d);

                            return Ok(doa);

                        }
                        else if (d.To_Date < DateTime.Today)
                        {
                            Notification newNotification = new Notification();

                            await _DelegationRepository.UpdateDelegationStatusAsync(revokedID, d.Delegation_ID);
                            await _DelegationRepository.AddRevokeNotificationaAsync(d.User_Id, newNotification, d);

                            var existingTempAcc = await _DelegationRepository.GetTempAccAsync(d.Delegation_ID);
                            if (existingTempAcc == null) return NotFound($"The temporary access does not exist");

                            _DelegationRepository.Delete(existingTempAcc);
                            await _DelegationRepository.SaveChangesAsync();
                            return Ok(doa);
                        }
                    }
                    else if(d.DelegationStatus_ID == activeID)
                    {
                        if(d.To_Date < DateTime.Today)
                        {
                            Notification newNotification = new Notification();

                            await _DelegationRepository.UpdateDelegationStatusAsync(revokedID, d.Delegation_ID);
                            await _DelegationRepository.AddRevokeNotificationaAsync(d.User_Id, newNotification, d);

                            var existingTempAcc = await _DelegationRepository.GetTempAccAsync(d.Delegation_ID);
                            if (existingTempAcc == null) return NotFound($"The temporary access does not exist");

                            _DelegationRepository.Delete(existingTempAcc);
                            await _DelegationRepository.SaveChangesAsync();
                            return Ok(doa);
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

    }
}
