namespace ProjectPlanner.App.Models.Database.Entity;

using System.ComponentModel.DataAnnotations;

public class Project
{
    [Key]
    [Required]
    public Guid Id { get; set; }

    [Required]
    public required string Name { get; set; }
}
