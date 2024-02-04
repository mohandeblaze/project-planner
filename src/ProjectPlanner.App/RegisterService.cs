namespace ProjectPlanner.App;

using Microsoft.EntityFrameworkCore;
using Npgsql;
using ProjectPlanner.Shared.Models;
using ProjectPlanner.Shared.Models.Database;

internal static class RegisterService
{
    internal static void UseClientStaticFiles(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            return;
        }

        app.UseDefaultFiles();
        app.UseStaticFiles();
    }

    internal static void UseClientApp(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSpa(spaBuilder => spaBuilder.UseProxyToSpaDevelopmentServer("http://localhost:5173"));

            return;
        }

        app.MapFallbackToFile("index.html");
    }
}
