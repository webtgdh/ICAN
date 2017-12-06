using System;
using System.Web;

namespace iCAN.Core.Utility
{
    public class Paging
    {
        public int TotalItems { get; set; }

        public int CurrentIndex { get; set; }

        public int PageSize { get; set; }

        public int TotalPages { get; set; }

        public int StartPage { get; set; }

        public int EndPage { get; set; }

        public int Skip { get; set; }

        public int Take { get; set; }

        public Paging(int totalItems, int pageSize = 5)
        {
            int page;
            int.TryParse(HttpContext.Current.Request.QueryString["page"], out page);
            if (page == 0) page = 1;

            var totalPages = (int)Math.Ceiling((decimal)totalItems / (decimal)pageSize);
            var currentIndex = page != null ? (int)page : 1;
            var startPage = currentIndex - 5;
            var endPage = currentIndex + 4;
            if (startPage <= 0)
            {
                endPage -= (startPage - 1);
                startPage = 1;
            }
            if (endPage > totalPages)
            {
                endPage = totalPages;
                if (endPage > 10)
                {
                    startPage = endPage - 9;
                }
            }

            TotalItems = totalItems;
            CurrentIndex = currentIndex;
            PageSize = pageSize;
            TotalPages = totalPages;
            StartPage = startPage;
            EndPage = endPage;
            Skip = (currentIndex - 1) * pageSize;
            Take = pageSize;

        }

    }
}
