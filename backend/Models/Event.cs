using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class Event
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ChurchUnit { get; set; }
    public string? Organization { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Start { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Finish { get; set; }
    public string? Description { get; set; }
  }
}
