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
          return "duplicate";
        }
        else
        {
          return "error";
        }
      }
      return newPerson.Id;
    }

    public async Task AddPermissionAsync(HttpContext httpContext, string churchUnitUrlName,
      string organization, string newPermission)
    {
      string? id = httpContext.Session.GetString("personId");
      string? currentPermissionsStr = httpContext.Session.GetString("permissions");
      Console.WriteLine("in AddPermissionAsync with personId: " + id + " currentPermissionsStr: " + currentPermissionsStr); // DEBUG

      Dictionary<string, Dictionary<string, string>>? permissions = null;

      if (currentPermissionsStr is not null)
      {
        permissions = JsonSerializer.Deserialize
          <Dictionary<string, Dictionary<string, string>>>(currentPermissionsStr);

        if (permissions is not null && permissions.ContainsKey(churchUnitUrlName))
        {
          permissions[churchUnitUrlName][organization] = newPermission;
        }
        else if (permissions is not null)
        {
          permissions[churchUnitUrlName] = new Dictionary<string, string>
          {
            { organization, newPermission }
          };
        }
      }
      else
      {
        permissions = new Dictionary<string, Dictionary<string, string>>
        {
          {
            churchUnitUrlName,
            new Dictionary<string, string> { {organization, newPermission } }
          }
        };
      }

      httpContext.Session.SetString("permissions", JsonSerializer.Serialize(permissions));

      UpdateDefinition<Person>? update =
        Builders<Person>.Update.Set("Permissions", permissions);

      await _peopleCollection.UpdateOneAsync(x => x.Id == id, update);
    }

    // public async Task UpdateAsync(string id, Person updatedPerson) =>
    //     await _peopleCollection.ReplaceOneAsync(x => x.Id == id, updatedPerson);

    // public async Task RemoveAsync(string id) =>
    //     await _peopleCollection.DeleteOneAsync(x => x.Id == id);
  }
}
