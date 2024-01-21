namespace ProjectPlanner.Worker;

using ProjectPlanner.Worker.Services;

public class DatabaseBackupWorker(
    ILogger<DatabaseBackupWorker> logger,
    GoogleDriveService googleDriveService,
    PostgresBackupService backupService)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            logger.LogInformation("Worker running at: {Time}", DateTimeOffset.Now);

            var dumpFile = await backupService.DumpAsync();
            await googleDriveService.UploadAsync(dumpFile);

            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
