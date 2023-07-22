using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Net.Http.Headers;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : Controller
    {
        public readonly INotificationRepository _NotificationRepository;

        public NotificationController(INotificationRepository NotificationRepository)
        {
            _NotificationRepository = NotificationRepository;
        }

        [HttpGet]
        [Route("GetNotifications/{username}")]
        public async Task<IActionResult> GetNotifications(string username)
        {
            try
            {
                var result = await _NotificationRepository.GetNotificationsAsync(username);

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetVendorNotifications/{username}")]
        public async Task<IActionResult> GetVendorNotifications(string username)
        {
            try
            {
                var result = await _NotificationRepository.GetVendorNotificationsAsync(username);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetTempVendorNotifications/{tempUsername}")]
        public async Task<IActionResult> GetTempVendorNotifications(string tempUsername)
        {
            try
            {
                var result = await _NotificationRepository.GetTempVendorNotificationsAsync(tempUsername);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetInventoryNotifications/{username}")]
        public async Task<IActionResult> GetInventoryNotifications(string username)
        {
            try
            {
                var result = await _NotificationRepository.GetInventoryNotificationsAsync(username);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetTempInventoryNotifications/{tempUsername}")]
        public async Task<IActionResult> GetTempInventoryNotifications(string tempUsername)
        {
            try
            {
                var result = await _NotificationRepository.GetTempInventoryNotificationsAsync(tempUsername);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProcurementNotifications/{username}")]
        public async Task<IActionResult> GetProcurementNotifications(string username)
        {
            try
            {
                var result = await _NotificationRepository.GetProcurementNotificationsAsync(username);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetTempProcurementNotifications/{tempUsername}")]
        public async Task<IActionResult> GetTempProcurementNotifications(string tempUsername)
        {
            try
            {
                var result = await _NotificationRepository.GetTempProcurementNotificationsAsync(tempUsername);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
