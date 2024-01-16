namespace ProjectPlanner.App;

using Microsoft.EntityFrameworkCore;
using ProjectPlanner.App.Models.Database;

internal class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var services = builder.Services;
        await services.AddDatabaseAsync();

        var app = builder.Build();

        app.UseHttpsRedirection();

        app.MapGet("/ping", () => new { status = "Alive", date = DateTime.UtcNow });

        app.MapGet(
            "/projects", async (ProjectDbContext dbContext) =>
            {
                var projects = await dbContext.Projects.ToListAsync();

                return new { projects };
            });

        await app.RunAsync();
    }
}
