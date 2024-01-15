var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseHttpsRedirection();

app.MapGet("/ping", async () =>
{
    var postgresDb = Environment.GetEnvironmentVariable("POSTGRES_DB");
    var postgresPasswordFile = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD_FILE");

    Console.WriteLine($"POSTGRES_DB: {postgresDb}");
    Console.WriteLine($"POSTGRES_PASSWORD_FILE: {postgresPasswordFile}");

    if (postgresPasswordFile != null)
    {
        var password = await File.ReadAllTextAsync(postgresPasswordFile);

        Console.WriteLine($"POSTGRES_PASSWORD length: {password.Length}");
    }

    return new { status = "Alive", date = DateTime.UtcNow };
});

Console.WriteLine("Application started");

app.Run();
