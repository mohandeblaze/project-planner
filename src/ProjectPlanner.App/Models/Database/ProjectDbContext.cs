namespace ProjectPlanner.App.Models.Database;

using Microsoft.EntityFrameworkCore;
using ProjectPlanner.App.Models.Database.Entity;

public class ProjectDbContext(DbContextOptions<ProjectDbContext> options) : DbContext(options)
{
    public required DbSet<Project> Projects { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        this.UpdateDatedFields();

        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        this.UpdateDatedFields();

        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    public async Task SaveAndDetachAsync<T>(T entity)
        where T : class
    {
        await this.SaveChangesAsync();

        this.Entry(entity).State = EntityState.Detached;
    }

    public async Task SaveAndDetachAsync()
    {
        var entities = this.ChangeTracker.Entries()
            .Where(x => x.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
            .Select(x => x.Entity)
            .ToList();

        await this.SaveChangesAsync();

        foreach (var entity in entities)
        {
            this.Entry(entity).State = EntityState.Detached;
        }
    }

    public void Detach<T>()
        where T : class
    {
        var entities = this.ChangeTracker.Entries<T>()
            .Select(x => x.Entity)
            .ToList();

        foreach (var entity in entities)
        {
            this.Entry(entity).State = EntityState.Detached;
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        SetEntityModel(modelBuilder);
        base.OnModelCreating(modelBuilder);
    }

    private void UpdateDatedFields()
    {
        this.ChangeTracker.DetectChanges();

        foreach (var entry in this.ChangeTracker.Entries<IDatedEntity>()
                     .Where(x => x.State is EntityState.Added or EntityState.Modified))
        {
            var entity = entry.Entity;

            switch (entry.State)
            {
                case EntityState.Added:
                    entity.CreatedDate = DateTime.UtcNow;
                    entity.ModifiedDate = DateTime.UtcNow;

                    break;

                case EntityState.Modified:
                    entity.ModifiedDate = DateTime.UtcNow;

                    break;
            }
        }
    }

    private static void SetEntityModel(ModelBuilder builder)
    {
        foreach (var entity in builder.Model.GetEntityTypes())
        {
            if (entity.GetTableName() != null)
            {
                entity.SetTableName(entity.GetTableName()?.ToLower());
            }

            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(property.GetColumnName().ToLower());
            }

            foreach (var key in entity.GetKeys())
            {
                if (key.GetName() != null)
                {
                    key.SetName(key.GetName()?.ToLower());
                }
            }

            foreach (var key in entity.GetForeignKeys())
            {
                if (key.GetConstraintName() != null)
                {
                    key.SetConstraintName(key.GetConstraintName()?.ToLower());
                }
            }
        }
    }
}
