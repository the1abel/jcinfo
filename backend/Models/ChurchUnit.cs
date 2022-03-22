using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class ChurchUnit
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? Name { get; set; } // Friendly Name
    public string? UrlName { get; set; }
    public Dictionary<string, Organization>? Organizations { get; set; }
  }

  public struct Organization
  {
    public string Name { get; set; } // Friendly Name
    public string? ParentOrganization { get; set; } // e.g., YM is parent of Deacons Quorum
  }
}
