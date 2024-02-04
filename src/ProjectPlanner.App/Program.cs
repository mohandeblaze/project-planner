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
        services.AddDatabase();
        services.AddHttpClient();

        var app = builder.Build();

        if (app.Environment.IsProduction())
        {
            app.UseHttpsRedirection();
            app.UseHsts();
        }

        app.MapGet("/ping", () => new { status = "Alive", date = DateTime.UtcNow });

        app.MapGet(
            "/projects", async (ProjectDbContext dbContext) =>
            {
                var projects = await dbContext.Projects.CountAsync();

                return new { projects };
            });

        app.UseDefaultFiles();
        app.UseStaticFiles();
        app.UseRouting();

        app.MapFallbackToFile("index.html");

        await app.RunAsync();
    }
}
