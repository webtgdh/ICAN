using Umbraco.Core.Models;

namespace iCAN.Core.Models
{
    public class LogoViewModel
    {
        public IPublishedContent Logo { get; set; }

        public string Url { get; set; }

        public string Target { get; set; }

        public string CtaName { get; set; }

        public int ImageWidth { get; set; }

        public string ModifierClass { get; set; }

        public LogoViewModel()
        {
            ImageWidth = 100;
        }
    }
}