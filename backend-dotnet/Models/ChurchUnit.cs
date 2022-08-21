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
    public string? ParentChurchUnitUrlName { get; set; }
    public List<Event>? Events { get; set; }
    // TODO determine if serializing/deserializing to a `struct` (OrgDetails) is more
    // performant than to `dynamic`, and if so figure out the syntax/attribute (decorator)
    public Dictionary<string, dynamic>? Orgs { get; set; }

    public void SetOrgsWithDefaults() => Orgs = GetDefaultOrgs();

    public static Dictionary<string, dynamic> GetDefaultOrgs()
    {
      // TODO consider possibly abstracting this to a database record
      return new Dictionary<string, dynamic>
        {
          {
            "Ward",
            new { Parent = "top", Color = "var(--grey-20)" , Order = 1 }
          },
          {
            "Relief Society",
            new { Parent = "Ward", Color = "var(--rogue-pink)" , Order = 2 }
          },
          {
            "Elders Quorum",
            new { Parent = "Ward", Color = "var(--purple-mountain-majesty)" , Order = 3 }
          },
          {
            "Young Men",
            new { Parent = "Ward", Color = "var(--cornflower)" , Order = 4 }
          },
          {
            "Priests Quorum",
            new { Parent = "Young Men", Color = "var(--soft-blue)", Order = 5 }
          },
          {
            "Teachers Quorum",
            new { Parent = "Young Men", Color = "var(--cornflower-blue)" , Order = 6 }
          },
          {
            "Deacons Quorum",
            new { Parent = "Young Men", Color = "var(--blue-curacao)" , Order = 7 }
          },
          {
            "Young Women",
            new { Parent = "Ward", Color = "var(--old-geranium)" , Order = 8 }
          },
          {
            "16-17 Year-old Young Women",
            new { Parent = "Young Women", Color = "var(--tiger-lilly)" , Order = 9 }
          },
          {
            "14-15 Year-old Young Women",
            new { Parent = "Young Women", Color = "var(--porcelain-rose)" , Order = 10 }
          },
          {
            "12-13 Year-old Young Women",
            new { Parent = "Young Women", Color = "var(--brewed-mustard)" , Order = 11 }
          },
          {
            "Primary",
            new { Parent = "Ward", Color = "var(--rosy-highlight)" , Order = 12 }
          },
        };
    }
  }

  public struct OrgDetails
  {
    public string? Parent { get; set; }
    public string? Color { get; set; }
    public int? Order { get; set; }
  }
}
