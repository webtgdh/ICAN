using System.Collections.Generic;
using Umbraco.Core.Models;
using iCAN.Core.Utility;

namespace iCAN.Core.Models
{
    public class PaginationViewModel
    {
        public Paging Paging { get; set; }

        public IPublishedContent CurrentModel { get; set; }

        public string HashLink { get; set; }

        public string ModifierClass { get; set; }
    }
}