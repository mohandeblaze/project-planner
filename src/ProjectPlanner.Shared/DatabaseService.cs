namespace ProjectPlanner.Shared;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using ProjectPlanner.Shared.Models;
using ProjectPlanner.Shared.Models.Database;

public static class DatabaseService
{
    public static async Task AddDatabaseAsync(this IServiceCollection services)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        var database = Environment.GetEnvironmentVariable(PostgresConnectionEnv.Database)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.Database} from environment");

        var username = Environment.GetEnvironmentVariable(PostgresConnectionEnv.Username)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.Username} from environment");

        var postgresPasswordFile = Environment.GetEnvironmentVariable(PostgresConnectionEnv.PasswordFile)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.PasswordFile} from environment");

        var password = postgresPasswordFile.Contains("/run")
            ? await File.ReadAllTextAsync(postgresPasswordFile)
            : postgresPasswordFile;

        var portStr = Environment.GetEnvironmentVariable(PostgresConnectionEnv.Port)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.Port} from environment");

        _ = int.TryParse(portStr, out var port)
            ? port
            : throw new Exception(
                $"Unable to parse {PostgresConnectionEnv.Port} with value {portStr} as int");

        var host = Environment.GetEnvironmentVariable(PostgresConnectionEnv.Host)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.Host} from environment");

        var connectionStringBuilder = new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Port = port,
            Database = database,
            Username = username,
            Password = password,
            ApplicationName = "ProjectPlannerDotNetBackend",
        };

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionStringBuilder.ToString());
        dataSourceBuilder.EnableDynamicJson();

        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<ProjectDbContext>(options => options.UseNpgsql(dataSource));
    }
}
