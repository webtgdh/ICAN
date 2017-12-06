using System.Collections.Generic;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class GalleryViewModel
    {
        public IEnumerable<IPublishedContent> Images { get; set; }

        public string Alignment { get; set; }

        public string AspectRatio { get; set; }

        public int ImageWidth { get; set; }

        public string ModifierClass { get; set; }

        public GalleryViewModel()
        {
            ImageWidth = 1000;
        }
    }
}