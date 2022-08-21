using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class Event
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Headline { get; set; }
    public bool? IsForMembersOnly { get; set; } = false;
    public string[]? Orgs { get; set; }
    public bool? IsAnnouncement { get; set; } = false;
    public bool? DoDisplayTime { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Start { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Finish { get; set; }
    public string? PublicDescription { get; set; }
    public string? MembersOnlyDescription { get; set; }
    public string? Location { get; set; }

    public string? CreatedBy { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? CreatedAt { get; set; }
    public string? LastUpdatedBy { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? LastUpdatedAt { get; set; }
  }
}
