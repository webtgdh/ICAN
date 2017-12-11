using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class ImageMozaicViewModel
    {
        public IPublishedContent ImageFirst { get; set; }

        public IPublishedContent ImageSecond { get; set; }

        public string ModifierClass { get; set; }
    }
}