using System;
using System.Web.Mvc;
using Umbraco.Core.Logging;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using iCAN.Forms.Models;
using iCAN.Core.Utility;

namespace iCAN.Forms.Controllers
{
    public class ContactFormController : SurfaceController
    {
        private readonly MailHelper _mailHelper = new MailHelper();
        private const int FormFolderId = 1174;
       
        public ActionResult RenderContactForm()
        {
            return PartialView("~/Views/Partials/Forms/ContactFormView.cshtml", new ContactForm());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ProcessFormSubmission(ContactForm model)
        {
            if (!ModelState.IsValid)
            {
                TempData["ContactFormValidationFailed"] = "The form validation could not pass. Please check your input.";

                return CurrentUmbracoPage();
            }

            TempData["ContactFormValidationPasses"] = "The form has been validated successfully.";
            TempData["ContactFormFormFolderId"] = FormFolderId;

            SaveContactFormSubmission(model);
            SendEmailNotifications(model);

            var formFolder = Umbraco.TypedContent(FormFolderId);

            if (formFolder != null && formFolder.HasValue("redirectPage"))
            {
                return RedirectToUmbracoPage(formFolder.GetPropertyValue<int>("redirectPage"));
            }

            return RedirectToCurrentUmbracoPage();
        }

        private void SaveContactFormSubmission(ContactForm model)
        {
            try
            {
                var contentService = Services.ContentService;
                var formSubmission = contentService.CreateContent(model.SenderName + ", " + model.Email + " - " + DateTime.Now.ToShortDateString(), FormFolderId, "contactForm");

                formSubmission.SetValue("pageName", model.PageName);
                formSubmission.SetValue("senderName", model.SenderName);
                formSubmission.SetValue("emailAddress", model.Email);
                formSubmission.SetValue("message", model.Message);

                contentService.SaveAndPublishWithStatus(formSubmission);
            }
            catch (Exception ex)
            {
                LogHelper.Warn(GetType(), "Contact form saving failed with the exception: " + ex.Message);
            }

        }

        private void SendEmailNotifications(ContactForm model)
        {
            var formFolder = Umbraco.TypedContent(FormFolderId);

            if (formFolder != null)
            {
                _mailHelper.CreateAndSendNotifications(model, formFolder);
            }
            else
            {
                LogHelper.Warn(GetType(), "Couldn't get the form folder with the id: " + FormFolderId);
            }
        }
    }
}
