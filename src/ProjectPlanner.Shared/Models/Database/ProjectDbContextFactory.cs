namespace ProjectPlanner.Shared.Models.Database;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using ProjectPlanner.Shared;

public class ProjectDbContextFactory : IDesignTimeDbContextFactory<ProjectDbContext>
{
    public ProjectDbContext CreateDbContext(string[] args)
    {
        Console.WriteLine("Executing design-time database context creation");
        var optionsBuilder = new DbContextOptionsBuilder<ProjectDbContext>();

        var dataSource = DatabaseService.GetDatabaseSource();
        optionsBuilder.UseNpgsql(dataSource);

        return new ProjectDbContext(optionsBuilder.Options);
    }
}
