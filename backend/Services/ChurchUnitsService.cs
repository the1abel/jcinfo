using backend.Models;
using MongoDB.Driver;

namespace backend.Services
{
  public class ChurchUnitsService
  {
    private readonly IMongoCollection<ChurchUnit> _churchUnitCollection;

    public ChurchUnitsService(DbConnectionService db)
    {
      _churchUnitCollection = db.GetConnection().GetCollection<ChurchUnit>("churchUnits");
    }

    // public async Task<List<ChurchUnit>> GetAsync() =>
    //     await _churchUnitCollection.Find(_ => true).ToListAsync();

    // public async Task<ChurchUnit?> GetAsync(string id) =>
    //     await _churchUnitCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<ChurchUnit?> GetByUrlNameAsync(string urlName) =>
        await _churchUnitCollection
          .Find(x => x.UrlName.Equals(urlName)).FirstOrDefaultAsync();

    // public async Task<List<ChurchUnit>?> FindAsync(string searchString)
    // {
    //   // await _churchUnitCollection.Find(x =>
    //   //     x.UrlName.Contains(searchString) || x.Name.Contains(searchString)).ToListAsync();

    //   FilterDefinition<ChurchUnit>? condition = Builders<ChurchUnit>.Filter
    //     .Regex("UrlName", new BsonRegularExpression(searchString));

    //   ProjectionDefinition<ChurchUnit>? fields =
    //     Builders<ChurchUnit>.Projection.Include(c => c.UrlName);

    //   return await _churchUnitCollection.Find(condition).Project<ChurchUnit>(fields)
    //     .ToListAsync();
    // }

    public async Task<String?> CreateAsync(ChurchUnit newChurchUnit)
    {
      try
      {
        await _churchUnitCollection.InsertOneAsync(newChurchUnit);
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
      return newChurchUnit.Id;
    }

    // public async Task UpdateAsync(string id, ChurchUnit updatedChurchUnit) =>
    //     await _churchUnitCollection.ReplaceOneAsync(x => x.Id == id, updatedChurchUnit);

    // public async Task RemoveAsync(string id) =>
    //     await _churchUnitCollection.DeleteOneAsync(x => x.Id == id);
  }
}
