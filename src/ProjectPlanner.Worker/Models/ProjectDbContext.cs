namespace ProjectPlanner.Worker.Models;

using Microsoft.EntityFrameworkCore;
using ProjectPlanner.Shared.Models.Database;

public class ProjectDbContext(DbContextOptions options) : Shared.Models.Database.ProjectDbContext(options);
