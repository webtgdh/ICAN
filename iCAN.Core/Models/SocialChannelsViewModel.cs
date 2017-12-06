using System.Collections.Generic;
using System.Web;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class SocialChannelsViewModel
    {
        public IEnumerable<IPublishedContent> SocialChannels { get; set; }

        public int IconSize { get; set; }

        public SocialChannelsViewModel()
        {
            IconSize = 32;
        }
    }
}