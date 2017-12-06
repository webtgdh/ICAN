using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace iCAN.Forms.Models
{
    public class ContactForm
    {
        [DisplayName("Page name")]
        [MaxLength(254, ErrorMessage = "Field exceeded maximum length")]
        public string PageName { get; set; }

        [DisplayName("Sender name")]
        [MaxLength(254, ErrorMessage = "Field exceeded maximum length")]
        [Required(ErrorMessage = "Please enter your name")]
        public string SenderName { get; set; }

        [DisplayName("Email")]
        [MaxLength(254, ErrorMessage = "Field exceeded maximum length")]
        [Required(ErrorMessage = "Please enter your email address")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        public string Email { get; set; }

        [DisplayName("Message")]
        [Required(ErrorMessage = "Please enter your message")]
        public string Message { get; set; }
    }
}