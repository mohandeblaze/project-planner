namespace ProjectPlanner.Worker;

using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using ProjectPlanner.Shared;
using ProjectPlanner.Shared.Models.Database;
using ProjectPlanner.Shared.Models.ProjectEnv;
using ProjectPlanner.Worker.Services;

internal static class RegisterService
{
    internal static async Task RegisterServices(this IServiceCollection services)
    {
        services.AddDatabase();
        services.AddHostedService<DatabaseBackupWorker>();
        services.AddSingleton<PostgresBackupService>();
        await services.AddDriveServiceAsync();
    }

    private static async Task AddDriveServiceAsync(this IServiceCollection services)
    {
        var fileName = Environment.GetEnvironmentVariable(ProjectEnv.BackupAgentServiceAccountFile)
            ?? throw new Exception(
                $"{ProjectEnv.BackupAgentServiceAccountFile} environment variable not set");

        var credential = await GoogleCredential.FromFileAsync(fileName, CancellationToken.None);

        if (credential.UnderlyingCredential is not ServiceAccountCredential initializer)
        {
            throw new Exception("Failed to get service account credential");
        }

        initializer.Scopes = new[]
        {
            DriveService.Scope.Drive,
        };

        var driveService = new DriveService(
            new BaseClientService.Initializer()
            {
                HttpClientInitializer = initializer,
                ApplicationName = "ProjectPlannerDotnetApp",
            });

        services.AddSingleton(driveService);
        services.AddSingleton<GoogleDriveService>();
    }
}
