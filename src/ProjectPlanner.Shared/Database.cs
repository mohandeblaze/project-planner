﻿namespace ProjectPlanner.Shared;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using ProjectPlanner.Shared.Models;
using ProjectPlanner.Shared.Models.Database;
using ProjectPlanner.Shared.Models.ProjectEnv;

public static class Database
{
    public static NpgsqlDataSource GetDataSource(NpgsqlConnectionStringBuilder? connection = null)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        var connectionStringBuilder = connection ?? GetConnection();

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionStringBuilder.ToString());
        dataSourceBuilder.EnableDynamicJson();

        var dataSource = dataSourceBuilder.Build();

        return dataSource;
    }

    public static NpgsqlConnectionStringBuilder GetConnection()
    {
        var database = Environment.GetEnvironmentVariable(PostgresConnectionEnv.Database)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.Database} from environment");

        var username = Environment.GetEnvironmentVariable(PostgresConnectionEnv.Username)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.Username} from environment");

        var postgresPasswordFile = Environment.GetEnvironmentVariable(PostgresConnectionEnv.PasswordFile)
            ?? throw new Exception($"Unable to get {PostgresConnectionEnv.PasswordFile} from environment");

        var password = postgresPasswordFile.Contains("/run")
            ? File.ReadAllText(postgresPasswordFile)
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
            Host = host.Trim(),
            Port = port,
            Database = database.Trim(),
            Username = username.Trim(),
            Password = password.Trim(),
            ApplicationName = "ProjectPlannerDotNetBackend",
        };

        return connectionStringBuilder;
    }

    public static void AddDatabase(this IServiceCollection services)
    {
        var dataSource = GetDataSource();

        services.AddDbContext<ProjectDbContext>(options => options.UseNpgsql(dataSource));
    }
}
