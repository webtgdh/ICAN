namespace iCAN.Core.Models
{
    public class HeadingViewModel
    {
        public string Headline { get; set; }

        public string Subtitle { get; set; }
        
        public string Level { get; set; }

        public string ModifierClass { get; set; }

        public HeadingViewModel()
        {
            Level = "h2";
        }
    }
}