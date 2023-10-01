﻿namespace ProcionAPI.Models.Repositories
{
    public interface IBackupRepository
    {
        Task<bool> RestoreDatabase(IFormFile backupFilePath);
    }
}
