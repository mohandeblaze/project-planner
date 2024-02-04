namespace ProjectPlanner.Shared.Models.ProjectEnv;

public partial class AppEnvVar
{
    public required string Auth0Domain { get; init; }

    public required string Auth0ClientId { get; init; }
}

public partial class AppEnvVar
{
    public static AppEnvVar I { get; private set; } = null!;

    public static async Task ReadAsync()
    {
        var auth0Domain = await File.ReadAllTextAsync(Environment.GetEnvironmentVariable(ProjectEnv.Auth0DomainFile)!.Trim());
        var auth0ClientId = await File.ReadAllTextAsync(Environment.GetEnvironmentVariable(ProjectEnv.Auth0ClientIdFile)!.Trim());

        I = new AppEnvVar
        {
            Auth0Domain = auth0Domain.Trim(),
            Auth0ClientId = auth0ClientId.Trim(),
        };
    }
}
