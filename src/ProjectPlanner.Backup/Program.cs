using ProjectPlanner.Shared;

namespace ProjectPlanner.Backup;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);
        var services = builder.Services;
        services.AddHostedService<Worker>();
        await services.AddDatabaseAsync();

        var host = builder.Build();
        await host.RunAsync();
    }
}
