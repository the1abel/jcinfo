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
    public Dictionary<string, string>? Organizations { get; set; }

    public void SetOrganizationsWithDefaults() => Organizations = GetDefaultOrganizations();

    public static Dictionary<string, string> GetDefaultOrganizations()
    {
      return new Dictionary<string, string>
        {
          { "Elders Quorum", "top" },
          { "Relief Society", "top" },
          { "Young Men", "top" },
          { "Deasons Quorum", "Young Men" },
          { "Teachers Quorum", "Young Men" },
          { "Priests Quorum", "Young Men" },
          { "Young Women", "top" },
          { "12-13 Years Old", "Young Women" },
          { "14-15 Years Old", "Young Women" },
          { "16-17 Years Old", "Young Women" },
          { "Primary", "top" },
        };
    }
  }
}
