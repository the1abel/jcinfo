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
    public Dictionary<string, OrgDetails>? Orgs { get; set; }

    public void SetOrgsWithDefaults() => Orgs = GetDefaultOrgs();

    public static Dictionary<string, OrgDetails> GetDefaultOrgs()
    {
      // TODO consider possibly abstracting this to a database record
      return new Dictionary<string, OrgDetails>
        {
          {
            "Ward",
            new OrgDetails { Parent = "top", Color = "var(--grey-20)" }
          },
          {
            "Elders Quorum",
            new OrgDetails { Parent = "Ward", Color = "var(--purple-mountain-majesty)" }
          },
          {
            "Young Men",
            new OrgDetails { Parent = "Ward", Color = "var(--cornflower)" }
          },
          {
            "Priests Quorum",
            new OrgDetails { Parent = "Young Men", Color = "var(--soft-blue)"
          } },
          {
            "Teachers Quorum",
            new OrgDetails { Parent = "Young Men", Color = "var(--cornflower-blue)" }
          },
          {
            "Deacons Quorum",
            new OrgDetails { Parent = "Young Men", Color = "var(--blue-curacao)" }
          },
          {
            "Relief Society",
            new OrgDetails { Parent = "Ward", Color = "var(--rogue-pink)" }
          },
          {
            "Young Women",
            new OrgDetails { Parent = "Ward", Color = "var(--old-geranium)" }
          },
          {
            "16-17 Years Old",
            new OrgDetails { Parent = "Young Women", Color = "var(--tiger-lilly)" }
          },
          {
            "14-15 Years Old",
            new OrgDetails { Parent = "Young Women", Color = "var(--porcelain-rose)" }
          },
          {
            "12-13 Years Old",
            new OrgDetails { Parent = "Young Women", Color = "var(--brewed-mustard)" }
          },
          {
            "Primary",
            new OrgDetails { Parent = "Ward", Color = "var(--rosy-highlight)" }
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
