using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly PeopleService _peopleService;
  private readonly PasswordHasher<string> _passwordHasher;

  public AuthController(PeopleService peopleService)
  {
    _peopleService = peopleService;
    _passwordHasher = new PasswordHasher<string>();
  }

  [HttpPost("SignUp")]
  public async Task<IActionResult> SignUp(Person newPerson)
  {
    newPerson.Password =
        _passwordHasher.HashPassword(newPerson.Email, newPerson.Password);

    string? dbRes = await _peopleService.CreateAsync(newPerson);

    if (dbRes.Equals("successful"))
    {


      return CreatedAtAction(nameof(SignUp), new { id = newPerson.Email },
          new { result = "success" });
    }
    else if (dbRes.Equals("duplicate"))
    {
      return BadRequest(new { result = "duplicate" });
    }
    else
    {
      return BadRequest(new { result = "error" });
    }
  }

  [HttpPost("LogIn")]
  public async Task<IActionResult> LogIn(Person person)
  {
    Person? dbResPerson = await _peopleService.GetByEmailAsync(person.Email);

    if (dbResPerson is null)
    {
      return NotFound();
    }

    PasswordVerificationResult pwRes = _passwordHasher
      .VerifyHashedPassword(person.Email, dbResPerson.Password, person.Password);

    if (pwRes.HasFlag(PasswordVerificationResult.Success))
    {
      Console.WriteLine(pwRes.ToString());
      HttpContext.Session.SetString("personId", dbResPerson.Id);
      return CreatedAtAction(nameof(LogIn), new { id = person.Email });
    }
    else
    {
      return NotFound();
    }
  }

  [HttpDelete("LogOut")]
  public async Task<IActionResult> LogOut(Person person)
  {
    person.Password =
        _passwordHasher.HashPassword(person.Email, person.Password);

    await _peopleService.CreateAsync(person);
    HttpContext.Session.SetString("personId", person.Id);

    return CreatedAtAction(nameof(LogOut), new { id = person.Id }, person);
  }

  [HttpDelete("LogOut")]
  public async Task<IActionResult> LogOut()
  {
    if (!string.IsNullOrEmpty(HttpContext.Session.GetString("personId")))
    {
      HttpContext.Session.Clear();
      return Ok();
    }
    else
    {
      return NoContent();
    }
  }

  // [HttpGet]
  // public async Task<List<Person>> IsLoggedIn() =>
  //     await _peopleService.GetAsync();
  //
  // [HttpGet("{id:length(24)}")]
  // public async Task<ActionResult<Person>> IsLoggedIn(string id)
  // {
  //   var person = await _peopleService.GetAsync(id);
  //
  //   if (person is null)
  //   {
  //     return NotFound();
  //   }
  //
  //   return person;
  // }

  // [HttpPut("ChangePassword")]
  // public async Task<IActionResult> ChangePassword(Person updatedPerson)
  // {
  //   var person = await _peopleService.GetAsync(id);
  //
  //   if (person is null)
  //   {
  //     return NotFound();
  //   }
  //
  //   updatedPerson.Id = person.Id;
  //
  //   await _peopleService.UpdateAsync(id, updatedPerson);
  //
  //   return NoContent();
  // }
}