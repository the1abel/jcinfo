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

    [HttpGet("IsUniqueName")]
    public async Task<IActionResult> IsUniqueName(string? name)
    {
      string urlName = ConvertToUrlName(name);
      if (string.IsNullOrWhiteSpace(urlName))
      {
        return Ok(new { result = true, urlName = urlName });
      }

      ChurchUnit? dbResChurchUnit = await _churchUnitsService.GetByUrlNameAsync(urlName);

      Boolean isUniqueUrlName = dbResChurchUnit is null;

      return Ok(new { result = isUniqueUrlName, urlName = urlName });
    }

    // GET: api/<ChurchUnitController>
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

    // POST api/<ChurchUnitController>
    [HttpPost("Create")]
    public async Task<IActionResult> Create(ChurchUnit newChurchUnit)
    {
      string? personId = HttpContext.Session.GetString("personId");

      if (personId is null)
      {
        return BadRequest(new { result = "notLoggedIn" });
      }
      else if (string.IsNullOrWhiteSpace(newChurchUnit.Name) ||
          newChurchUnit.Name.Length < 3)
      {
        return BadRequest(new { result = "error" });
      }

      newChurchUnit.UrlName = ConvertToUrlName(newChurchUnit.Name);

      string? newChurchUnitOrErr = await _churchUnitsService.CreateAsync(newChurchUnit);

      if (newChurchUnitOrErr is not null && newChurchUnitOrErr.Length == 24)
      {
        _ = _peopleService
          .AddPermissionAsync(HttpContext, newChurchUnit.UrlName, "all", "admin");

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

    // PUT api/<ChurchUnitController>/name
    [HttpPut("{name}")]
    public void Put(int name, [FromBody] string value)
    {
    }

    // DELETE api/<ChurchUnitController>/name
    [HttpDelete("{name}")]
    public void Delete(int name)
    {
    }

    //// GET api/<ChurchUnitController>/name
    //[HttpGet("{name}")]
    //public string Get(string name)
    //{
    //  return "value";
    //}
  }
}
