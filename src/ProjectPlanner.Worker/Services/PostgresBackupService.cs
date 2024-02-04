namespace ProjectPlanner.Worker.Services;

using System.Diagnostics;
using ProjectPlanner.Shared;
using ProjectPlanner.Shared.Models.ProjectEnv;

public class PostgresBackupService(ILogger<PostgresBackupService> logger)
{
    public async Task<string> DumpAsync()
    {
        using var process = new Process();

        var backupFileName =
            $"/{ProjectEnv.BackupVolume}/{DateTime.UtcNow:yyyy-MM-dd-HH-mm-ss}_pgdata.backup";

        var db = Database.GetConnection();

        var args =
            $"-d \"postgresql://{db.Username}:{db.Password}@{db.Host}:{db.Port}/{db.Database}\" -F c -b -v -f {backupFileName}";

        process.StartInfo = new ProcessStartInfo
        {
            FileName = "pg_dump",
            Arguments = args,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        process.OutputDataReceived += (_, e) => logger.LogInformation(e.Data);

        process.ErrorDataReceived += (_, e) => logger.LogInformation(e.Data);

        process.Start();

        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        await process.WaitForExitAsync();

        if (process.ExitCode == 0)
        {
            logger.LogInformation("Backup completed: {BackupFileName}", backupFileName);
        }
        else
        {
            logger.LogError("Backup failed. Exit code: {ProcessExitCode}", process.ExitCode);
        }

        return backupFileName;
    }
}
