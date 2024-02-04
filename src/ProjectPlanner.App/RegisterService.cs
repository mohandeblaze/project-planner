namespace ProjectPlanner.App;

using System.ComponentModel.Design;
using Auth0.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using ProjectPlanner.Shared.Models;
using ProjectPlanner.Shared.Models.Database;
using ProjectPlanner.Shared.Models.ProjectEnv;

internal static class RegisterService
{
    internal static void AddCommonServices(this IServiceCollection services)
    {
        services.AddAuthorization();
        services.AddControllers();
    }

    internal static void AddAuth0(this IServiceCollection services)
    {
#if DEBUG
        services.AddSameSiteNoneCookies();
#endif

        services.AddAuth0WebAppAuthentication(
            options =>
            {
                options.Domain = AppEnvVar.I.Auth0Domain;
                options.ClientId = AppEnvVar.I.Auth0ClientId;
                options.Scope = "openid profile email";
            });
    }

    private static void AddSameSiteNoneCookies(this IServiceCollection services)
    {
        services.Configure<CookiePolicyOptions>(
            options =>
            {
                options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
                options.OnAppendCookie = cookieContext => CheckSameSite(cookieContext.CookieOptions);
                options.OnDeleteCookie = cookieContext => CheckSameSite(cookieContext.CookieOptions);
            });
    }

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

    private static void CheckSameSite(CookieOptions options)
    {
        if (options is { SameSite: SameSiteMode.None, Secure: false })
        {
            options.SameSite = SameSiteMode.Unspecified;
        }
    }
}
