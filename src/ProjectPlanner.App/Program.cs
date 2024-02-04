namespace ProjectPlanner.App;

using Auth0.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using ProjectPlanner.Shared;
using ProjectPlanner.Shared.Models.Database;
using ProjectPlanner.Shared.Models.ProjectEnv;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        await AppEnvVar.ReadAsync();

        var builder = WebApplication.CreateBuilder(args);

        var services = builder.Services;

        services.AddCommonServices();
        services.AddAuth0();
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
        app.UseCookiePolicy();

        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(
            endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });

        app.UseClientApp();

        await app.RunAsync();
    }
}
