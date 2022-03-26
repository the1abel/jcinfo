using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class Event
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? ChurchUnitUrlName { get; set; }
    public string? Title { get; set; }
    public Boolean? IsForMembersOnly { get; set; } = false;
    public string[] Orgs { get; set; }
    public string? Type { get; set; } // Event or Announcement
    public string? CreatedBy { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? CreatedAt { get; set; }
    public Boolean? DoDisplayTime { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Start { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Finish { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? Expiration { get; set; } // if (Type == "Event") Expiration = Finish
    public string? PublicDescription { get; set; }
    public string? MembersOnlyDescription { get; set; }
    public string? Location { get; set; }
  }
}
