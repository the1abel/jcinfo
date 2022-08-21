using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace backend.Models
{
  public struct PermissionSet
  {
    public string Email { get; set; }
    public string ChurchUnitUrlName { get; set; }
    public string Org { get; set; }
    public string Permission { get; set; }
  }

  public class Person
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    // churchUnitUrlName.org.permission -> enum: viewPrivate, edit, admin
    // org may include "all" (e.g., for ward leaders)
    public Dictionary<string, Dictionary<string, string>> Permissions { get; set; } =
      new Dictionary<string, Dictionary<string, string>>();

    public static readonly string?[] VALID_PERMISSIONS = {
      null,
      "",
      "viewPublic",
      "viewPrivate",
      "edit",
      "admin",
    };

    /// <summary>
    ///
    /// </summary>
    /// <param name="httpContext"></param>
    /// <returns></returns>
    //public Dictionary<string, Dictionary<string, string>> SetPermissions(
    //  HttpContext httpContext)
    //{
    //  string? permissionsStr = httpContext.Session.GetString("personPermissions");
    //  if (permissionsStr is not null)
    //  {
    //    #pragma warning disable CS8601 // Possible null reference assignment.
    //    Permissions = JsonSerializer.Deserialize
    //      <Dictionary<string, Dictionary<string, string>>>(permissionsStr);
    //    #pragma warning restore CS8601 // Possible null reference assignment.
    //  }

    //  if (Permissions is null)
    //  {
    //    Permissions = new Dictionary<string, Dictionary<string, string>>();
    //  }

    //  return Permissions;
    //}


    /// <summary>
    /// Add or Update Permissions.  Pass an empty string to remove a permission.
    /// </summary>
    /// <param name="churchUnitUrlName"></param>
    /// <param name="org"></param>
    /// <param name="newPermission"></param>
    /// <returns></returns>
    //public Dictionary<string, Dictionary<string, string>> AddOrUpdatePermission(
    //  string churchUnitUrlName, string org, string newPermission)
    //{
    //  if (
    //      // invalid PermissionLevel
    //      (!Person.VALID_PERMISSIONS.Contains(newPermission) &&
    //        !string.IsNullOrWhiteSpace(newPermission)
    //      ) ||
    //      // churchUnit wasn't provided
    //      string.IsNullOrWhiteSpace(churchUnitUrlName) ||
    //      // don't have churchUnit to delete
    //      (!Permissions.ContainsKey(churchUnitUrlName) &&
    //        (string.IsNullOrWhiteSpace(org) ||
    //          string.IsNullOrWhiteSpace(newPermission))
    //      ) ||
    //      // don't have org to delete
    //      (Permissions.ContainsKey(churchUnitUrlName) &&
    //        !Permissions[churchUnitUrlName].ContainsKey(org) &&
    //        string.IsNullOrWhiteSpace(newPermission))
    //  )
    //  {
    //    return Permissions;
    //  }

    //  if (Permissions.ContainsKey(churchUnitUrlName)
    //      && string.IsNullOrWhiteSpace(org)) // intentinally missing org
    //  {
    //    // remove churchUnit
    //    Permissions.Remove(churchUnitUrlName);
    //  }
    //  else if (Permissions.ContainsKey(churchUnitUrlName)
    //      && Permissions[churchUnitUrlName].ContainsKey(org)
    //      && string.IsNullOrWhiteSpace(newPermission)) // intentionally missing permission
    //  {
    //    // remove org
    //    Permissions[churchUnitUrlName].Remove(org);
    //    if (Permissions[churchUnitUrlName].Count == 0)
    //      Permissions.Remove(churchUnitUrlName);
    //  }
    //  else if (Permissions.ContainsKey(churchUnitUrlName))
    //  {
    //    // new org and/or permission
    //    Permissions[churchUnitUrlName][org] = newPermission;
    //  }
    //  else
    //  {
    //    // new churchUnit
    //    Permissions[churchUnitUrlName] = new Dictionary<string, string>
    //    {
    //      { org, newPermission }
    //    };
    //  }

    //  return Permissions;
    //}


    /// <summary>
    /// Add or Update Permissions for the current HTTP session user.  Pass an empty
    /// string to remove a permission.
    /// </summary>
    /// <param name="httpContext"></param>
    /// <param name="churchUnitUrlName"></param>
    /// <param name="org"></param>
    /// <param name="newPermission"></param>
    /// <returns></returns>
    //public static Dictionary<string, Dictionary<string, string>> AddOrUpdatePermission(
    //  HttpContext httpContext, string churchUnitUrlName, string org,
    //  string newPermission)
    //{
    //  Person p = new Person();
    //  p.SetPermissions(httpContext);
    //  p.AddOrUpdatePermission(churchUnitUrlName, org, newPermission);

    //  httpContext.Session
    //    .SetString("personPermissions", JsonSerializer.Serialize(p.Permissions));

    //  return p.Permissions;
    //}
  }
}
