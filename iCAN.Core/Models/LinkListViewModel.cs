using System.Collections.Generic;
using System.Web;

namespace iCAN.Core.Models
{
    public class LinkListViewModel
    {
        public List<Link> Links { get; set; }

        public string ModifierClass { get; set; }

        public LinkListViewModel(List<Link> links = null)
        {
            Links = links;
        }
    }
}