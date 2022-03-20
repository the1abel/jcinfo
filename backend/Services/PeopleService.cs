using backend.Models;
using MongoDB.Driver;

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

    public async Task<Person?> GetByEmailAsync(string email) =>
        await _peopleCollection.Find(x => x.Email.Equals(email)).FirstOrDefaultAsync();

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

    // public async Task UpdateAsync(string id, Person updatedPerson) =>
    //     await _peopleCollection.ReplaceOneAsync(x => x.Id == id, updatedPerson);

    // public async Task RemoveAsync(string id) =>
    //     await _peopleCollection.DeleteOneAsync(x => x.Id == id);
  }
}
