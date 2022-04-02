using backend.Models;
using MongoDB.Bson;
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


    // TODO filter to only get events newer than a year, or older based on variable from admin
    public async Task<ChurchUnit?> GetByUrlNameAsync(
        string urlName, bool? includePastEvents = false)
    {
      DateTime yesterday = DateTime.Today.AddDays(-1);

      var filterUrlName = Builders<ChurchUnit>.Filter.Where(x => x.UrlName == urlName);

      var filter =
        includePastEvents == true ?
        filterUrlName :
        Builders<ChurchUnit>.Filter.And(
          filterUrlName,
          Builders<ChurchUnit>.Filter.ElemMatch(x => x.Events, e => e.Finish > yesterday)
        );

      return await _churchUnitCollection.Find(filter).FirstOrDefaultAsync();
    }


    // public async Task<List<ChurchUnit>?> FindAsync(string searchString)
    // {
    //   // await _churchUnitCollection.Find(x =>
    //   //     x.UrlName.Contains(searchString) || x.Name.Contains(searchString)).ToListAsync();
    //
    //   FilterDefinition<ChurchUnit>? condition = Builders<ChurchUnit>.Filter
    //     .Regex("UrlName", new BsonRegularExpression(searchString));
    //
    //   ProjectionDefinition<ChurchUnit>? fields =
    //     Builders<ChurchUnit>.Projection.Include(c => c.UrlName);
    //
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


    public async Task<String?> CreateEventAsync(
        HttpContext httpContext, string urlName, Event newEvent)
    {
      newEvent.Id = ObjectId.GenerateNewId().ToString();
      newEvent.CreatedBy = httpContext.Session.GetString("personEmail");
      newEvent.CreatedAt = DateTime.Now;

      var update = Builders<ChurchUnit>.Update.Push<Event>(x => x.Events, newEvent);

      try
      {
        await _churchUnitCollection.FindOneAndUpdateAsync(x => x.UrlName == urlName, update);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        return "error";
      }
      return newEvent.Id;
    }


    public async Task<String?> UpdateEventAsync(
        HttpContext httpContext, string urlName, Event eventToUdate)
    {
      eventToUdate.LastUpdatedBy = httpContext.Session.GetString("personId");
      eventToUdate.LastUpdatedAt = DateTime.Now;

      var filter = Builders<ChurchUnit>.Filter.And(
        Builders<ChurchUnit>.Filter.Where(x => x.UrlName == urlName),
        Builders<ChurchUnit>.Filter.ElemMatch(x => x.Events, e => e.Id == eventToUdate.Id)
      );

      var update = Builders<ChurchUnit>.Update.Push<Event>(x => x.Events, eventToUdate);

      try
      {
        await _churchUnitCollection.UpdateOneAsync(x => x.UrlName == urlName, update);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        return "error";
      }
      return eventToUdate.Id;
    }


    // public async Task UpdateAsync(string id, ChurchUnit updatedChurchUnit) =>
    //     await _churchUnitCollection.ReplaceOneAsync(x => x.Id == id, updatedChurchUnit);

    // public async Task RemoveAsync(string id) =>
    //     await _churchUnitCollection.DeleteOneAsync(x => x.Id == id);
  }
}
