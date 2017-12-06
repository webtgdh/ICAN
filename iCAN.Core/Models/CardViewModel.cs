using System;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class CardViewModel
    {
        public string Headline { get; set; }

        public string Url { get; set; }

        public string UrlTarget { get; set; }

        public IPublishedContent Image { get; set; }

        public string ModifierClass { get; set; }
    }
}