namespace ProjectPlanner.App;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
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
            "/projects",
            async (ProjectDbContext dbContext) => new { projects = await dbContext.Projects.CountAsync() });

        app.UseClientStaticFiles();
        app.UseRouting();
        app.UseClientApp();

        await app.RunAsync();
    }
}
