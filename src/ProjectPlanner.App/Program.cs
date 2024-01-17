namespace ProjectPlanner.App;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectPlanner.Shared;
using ProjectPlanner.Shared.Models.Database;

internal class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var services = builder.Services;
        await services.AddDatabaseAsync();
        services.AddHttpClient();

        var app = builder.Build();

        app.UseHttpsRedirection();

        app.MapGet("/ping", () => new { status = "Alive", date = DateTime.UtcNow });

        app.MapGet(
            "/worker/ping",
            async ([FromServices] IHttpClientFactory clientFactory) =>
            {
                using var client = clientFactory.CreateClient("worker");
                using var response = await client.GetAsync("http://app-worker/ping");

                return !response.IsSuccessStatusCode
                    ? new { status = "Dead", date = DateTime.UtcNow }
                    : new { status = "Alive", date = DateTime.UtcNow };
            });

        app.MapGet(
            "/projects", async (ProjectDbContext dbContext) =>
            {
                var projects = await dbContext.Projects.ToListAsync();

                return new { projects };
            });

        await app.RunAsync();
    }
}
