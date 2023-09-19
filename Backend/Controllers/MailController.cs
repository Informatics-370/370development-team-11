using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.MailKit_Model;
using ProcionAPI.Models.Repositories;
using System.Collections.Generic;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IMailService _mail;

        public MailController(IMailService mail)
        {
            _mail = mail;
        }

        [HttpPost("sendmail")]
        public async Task<IActionResult> SendMailAsync(MailData mailData)
        {
            bool result = await _mail.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Mail could not be sent.");
            }
        }

        [HttpPost("sendemailusingtemplate")]
        public async Task<IActionResult> SendEmailUsingTemplate(NewEmpMail welcomeMail)
        {
            // Create MailData object
            MailData mailData = new MailData(
                new List<string> { welcomeMail.Email },
                "Login Credentials",
                _mail.GetEmailTemplate("newEmp", welcomeMail));


            bool sendResult = await _mail.SendAsync(mailData, new CancellationToken());

            if (sendResult)
            {
                return Ok(sendResult);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Mail could not be sent.");
            }
        }


        [HttpPost("ForgotPasswordEmail")]
        public async Task<IActionResult> ForgotPasswordEmail(NewEmpMail ForgotPassMail)
        {
            // Create MailData object
            MailData mailData = new MailData(
                new List<string> { ForgotPassMail.Email },
                "Login Credentials",
                _mail.GetEmailTemplate("ForgotPass", ForgotPassMail));


            bool sendResult = await _mail.SendAsync(mailData, new CancellationToken());

            if (sendResult)
            {
                return Ok(sendResult);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Mail could not be sent.");
            }
        }

        [HttpPost("OTPEmail")]
        public async Task<IActionResult> OTPEmail(NewEmpMail OTP)
        {
            // Create MailData object
            MailData mailData = new MailData(
                new List<string> { OTP.Email },
                "OTP",
                _mail.GetEmailTemplate("OTP", OTP));


            bool sendResult = await _mail.SendAsync(mailData, new CancellationToken());

            if (sendResult)
            {
                return Ok(sendResult);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Mail could not be sent.");
            }
        }

        [HttpPost("ResetUsernameEmail")]
        public async Task<IActionResult> ResetUsernameEmail(NewEmpMail ResetUsernameEmail)
        {
            // Create MailData object
            MailData mailData = new MailData(
                new List<string> { ResetUsernameEmail.Email },
                "Login Credentials",
                _mail.GetEmailTemplate("UserNameChange", ResetUsernameEmail));


            bool sendResult = await _mail.SendAsync(mailData, new CancellationToken());

            if (sendResult)
            {
                return Ok(sendResult);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Mail could not be sent.");
            }
        }

    }
}
