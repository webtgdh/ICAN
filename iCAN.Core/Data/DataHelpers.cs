using System;
using System.Collections.Generic;
using System.Linq;
using iCAN.Core.ExtensionMethods;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Core;

namespace iCAN.Core.Data
{
    public static class DataHelpers
    {
        /// <summary>
        /// Takes a list of nodes and checks if the passed in urlSegment(string)
        /// matches any of the names in the list
        /// </summary>
        /// <param name="source">Selection of nodes</param>
        /// <param name="propertyAlias">Property alias for MNTP to check url segment against</param>
        /// <param name="name">Name to be used as url segment for comparison</param>
        /// <returns>True if any match else false</returns>
        public static IEnumerable<IPublishedContent> FilterByPrevalueName(IEnumerable<IPublishedContent> source, string propertyAlias, string name)
        {
            var urlFriendlyName = name.ToUrlSegment();
            return source.Where(x => IsUrlSegmentInList(x.GetPropertyValue<IEnumerable<IPublishedContent>>(propertyAlias),urlFriendlyName)).ToList();
        }

        /// <summary>
        /// Takes a list of nodes and checks if the passed in urlSegment(string)
        /// matches any of the names in the list
        /// </summary>
        /// <param name="source">Selection of nodes</param>
        /// <param name="urlSegment">Specified url segment to compare</param>
        /// <returns>True if any match else false</returns>
        public static bool IsUrlSegmentInList(IEnumerable<IPublishedContent> source, string urlSegment) {
            if (source == null)
            {
                return false;
            }
            return source.Any(x => x.Name.ToUrlSegment().InvariantEquals(urlSegment));
        }

        public static IEnumerable<IPublishedContent> FilterByDocumentTypeAlias(IEnumerable<IPublishedContent> source, string documentType)
        {
            return source.Where(x => x.DocumentTypeAlias.InvariantEquals(documentType)).ToList();
        }

        public static IEnumerable<IPublishedContent> FilterBySelectedPrevaluePage(IEnumerable<IPublishedContent> source, string propertyAlias, IPublishedContent page)
        {
            //return source.Where(x => x.GetPropertyValue<int>(propertyAlias) == page.Id).ToList();
            return source.Where(x => x == page ).ToList();
        }

        public static IEnumerable<IPublishedContent> FilterByYearAndMonth(IEnumerable<IPublishedContent> source, string month, string year, string propertyAlias)
        {
            int yearInt;
            var monthInt = IntExtensionMethods.GetMonthNumber(month);
            var isValidYear = int.TryParse(year, out yearInt);

            if (!isValidYear) return source;

            source = source.Where(x => x.GetPropertyValue<DateTime>(propertyAlias).Year == yearInt);

            if (monthInt > 0)
            {
                source = source.Where(x => x.GetPropertyValue<DateTime>(propertyAlias).Month == monthInt);
            }

            return source;
        }
    }
}