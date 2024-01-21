namespace ProjectPlanner.Worker;

using System.Diagnostics;

public class DatabaseBackupWorker(ILogger<DatabaseBackupWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (logger.IsEnabled(LogLevel.Information))
            {
                logger.LogInformation("Worker running at: {Time}", DateTimeOffset.Now);
            }

            await Task.Delay(2000, stoppingToken);
        }
    }

    private async Task BackupDatabase()
    {
        using var process = new Process();

        process.StartInfo = new ProcessStartInfo
        {
            FileName = "pg_dump",
            Arguments =
                $"-U postgres -h db -p 1234 -F c -b -v -f {DateTime.Now:yyyy-MM-dd-HH-mm-ss}.backup projectplanner",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        process.Start();

        await process.WaitForExitAsync();
    }
}
