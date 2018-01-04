using Umbraco.Core.Models;
using Umbraco.Web;

namespace iCAN.Core.Utility
{
    public class ContentTypeHelper
    {
        public static string GetContentTypeLabelFromPage(IPublishedContent page)
        {
            var docType = page.DocumentTypeAlias;

            var contentLabel = "";

            switch (docType)
            {
                case "post":
                    contentLabel = "Blog";
                    break;
                case "generalNews":
                case "inTheMedia":
                case "pressRelease":
                    contentLabel = "News";
                    break;
                case "event":
                    contentLabel = "Event";
                    break;
                case "review":
                    contentLabel = "Review";
                    break;
                default:
                    contentLabel = @GetGatewayLabelFromPage(page);
                    break;
            }
            return contentLabel;
        }

        public static string GetNewsTypeLabelFromPage(string docType)
        {
            var category = string.Empty;

            switch (docType)
            {
                case "inTheMedia":
                    category = "In the media";
                    break;
                case "pressRelease":
                    category = "Press release";
                    break;
                case "generalNews":
                    category = "General news";
                    break;
                case "iCANSays":
                    category = "I CAN Says";
                    break;
            }

            return category;
        }

        public static string GetGatewayLabelFromPage(IPublishedContent page)
        {
            var gateway = page.AncestorOrSelf("gatewayPage");
            if (gateway != null)
            {
                return gateway.Name;
            }
            return "";
        }
    }
}
