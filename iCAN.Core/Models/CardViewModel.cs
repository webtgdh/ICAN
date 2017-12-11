using System;
using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class CardViewModel
    {
        public string Headline { get; set; }

        public IPublishedContent Image { get; set; }

        public string Copy { get; set; }
        
        public string Category { get; set; }

        public string Label { get; set; }

        public string Url { get; set; }

        public string Target { get; set; }

        public string CtaName { get; set; }

        public string ModifierClass { get; set; }
    
        public CardViewModel()
        {
            CtaName = "Read more";
        }
    }

}