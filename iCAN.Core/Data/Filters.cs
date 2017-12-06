using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace iCAN.Core.Data
{
    public class Filters
    {
        public static List<Link> GetCategoryLinks(UmbracoHelper umbraco, string baseUrl = "", string qCat = "")
        {
            var root = umbraco.TypedContentSingleAtXPath("//categories");
            if (root == null)
            {
                return null;
            }
            var categories = root.Children().ToList();

            if (!categories.Any())
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

            foreach (var item in categories)
            {
                var linkName = item.Name;
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

        public static List<Link> GetAuthorLinks(UmbracoHelper umbraco, string baseUrl = "", string qAuthor = "")
        {
            var root = umbraco.TypedContentSingleAtXPath("//authors");
            if (root == null)
            {
                return null;
            }
            var authors = root.Children().ToList();

            if (!authors.Any())
            {
                return null;
            }

            var authorLinks = new List<Link> {
                new Link{
                    Name = "All authors",
                    Url = baseUrl,
                    IsActive = String.IsNullOrWhiteSpace(qAuthor)
                }
            };

            foreach (var item in authors)
            {
                var linkName = item.Name;
                var urlFriendlyName = linkName.ToUrlSegment();
                var linkUrl = baseUrl + "?author=" + urlFriendlyName;
                var isActive = urlFriendlyName.InvariantEquals(qAuthor);
                authorLinks.Add(
                    new Link
                    {
                        Name = linkName,
                        Url = linkUrl,
                        IsActive = isActive
                    });
            }
            return authorLinks;
        }

        public static List<Link> GetDatesFromSelection(List<IPublishedContent> selection = null, string baseUrl = "", string qMonth = "", string qYear = "")
        {
            if (selection == null || !selection.Any())
            {
                return null;
            }

            var dateList = selection.Where(i => i.HasValue("releaseDate"))
                .Select(d => new DateTime(d.GetPropertyValue<DateTime>("releaseDate").Year, d.GetPropertyValue<DateTime>("releaseDate").Month, 1))
                .Distinct()
                .ToList();

            var dateLinks = new List<Link> {
                    new Link{
                        Name = "All dates",
                        Url = baseUrl,
                        IsActive = String.IsNullOrWhiteSpace(qYear) && String.IsNullOrWhiteSpace(qMonth)
                    }
                };

            foreach (var date in dateList)
            {
                var linkName = date.ToString("MMMM yyyy");
                var urlMonth = date.ToString("MMMM").ToLower();
                var urlYear = date.ToString("yyyy");
                var linkUrl = baseUrl + "?month=" + urlMonth + "&year=" + urlYear;
                var isActive = urlMonth.InvariantEquals(qMonth) && urlYear.InvariantEquals(qYear);
                dateLinks.Add(
                    new Link
                    {
                        Name = linkName,
                        Url = linkUrl,
                        IsActive = isActive
                    });
            }
            return dateLinks;
        }
    }
}