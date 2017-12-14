using System.Web;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class CoverViewModel
    {
        public IPublishedContent Image { get; set; }

        public string Headline { get; set; }

        public string HeadingLevel { get; set; }

        public string Copy { get; set; }

        public string Url { get; set; }

        public string Target { get; set; }

        public string CtaName { get; set; }

        public string ModifierClass { get; set; }

        public CoverViewModel()
        {
            CtaName = "Read more";
        }

    }
}