using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.RegularExpressions;

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

  [HttpGet("IsUniqueEmail/{email}")]
  public async Task<IActionResult> IsUniqueEmail(string? email)
  {
    if (!new EmailAddressAttribute().IsValid(email))
    {
      return Ok(new { result = false }); // not BadRequest() because user may still be typing
    }

    Person? dbResPerson = await _peopleService.GetByEmailAsync(email);

    return Ok(new { result = dbResPerson is null });
  }

  [HttpPost("SignUp")]
  public async Task<IActionResult> SignUp(Person newPerson)
  {
    if (!new EmailAddressAttribute().IsValid(newPerson.Email))
    {
      return BadRequest(new { result = "Error" });
    }

    #pragma warning disable CS8604 // Possible null reference argument.
    newPerson.Password =
      _passwordHasher.HashPassword(newPerson.Email, newPerson.Password);
    #pragma warning restore CS8604 // Possible null reference argument.

    string? newPersonIdOrErr = await _peopleService.CreateAsync(newPerson);

    if (newPersonIdOrErr is not null && newPersonIdOrErr.Length == 24)
    {
      HttpContext.Session.SetString("personId", newPersonIdOrErr);
      HttpContext.Session.SetString("personEmail", newPerson.Email);
      HttpContext.Session.SetString("personPermissions", "{}");
      return CreatedAtAction(nameof(Permissions), new { email = newPerson.Email },
          new { result = "Success", permissions = new { } });
    }
    else if (newPersonIdOrErr is not null &&
        newPersonIdOrErr.Equals("ErrorDuplicate"))
    {
      return BadRequest(new { result = "ErrorDuplicate" });
    }
    else
    {
      return BadRequest(new { result = "Error" });
    }
  }

  [HttpPost("LogIn")]
  public async Task<IActionResult> LogIn(Person person)
  {
    Person? dbResPerson = await _peopleService.GetByEmailAsync(person.Email);

    if (dbResPerson is null)
    {
      return Ok(new { result = "ErrorAuthenticationFailed" });
    }

    #pragma warning disable CS8604 // Possible null reference argument.
    PasswordVerificationResult pwRes = _passwordHasher
      .VerifyHashedPassword(person.Email, dbResPerson.Password, person.Password);
    #pragma warning restore CS8604 // Possible null reference argument.

    if (pwRes.HasFlag(PasswordVerificationResult.Success))
    {
      #pragma warning disable CS8604 // Possible null reference argument.
      HttpContext.Session.SetString("personId", dbResPerson.Id);
      HttpContext.Session.SetString("personEmail", person.Email);
      #pragma warning restore CS8604 // Possible null reference argument.
      HttpContext.Session
        .SetString("personPermissions", JsonSerializer.Serialize(dbResPerson.Permissions));
      return CreatedAtAction(nameof(Permissions), new { email = person.Email },
        new { result = "Success", permissions = dbResPerson.Permissions });
    }
    else
    {
      return Ok(new { result = "ErrorAuthenticationFailed" });
    }
  }

  [HttpDelete("LogOut")]
  public IActionResult LogOut()
  {
    if (!string.IsNullOrEmpty(HttpContext.Session.GetString("personId")))
    {
      HttpContext.Session.Clear();
      return Ok(new { result = "Success"} );
    }
    else
    {
      return NoContent();
    }
  }

  [HttpGet("Permissions")]
  public async Task<IActionResult> Permissions(string? email)
  {
    Person? dbResPerson = null;
    if (!string.IsNullOrEmpty(email))
    {
      dbResPerson = await _peopleService.GetByEmailAsync(email);
    }
    string? personId = HttpContext.Session.GetString("personId");

    if (dbResPerson is not null &&
        dbResPerson.Id is not null &&
        dbResPerson.Id.Equals(personId))
    {
      return Ok(new { result = "Success", permissions = dbResPerson.Permissions });
    }
    else
    {
      return Ok(new { result = "ErrorNotLoggedIn" });
    }
  }

  [HttpPut("Permissions")]
  public async Task<IActionResult> UpdatePermissions([FromBody] PermissionSet p)
  {
    if (string.IsNullOrEmpty(p.Org))
    {
      return Ok(new { result = "ErrorMissingOrg"});
    }

    var newPermissionsStrOrErr = await _peopleService.AddOrUpdatePermissionAsync(
        HttpContext, p.Email, p.ChurchUnitUrlName, p.Org, p.Permission);

    Match m = Regex.Match(newPermissionsStrOrErr, @"^Error", RegexOptions.IgnoreCase);

    if (m.Success)
    {
      return Ok(new { result = newPermissionsStrOrErr });
    }

    return Ok(new { result = "Success", permissions = newPermissionsStrOrErr });
  }

  // [HttpPut("ChangePassword")]
  // public async Task<IActionResult> ChangePassword(Person updatedPerson)
  // {
  //   var person = await _peopleService.GetAsync(id);
  //
  //   if (person is null)
  //   {
  //     return Ok(new { result = "ErrorAuthenticationFailed" });
  //   }
  //
  //   updatedPerson.Id = person.Id;
  //
  //   await _peopleService.UpdateAsync(id, updatedPerson);
  //
  //   return NoContent();
  // }
}