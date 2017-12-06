using System.Web;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class CoverViewModel
    {
        public IPublishedContent Image { get; set; }

        public string Headline { get; set; }

        public IHtmlString Copy { get; set; }

        public string Cta { get; set; }

        public string ModifierClass { get; set; }

    }
}