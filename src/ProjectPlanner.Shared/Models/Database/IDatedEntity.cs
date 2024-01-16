namespace ProjectPlanner.Shared.Models.Database;

public interface IDatedEntity
{
    DateTime CreatedDate { get; set; }

    DateTime ModifiedDate { get; set; }
}
