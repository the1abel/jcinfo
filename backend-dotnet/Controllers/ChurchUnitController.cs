using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Web;
using UnidecodeSharpFork;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ChurchUnitController : ControllerBase
  {
    private readonly ChurchUnitsService _churchUnitsService;
    private readonly PeopleService _peopleService;

    public ChurchUnitController(
        ChurchUnitsService churchUnitsService, PeopleService peopleService)
    {
      _churchUnitsService = churchUnitsService;
      _peopleService = peopleService;
    }

    private static string ConvertToUrlName(string? name)
    {
      if (string.IsNullOrWhiteSpace(name))
      {
        return String.Empty;
      }

      name = HttpUtility.UrlDecode(name);
      name = name.Unidecode();
      name = Regex.Replace(name, @"[^-._~0-9A-Za-z]+", "");
      return name.ToLowerInvariant();
    }

    // GET: api/ChurchUnit/IsUniqueName?name=...
    [HttpGet("IsUniqueName/{name}")]
    public async Task<IActionResult> IsUniqueName(string? name)
    {
      string urlName = ConvertToUrlName(name);
      if (string.IsNullOrWhiteSpace(urlName))
      {
        return Ok(new { result = "ErrorInvalidName", urlName = urlName });
      }

      bool isUniqueUrlName = await _churchUnitsService.IsUniqueName(urlName);

      return Ok(new { result = isUniqueUrlName, urlName = urlName });
    }

    // TODO modify service to use projection to return an array of only the urlName & Name
    // GET: api/ChurchUnit/Find/{searchString}
    [HttpGet("Find/{searchString}")]
    public async Task<IActionResult> Find(string? searchString)
    {
      if (!string.IsNullOrWhiteSpace(searchString))
      {
        return Ok(await _churchUnitsService.GetByUrlNameAsync(searchString));
      }
      else
      {
        return BadRequest(new { result = "Error" });
      }
    }

    // GET: api/ChurchUnit/{urlName}?past=true|any
    [HttpGet("{urlName}")]
    public async Task<IActionResult> Get(string? urlName, string? past)
    {
      urlName = ConvertToUrlName(urlName);
      bool includePastEvents = past == "true";

      if (!string.IsNullOrWhiteSpace(urlName))
      {
        return Ok(await _churchUnitsService.GetByUrlNameAsync(urlName, includePastEvents));
      }
      else
      {
        return BadRequest(new { result = "Error" });
      }
    }

    // POST api/ChurchUnit/Create
    [HttpPost("Create")]
    public async Task<IActionResult> Create(ChurchUnit newChurchUnit)
    {
      string? email = HttpContext.Session.GetString("personEmail");

      if (email is null ||
          string.IsNullOrWhiteSpace(newChurchUnit.Name) ||
          newChurchUnit.Name.Length < 3 ||
          !Utils.isNosqlInjectionFree(newChurchUnit.Name))
      {
        return BadRequest(new { result = "Error1" });
      }

      newChurchUnit.UrlName = ConvertToUrlName(newChurchUnit.Name);

      string? newChurchUnitIdOrErr = await _churchUnitsService.CreateAsync(newChurchUnit);

      if (newChurchUnitIdOrErr is not null && newChurchUnitIdOrErr.Length == 24)
      {

        // give admin permission to person in the Session so that
        //     _peopleService.AddOrUpdatePermissionAsync will allow permissions to be set
        //     in the database
        string? permissionsStr = HttpContext.Session.GetString("personPermissions");
        #pragma warning disable CS8604 // Possible null reference argument.
        var permissions = JsonSerializer
          .Deserialize<Dictionary<string, Dictionary<string, string>>>(permissionsStr);
        #pragma warning restore CS8604 // Possible null reference argument.

        #pragma warning disable CS8602 // Dereference of a possibly null reference.
        permissions[newChurchUnit.UrlName] = new Dictionary<string, string>
        {
          { "all", "admin" },
        };
        #pragma warning restore CS8602 // Dereference of a possibly null reference.
        HttpContext.Session.SetString(
            "personPermissions", JsonSerializer.Serialize(permissions));

        var newPermissionsStrOrErr = await _peopleService.AddOrUpdatePermissionAsync(
            HttpContext, email, newChurchUnit.UrlName, "all", "admin");
        Match matchError =
            Regex.Match(newPermissionsStrOrErr, @"^Error", RegexOptions.IgnoreCase);

        if (!matchError.Success)
        {
          return Ok(new { result = "Success", urlName = newChurchUnit.UrlName });
        }
        else
        {
          return BadRequest(new { result = "Error2" });
        }
      }
      else if (newChurchUnitIdOrErr is not null &&
          newChurchUnitIdOrErr.Equals("ErrorDuplicate"))
      {
        return BadRequest(new { result = "ErrorDuplicate" });
      }

      return BadRequest(new { result = "Error3" });
    }

    // POST api/ChurchUnit/{urlName}/Event
    [HttpPost("{urlName}/Event")]
    public async Task<IActionResult> CreateEvent(string urlName, Event newEvent)
    {
      if (string.IsNullOrWhiteSpace(newEvent.Start.ToString()) ||
          string.IsNullOrWhiteSpace(newEvent.Finish.ToString()))
      {
        return BadRequest(new { result = "Error" });
      }

      string? newChurchUnitOrErr =
        await _churchUnitsService.CreateEventAsync(HttpContext, urlName, newEvent);

      if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Length == 24)
      {
        return Ok(new { result = "Success", id = newEvent.Id });
      }
      else
      {
        return BadRequest(new { result = "Error" });
      }
    }

    // PUT api/ChurchUnit/{urlName}/Event
    [HttpPut("{urlName}/Event")]
    public async Task<IActionResult> UpdateEvent(string urlName, Event eventToUpdate)
    {
      if (string.IsNullOrWhiteSpace(eventToUpdate.Start.ToString()) ||
          string.IsNullOrWhiteSpace(eventToUpdate.Finish.ToString()))
      {
        return BadRequest(new { result = "Error" });
      }

      string? newChurchUnitOrErr =
        await _churchUnitsService.UpdateEventAsync(HttpContext, urlName, eventToUpdate);

      if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Length == 24)
      {
        return Ok(new { result = "Success", id = eventToUpdate.Id });
      }
      else
      {
        return BadRequest(new { result = "Error" });
      }
    }


    //// PUT api/ChurchUnit/name
    //[HttpPut("{name}")]
    //public void Put(int name, [FromBody] string value)
    //{
    //}

    //// DELETE api/ChurchUnit/name
    //[HttpDelete("{name}")]
    //public void Delete(int name)
    //{
    //}
  }
}
