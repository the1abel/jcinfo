using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class Person
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    // churchUnitUrlName.organization.permission -> enum: viewPrivate, edit, admin
    // organization may include "all" (e.g., for ward leaders)
    public Dictionary<string, Dictionary<string, string>>? Permissions { get; set; }
  }
}
