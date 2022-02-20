using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class ChurchUnit
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Name { get; set; }
    public string UrlName { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string AdministratorId { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string[]? MemberIds { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string[]? EditorIds { get; set; }
    public Organization[]? Organizations { get; set; }
  }

  public struct Organization
  {
    public string Name { get; set; }
    public string UrlName { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string[] EditorIds { get; set; }
  }
}
