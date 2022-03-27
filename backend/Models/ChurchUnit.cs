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
            new { Parent = "top", Color = "var(--grey-20)" }
          },
          {
            "Elders Quorum",
            new { Parent = "Ward", Color = "var(--purple-mountain-majesty)" }
          },
          {
            "Young Men",
            new { Parent = "Ward", Color = "var(--cornflower)" }
          },
          {
            "Priests Quorum",
            new { Parent = "Young Men", Color = "var(--soft-blue)"
          } },
          {
            "Teachers Quorum",
            new { Parent = "Young Men", Color = "var(--cornflower-blue)" }
          },
          {
            "Deacons Quorum",
            new { Parent = "Young Men", Color = "var(--blue-curacao)" }
          },
          {
            "Relief Society",
            new { Parent = "Ward", Color = "var(--rogue-pink)" }
          },
          {
            "Young Women",
            new { Parent = "Ward", Color = "var(--old-geranium)" }
          },
          {
            "16-17 Year-old Young Women",
            new { Parent = "Young Women", Color = "var(--tiger-lilly)" }
          },
          {
            "14-15 Year-old Young Women",
            new { Parent = "Young Women", Color = "var(--porcelain-rose)" }
          },
          {
            "12-13 Year-old Young Women",
            new { Parent = "Young Women", Color = "var(--brewed-mustard)" }
          },
          {
            "Primary",
            new { Parent = "Ward", Color = "var(--rosy-highlight)" }
          },
        };
    }
  }

  public struct OrgDetails
  {
    public string? Parent { get; set; }
    public string? Color { get; set; }
  }
}
