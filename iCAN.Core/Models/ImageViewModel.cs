using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class ImageViewModel
    {
        public IPublishedContent Image { get; set; }

        public string Alignment { get; set; }

        public string AspectRatio { get; set; }

        public int ImageWidth { get; set; }

        public string ModifierClass { get; set; }

        public ImageViewModel()
        {
            ImageWidth = 1800;
        }
    }
}