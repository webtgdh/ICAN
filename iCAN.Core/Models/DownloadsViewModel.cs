using System.Collections.Generic;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class DownloadsViewModel
    {
        public string Headline { get; set; }

        public IEnumerable<IPublishedContent> Media { get; set; }

        public string ModifierClass { get; set; }

        public DownloadsViewModel()
        {

        }
    }
}