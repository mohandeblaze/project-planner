var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseHttpsRedirection();

app.MapGet("/ping", () => new { status = "Alive", date = DateTime.UtcNow });

Console.WriteLine("Application started");

app.Run();
