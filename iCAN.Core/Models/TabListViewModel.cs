using System.Collections.Generic;
using System.Web;

namespace iCAN.Core.Models
{
    public class TabListViewModel
    {
        public List<TabViewModel> Tabs { get; set; }

        public string MediaIds { get; set; }

        public string ModifierClass { get; set; }

        public TabListViewModel()
        {

        }
    }
}