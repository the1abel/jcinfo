namespace backend.Services
{
  public class Utils
  {
    public static bool isNosqlInjectionFree(string? str)
    {
      if (str is not null)
      {
        foreach (char c in str)
        {
          if (c == '{' || c == '$')
          {
            return false;
          }
        }
      }

      return true;
    }
  }
}
