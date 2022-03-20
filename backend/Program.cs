using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<DbConnectionService>();
builder.Services.AddSingleton<PeopleService>();
builder.Services.AddSingleton<ChurchUnitsService>();

// TODO replace with NCache/Redis or possibly MongoDB: https://github.com/MarkCBB/aspnet-mongodb-session-sample#aspnet-core-mongodb-session-sample
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
  options.IdleTimeout = TimeSpan.FromDays(21);
  options.Cookie.Name = "Tag";
  options.Cookie.HttpOnly = true;
  options.Cookie.IsEssential = true;
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseSession(); // must be before Mapcontrollers()

// // custom middleware to require authentication for every path that is not "/"
// app.Use(async (context, next) =>
// {
//   if (context.Request.Path != "/"
//       && string.IsNullOrEmpty(context.Session.GetString("email")))
//   {
//     context.Response.Redirect("/");
//   }
//
//   await next();
// });

app.MapControllers();

app.Run();
