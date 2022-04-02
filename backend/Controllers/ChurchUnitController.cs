using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
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

    private string ConvertToUrlName(string? name)
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

    // TODO move URL parameter to URL segment
    // GET: api/ChurchUnit/IsUniqueName?name=...
    [HttpGet("IsUniqueName")]
    public async Task<IActionResult> IsUniqueName(string? name)
    {
      string urlName = ConvertToUrlName(name);
      if (string.IsNullOrWhiteSpace(urlName))
      {
        return Ok(new { result = true, urlName = urlName });
      }

      // TODO modify service to use projection to only return the urlName (or null)
      ChurchUnit? dbResChurchUnit = await _churchUnitsService.GetByUrlNameAsync(urlName);

      Boolean isUniqueUrlName = dbResChurchUnit is null;

      return Ok(new { result = isUniqueUrlName, urlName = urlName });
    }

    // TODO move URL parameter to URL segment
    // TODO modify service to use projection to return an array of only the urlName & Name
    // GET: api/ChurchUnit/Find?searchString=...
    [HttpGet("Find")]
    public async Task<IActionResult> Find(string? searchString)
    {
      if (!string.IsNullOrWhiteSpace(searchString))
      {
        return Ok(await _churchUnitsService.GetByUrlNameAsync(searchString));
      }
      else
      {
        return BadRequest(new { result = "error" });
      }
    }

    // GET: api/ChurchUnit/{urlName}/{includePastEvents}
    [HttpGet("{urlName}/{includePastEvents}")]
    public async Task<IActionResult> Get(string? urlName, bool? includePastEvents)
    {
      if (!string.IsNullOrWhiteSpace(urlName))
      {
        return Ok(await _churchUnitsService.GetByUrlNameAsync(urlName, includePastEvents));
      }
      else
      {
        return BadRequest(new { result = "error" });
      }
    }

    // POST api/ChurchUnit/Create
    [HttpPost("Create")]
    public async Task<IActionResult> Create(ChurchUnit newChurchUnit)
    {
      if (string.IsNullOrWhiteSpace(newChurchUnit.Name) ||
          newChurchUnit.Name.Length < 3)
      {
        return BadRequest(new { result = "error" });
      }

      newChurchUnit.UrlName = ConvertToUrlName(newChurchUnit.Name);
      newChurchUnit.SetOrgsWithDefaults();

      string? newChurchUnitOrErr = await _churchUnitsService.CreateAsync(newChurchUnit);

      if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Length == 24)
      {
        _ = _peopleService
          .AddOrUpdatePermissionAsync(HttpContext, newChurchUnit.UrlName, "all", "admin");

        return CreatedAtAction(nameof(Find), new { urlName = newChurchUnit.UrlName },
            new { result = "success", urlName = newChurchUnit.UrlName });
      }
      else if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Equals("duplicate"))
      {
        return BadRequest(new { result = "duplicate" });
      }
      else
      {
        return BadRequest(new { result = "error" });
      }
    }

    // POST api/ChurchUnit/{urlName}/Event
    [HttpPost("{urlName}/Event")]
    public async Task<IActionResult> CreateEvent(string urlName, Event newEvent)
    {
      if (string.IsNullOrWhiteSpace(newEvent.Finish.ToString()))
      {
        return BadRequest(new { result = "error" });
      }

      string? newChurchUnitOrErr =
        await _churchUnitsService.CreateEventAsync(urlName, newEvent);

      if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Length == 24)
      {
        return CreatedAtAction(nameof(Find), new { urlName = newEvent.Id },
            new { result = "success", urlName = newEvent.Id });
      }
      else
      {
        return BadRequest(new { result = "error" });
      }
    }

    // PUT api/ChurchUnit/{urlName}/Event
    [HttpPut("{urlName}/Event")]
    public async Task<IActionResult> UpdateEvent(string urlName, Event eventToUpdate)
    {
      if (string.IsNullOrWhiteSpace(eventToUpdate.Finish.ToString()))
      {
        return BadRequest(new { result = "error" });
      }

      string? newChurchUnitOrErr =
        await _churchUnitsService.UpdateEventAsync(urlName, eventToUpdate);

      if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Length == 24)
      {
        return CreatedAtAction(nameof(Find), new { urlName = eventToUpdate.Id },
            new { result = "success", urlName = eventToUpdate.Id });
      }
      else
      {
        return BadRequest(new { result = "error" });
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
