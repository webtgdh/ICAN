using Newtonsoft.Json.Linq;

namespace iCAN.Core.Models
{
    public class LinkPickerModel
    {
        public LinkPickerModel(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return;

            var jToken = JToken.Parse(json);

            Id = (int)jToken["id"];
            Name = (string)jToken["name"];
            Url = (string)jToken["url"];
            Target = (string)jToken["target"];
            Hashtarget = (string)jToken["hashtarget"];
        }

        public LinkPickerModel()
        {
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Url { get; set; }

        public string Target { get; set; }

        public string Hashtarget { get; set; }
    }
}