using System.Web;

namespace iCAN.Core.Models
{
    public class QuoteViewModel
    {
        public IHtmlString Quote { get; set; }

        public string Source { get; set; }

        public string Title { get; set; }

        public string Alignment { get; set; }

        public string ModifierClass { get; set; }

        public QuoteViewModel()
        {

        }
    }
}