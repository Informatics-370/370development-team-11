using ProcionAPI.Models.MailKit_Model;

namespace ProcionAPI.Models.Repositories
{
    public interface IMailService
    {
        Task<bool> SendAsync(MailData mailData, CancellationToken ct);
        string GetEmailTemplate<T>(string emailTemplate, T emailTemplateModel);
    }
}
