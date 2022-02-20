using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class Person
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
  }
}
