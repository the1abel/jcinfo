using MongoDB.Driver;

namespace backend.Services
{
  /// <summary>
  /// Implemented as singleton class to create a database connection pool.
  /// </summary>
  public class DbConnectionService
  {
    private readonly IMongoDatabase _mongoDatabase;

    public DbConnectionService()
    {
      string? connString = Environment.GetEnvironmentVariable("JCINFO_MONGO");
      MongoClient? mongoClient = new MongoClient(connString);
      _mongoDatabase = mongoClient.GetDatabase("jcinfo");
    }

    public IMongoDatabase GetConnection() => _mongoDatabase;
  }
}
