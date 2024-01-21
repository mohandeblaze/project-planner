namespace ProjectPlanner.Worker;

using ProjectPlanner.Shared;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var services = builder.Services;
        services.AddDatabase();
        services.AddHostedService<DatabaseBackupWorker>();

        var app = builder.Build();

        app.MapGet("/ping", () => new { status = "Alive", date = DateTime.UtcNow });

        await app.RunAsync();
    }
}
