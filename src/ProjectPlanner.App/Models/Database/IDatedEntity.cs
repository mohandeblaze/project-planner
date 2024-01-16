namespace ProjectPlanner.App.Models.Database;

public interface IDatedEntity
{
    DateTime CreatedDate { get; set; }

    DateTime ModifiedDate { get; set; }
}
