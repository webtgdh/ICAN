using System.Web;
using iCAN.Core.ExtensionMethods;

namespace iCAN.Core.Models
{
    public class TabViewModel
    {
        public string Name { get; set; }

        public IHtmlString Content { get; set; }

        public string ModifierClass { get; set; }

        public string Id {
            get { return GetId(); } 
        }

        private string GetId() {
            return Name.ConvertToId();
        }
    }
}