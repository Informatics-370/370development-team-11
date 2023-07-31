namespace ProcionAPI.Models.Repositories
{
    public interface IBackupRepository
    {
        Task<bool>  CreateBackup();
        Task<bool> RestoreDatabase(IFormFile backupFilePath);
    }
}
