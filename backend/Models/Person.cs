using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace backend.Models
{
  public class Person
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    // churchUnitUrlName.organization.permission -> enum: viewPrivate, edit, admin
    // organization may include "all" (e.g., for ward leaders)
    public Dictionary<string, Dictionary<string, string>> Permissions { get; set; } =
      new Dictionary<string, Dictionary<string,string>>();


    /// <summary>
    /// 
    /// </summary>
    /// <param name="httpContext"></param>
    /// <returns></returns>
    public Dictionary<string, Dictionary<string, string>> SetPermissions(
      HttpContext httpContext)
    {
      string? permissionsStr = httpContext.Session.GetString("permissions");
      if (permissionsStr is not null)
      {
        #pragma warning disable CS8601 // Possible null reference assignment.
        Permissions = JsonSerializer.Deserialize
          <Dictionary<string, Dictionary<string, string>>>(permissionsStr);
        #pragma warning restore CS8601 // Possible null reference assignment.
      }
      
      if (Permissions is null)
      {
        Permissions = new Dictionary<string, Dictionary<string, string>>();
      }

      return Permissions;
    }


    /// <summary>
    /// Add or Update Permissions.  Pass an empty string to remove a permission.
    /// </summary>
    /// <param name="churchUnitUrlName"></param>
    /// <param name="organization"></param>
    /// <param name="newPermission"></param>
    /// <returns></returns>
    public Dictionary<string, Dictionary<string, string>> AddOrUpdatePermission(
      string churchUnitUrlName, string organization, string newPermission)
    {
      if (
          // invalid PermissionLevel
          (!Person.PermissionLevels.Contains(newPermission) &&
            !string.IsNullOrWhiteSpace(newPermission)
          ) ||
          // churchUnit wasn't provided
          string.IsNullOrWhiteSpace(churchUnitUrlName) ||
          // don't have churchUnit to delete
          (!Permissions.ContainsKey(churchUnitUrlName) &&
            (string.IsNullOrWhiteSpace(organization) ||
              string.IsNullOrWhiteSpace(newPermission))
          ) ||
          // don't have organization to delete
          (Permissions.ContainsKey(churchUnitUrlName) &&
            !Permissions[churchUnitUrlName].ContainsKey(organization) &&
            string.IsNullOrWhiteSpace(newPermission))
      )
      {
        return Permissions;
      }

      if (Permissions.ContainsKey(churchUnitUrlName)
          && string.IsNullOrWhiteSpace(organization)) // intentinally missing organization
      {
        // remove churchUnit
        Permissions.Remove(churchUnitUrlName);
      }
      else if (Permissions.ContainsKey(churchUnitUrlName)
          && Permissions[churchUnitUrlName].ContainsKey(organization)
          && string.IsNullOrWhiteSpace(newPermission)) // intentionally missing permission
      {
        // remove organization
        Permissions[churchUnitUrlName].Remove(organization);
        if (Permissions[churchUnitUrlName].Count == 0)
          Permissions.Remove(churchUnitUrlName);
      }
      else if (Permissions.ContainsKey(churchUnitUrlName))
      {
        // new organization and/or permission
        Permissions[churchUnitUrlName][organization] = newPermission;
      }
      else
      {
        // new churchUnit
        Permissions[churchUnitUrlName] = new Dictionary<string, string>
        {
          { organization, newPermission }
        };
      }

      return Permissions;
    }


    /// <summary>
    /// Add or Update Permissions.  Pass an empty string to remove a permission.
    /// </summary>
    /// <param name="httpContext"></param>
    /// <param name="churchUnitUrlName"></param>
    /// <param name="organization"></param>
    /// <param name="newPermission"></param>
    /// <returns></returns>
    public static Dictionary<string, Dictionary<string, string>> AddOrUpdatePermission(
      HttpContext httpContext, string churchUnitUrlName, string organization,
      string newPermission)
    {
      Person p = new Person();
      p.SetPermissions(httpContext);
      p.AddOrUpdatePermission(churchUnitUrlName, organization, newPermission);

      httpContext.Session.SetString("permissions", JsonSerializer.Serialize(p.Permissions));

      return p.Permissions;
    }

    // If an invalid permission level is provided, then "viewPublic" should be used instead.
    public static string[] PermissionLevels =
    {
      "admin", "edit", "viewPrivate"
    };
  }
}
