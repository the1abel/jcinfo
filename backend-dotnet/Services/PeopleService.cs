using backend.Models;
using MongoDB.Driver;
using System.Text.Json;

namespace backend.Services
{
  public class PeopleService
  {
    private readonly IMongoCollection<Person> _peopleCollection;

    public PeopleService(DbConnectionService db)
    {
      _peopleCollection = db.GetConnection().GetCollection<Person>("people");
    }

    // public async Task<List<Person>> GetAsync() =>
    //     await _peopleCollection.Find(_ => true).ToListAsync();

    // public async Task<Person?> GetAsync(string id) =>
    //     await _peopleCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<Person?> GetByEmailAsync(string? email) =>
        await _peopleCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

    public async Task<String?> CreateAsync(Person newPerson)
    {
      try
      {
        await _peopleCollection.InsertOneAsync(newPerson);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        if (ex.Message.Contains("DuplicateKey"))
        {
          return "ErrorDuplicate";
        }
        else
        {
          return "Error";
        }
      }
      return newPerson.Id;
    }

    public async Task<string> AddOrUpdatePermissionAsync(HttpContext httpContext,
        string emailToUpdate, string churchUnitUrlName, string org, string newPermission)
    {
      string? requester = httpContext.Session.GetString("personEmail");
      if (requester is null)
      {
        return "ErrorNotLoggedIn";
      }

      string field = $"Permissions.{churchUnitUrlName}.{org}";

      // verify requester has adequate permissions
      bool requesterHasAdequatePermissions = false;
      string? permissionsStr = httpContext.Session.GetString("personPermissions");

      try
      {

        #pragma warning disable CS8604 // Possible null reference argument.
        var submitterPermissions = JsonSerializer
          .Deserialize<Dictionary<string, Dictionary<string, string>>>(permissionsStr);
        #pragma warning restore CS8604 // Possible null reference argument.

        #pragma warning disable CS8602 // Dereference of a possibly null reference.
        if (submitterPermissions[churchUnitUrlName]["all"] == "admin" ||
              submitterPermissions[churchUnitUrlName][org] == "admin")
        #pragma warning restore CS8602 // Dereference of a possibly null reference.
        {
          requesterHasAdequatePermissions = true;
        }
      }
      catch
      {
        requesterHasAdequatePermissions = false;
      }

      // avoid NoSQL injection and invalid permission
      if (!Utils.isNosqlInjectionFree(field) ||
          !requesterHasAdequatePermissions ||
          !Person.VALID_PERMISSIONS.Contains(newPermission))
      {

        string errMsg =
          " [WARNING] " + requester + " made an invalid attempt to set permission for" +
          $" {emailToUpdate} to {field} = {newPermission} .  " +
          requester + " has the following permissions: " + permissionsStr;

        Console.WriteLine(DateTime.Now + errMsg);
        return "ErrorInvalidPermissions";
      }

      // set permissions
      var update = Builders<Person>.Update.Set(field, newPermission);

      var options = new FindOneAndUpdateOptions<Person, Person>
          { ReturnDocument = ReturnDocument.After };

      Person person =
        await _peopleCollection.FindOneAndUpdateAsync(x => x.Email == emailToUpdate, update);

      if (person is null)
      {
        return "ErrorInvalidEmailAddress";
      }

      string successMsg =
        " [INFO] " + httpContext.Session.GetString("personEmail") +
        $" set permission for {emailToUpdate} to {field} = {newPermission}";

      Console.WriteLine(DateTime.Now + successMsg);

      string newPermissionsStr = JsonSerializer.Serialize(person.Permissions);

      if (emailToUpdate == httpContext.Session.GetString("personEmail"))
      {
        httpContext.Session.SetString("personPermissions", newPermissionsStr);
      }

      return newPermissionsStr;
    }

    // public async Task UpdateAsync(string id, Person updatedPerson) =>
    //     await _peopleCollection.ReplaceOneAsync(x => x.Id == id, updatedPerson);

    // public async Task RemoveAsync(string id) =>
    //     await _peopleCollection.DeleteOneAsync(x => x.Id == id);
  }
}
