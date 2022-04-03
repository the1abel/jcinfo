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


    public async Task<bool> IsUniqueName(string urlName)
    {
      var projection = Builders<ChurchUnit>.Projection.Include(x => x.Id);

      var id = await _churchUnitCollection
        .Find(x => x.UrlName == urlName)
        .Project(projection)
        .FirstOrDefaultAsync();

      return id is null;
    }


    public async Task<ChurchUnit?> GetByUrlNameAsync(
        string urlName, bool includePastEvents = false)
    {

      var filterUrlName = Builders<ChurchUnit>.Filter.Where(x => x.UrlName == urlName);

      // TODO figure out how to filter events by date
      // var yesterday = DateTime.Today.AddDays(-1);
      //
      //var filter =
      //  includePastEvents ?
      //  filterUrlName :
      //  Builders<ChurchUnit>.Filter.And(
      //    filterUrlName,
      //    Builders<ChurchUnit>.Filter.Or(
      //      Builders<ChurchUnit>.Filter.ElemMatch(x => x.Events, e => e.Finish > yesterday),
      //      Builders<ChurchUnit>.Filter.Where(x => x.Events == null)
      //    )
      //  );

      return await _churchUnitCollection.Find(filterUrlName).FirstOrDefaultAsync();
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
      newEvent = SetStartAndFinishDates(newEvent);

      var update = Builders<ChurchUnit>.Update.Push<Event>(x => x.Events, newEvent);

      try
      {
        await _churchUnitCollection.UpdateOneAsync(x => x.UrlName == urlName, update);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        return "error";
      }
      return newEvent.Id;
    }


    public async Task<String?> UpdateEventAsync(
        HttpContext httpContext, string urlName, Event eventToUpdate)
    {
      eventToUpdate.LastUpdatedBy = httpContext.Session.GetString("personId");
      eventToUpdate.LastUpdatedAt = DateTime.Now;
      eventToUpdate = SetStartAndFinishDates(eventToUpdate);

      var filter = Builders<ChurchUnit>.Filter.And(
        Builders<ChurchUnit>.Filter.Where(x => x.UrlName == urlName),
        Builders<ChurchUnit>.Filter.ElemMatch(x => x.Events, e => e.Id == eventToUpdate.Id)
      );

      var update = Builders<ChurchUnit>.Update.Push<Event>(x => x.Events, eventToUpdate);

      // ChurchUnit.Events.Start
      try
      {
        await _churchUnitCollection
          .UpdateOneAsync(x => x.UrlName == urlName, update);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        return "error";
      }
      return eventToUpdate.Id;
    }


    private static Event SetStartAndFinishDates(Event e)
    {
      if (e.Start is null && e.Finish is not null)
      {
        e.Start = e.Finish;
      }
      else if (e.Finish is null && e.Start is not null)
      {
        e.Finish = e.Start;
      }
      else if (e.Start is null && e.Finish is null)
      {
        e.Start = DateTime.Now.AddDays(7);
        e.Finish = DateTime.Now.AddDays(7).AddHours(1);
      }

      return e;
    }

    // public async Task UpdateAsync(string id, ChurchUnit updatedChurchUnit) =>
    //     await _churchUnitCollection.ReplaceOneAsync(x => x.Id == id, updatedChurchUnit);

    // public async Task RemoveAsync(string id) =>
    //     await _churchUnitCollection.DeleteOneAsync(x => x.Id == id);
  }
}
