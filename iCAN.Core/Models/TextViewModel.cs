using System.Web;

namespace iCAN.Core.Models
{
    public class TextViewModel
    {
        public IHtmlString Text { get; set; }

        public string ModifierClass { get; set; }

        public TextViewModel()
        {
        }
    }
}