using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace iCAN.Core.Data
{
    public static class News
    {

        public static IEnumerable<IPublishedContent> AllArticles(UmbracoHelper umbraco)
        {
            var root = umbraco.TypedContentSingleAtXPath("//news");
            var articles = new List<IPublishedContent>();

            if (root == null)
            {
                return articles;
            }

            articles = root.Children().Where(x => x.IsVisible()).ToList();

            return articles;
        }

        public static IEnumerable<IPublishedContent> AllOrderedArticles(UmbracoHelper umbraco)
        {
            return AllArticles(umbraco).OrderByDescending(x => x.GetPropertyValue<DateTime>("releaseDate"));
        }

        public static IEnumerable<IPublishedContent> FilterSelection(IEnumerable<IPublishedContent> source, string category, string month, string year)
        {
            if (!string.IsNullOrWhiteSpace(category))
            {
                source = FilterByDocumentTypeUrlSegment(source, category);
            }

            if (!string.IsNullOrWhiteSpace(year))
            {
                source = DataHelpers.FilterByYearAndMonth(source, month, year, "releaseDate");
            }

            return source;
        }

        public static IEnumerable<IPublishedContent> AllFilteredNewsArticles(UmbracoHelper umbraco, string category, string month, string year)
        {
            var allNewsArticles = AllOrderedArticles(umbraco);

            if (!string.IsNullOrWhiteSpace(category))
            {
                allNewsArticles = FilterByDocumentTypeUrlSegment(allNewsArticles, category);
            }

            if (!string.IsNullOrWhiteSpace(year))
            {
                allNewsArticles = DataHelpers.FilterByYearAndMonth(allNewsArticles, year, month, "releaseDate");
            }

            return allNewsArticles;
        }

        public static IEnumerable<IPublishedContent> FilterByDocumentTypeUrlSegment(IEnumerable<IPublishedContent> source, string documentType)
        {
            return source.Where(x => GetCategoryNameFromDocType(x.DocumentTypeAlias).ToUrlSegment().InvariantEquals(documentType)).ToList();
        }

        public static List<Link> GetCategoryLinks(IEnumerable<IPublishedContent> source, string baseUrl = "", string qCat = "")
        {
            if (source == null)
            {
                return null;
            }
            var distinctDocTypes = source.Select(x => x.DocumentTypeAlias).Distinct();

            if (!distinctDocTypes.Any())
            {
                return null;
            }

            var categoryLinks = new List<Link> {
                new Link{
                    Name = "All posts",
                    Url = baseUrl,
                    IsActive = String.IsNullOrWhiteSpace(qCat)
                }
            };

            foreach (var item in distinctDocTypes)
            {
                var linkName = GetCategoryNameFromDocType(item);
                var urlFriendlyName = linkName.ToUrlSegment();
                var linkUrl = baseUrl + "?category=" + urlFriendlyName;
                var isActive = urlFriendlyName.InvariantEquals(qCat);
                categoryLinks.Add(
                    new Link
                    {
                        Name = linkName,
                        Url = linkUrl,
                        IsActive = isActive
                    });
            }
            return categoryLinks;
        }

        public static string GetCategoryNameFromDocType(string docType)
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
    }
}