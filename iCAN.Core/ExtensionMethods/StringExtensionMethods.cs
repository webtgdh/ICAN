using System;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace iCAN.Core.ExtensionMethods
{
    public static class StringExtensionMethods
    {
        private static readonly string LettersAndDigitsPattern = @"[^0-9a-zA-Z]+";

        public static bool IsValidEmail(this string email)
        {
            try
            {
                var addr = new MailAddress(email.Trim());
                return addr.Address == email;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        public static string ConvertToId(this string source)
        {
            return !string.IsNullOrWhiteSpace(source) ? Regex.Replace(source, LettersAndDigitsPattern, string.Empty).ToLower() : "";
        }

        public static string CreateGuid()
        {
            return Guid.NewGuid().ToString("N");
        }

        public static string TruncateAtWord(this string text, int maxCharacters, string trailingStringIfTextCut = "&hellip;")
        {
            if (text == null || (text = text.Trim()).Length <= maxCharacters)
                return text;

            int trailLength = trailingStringIfTextCut.StartsWith("&") ? 1
                                                                      : trailingStringIfTextCut.Length;
            maxCharacters = maxCharacters - trailLength >= 0 ? maxCharacters - trailLength
                                                             : 0;
            int pos = text.LastIndexOf(" ", maxCharacters, StringComparison.Ordinal);
            if (pos >= 0)
                return text.Substring(0, pos) + trailingStringIfTextCut;

            return string.Empty;
        }
    }
}