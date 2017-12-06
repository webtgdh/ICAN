using System.Web;

namespace iCAN.Core.Models
{
    public class VideoViewModel
    {
        public IHtmlString Video { get; set; }

        public string ModifierClass { get; set; }

        public VideoViewModel()
        {
        }
    }
}