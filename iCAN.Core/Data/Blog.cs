using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace iCAN.Core.Data
{
    public static class Blog
    {
        public static IEnumerable<IPublishedContent> AllPosts(UmbracoHelper umbraco)
        {
            var root = umbraco.TypedContentSingleAtXPath("//blog");
            var posts = new List<IPublishedContent>();

            if (root == null)
            {
                return posts;
            }

            posts = root.Children().ToList();

            return posts;
        }

        public static IEnumerable<IPublishedContent> AllOrderedPosts(UmbracoHelper umbraco)
        {
            return AllPosts(umbraco).OrderByDescending(x => x.GetPropertyValue<DateTime>("releaseDate"));
        }

        public static bool StringInList(string stringInQuestion, string stringList)
        {
            return stringList.Split(',').Any(x => x.Equals(stringInQuestion, StringComparison.OrdinalIgnoreCase));
        }

        public static IEnumerable<IPublishedContent> FilterSelection(IEnumerable<IPublishedContent> source, string author, string category, string month, string year)
        {
            var filterByCategory = !string.IsNullOrWhiteSpace(category);
            var filterByAuthor = !string.IsNullOrWhiteSpace(author);

            if (filterByAuthor && filterByCategory)
            {
                var postsInCategory = DataHelpers.FilterByPrevalueName(source, "category", category);
                var postsByAuthor = DataHelpers.FilterByPrevalueName(source, "author", author);

                source = postsInCategory.Intersect(postsByAuthor).ToList();
            }
            else
            {
                if (filterByAuthor)
                {
                    source = DataHelpers.FilterByPrevalueName(source, "author", author);
                }

                if (filterByCategory)
                {
                    source = DataHelpers.FilterByPrevalueName(source, "category", category);
                }
            }

            if (!string.IsNullOrWhiteSpace(year))
            {
                source = DataHelpers.FilterByYearAndMonth(source, month, year, "releaseDate");
            }

            return source;
        }
        
    }
}