using System;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;
using Umbraco.Core.Logging;

namespace iCAN
{
    /// <summary>
    ///  https://github.com/KevinJump/Aubergine
    ///  a settings handler. will load (and refresh as needed) a link
    ///  to the globalSettings node, this means you can just call
    ///  
    ///  TGDH.Settings<string>("someProperty","default"); 
    ///  
    ///  To read a setting. 
    ///  
    ///  Within your own classes you can also subscribe to the SettingsChanged
    ///  event, so when settings change - you can get them.
    /// </summary>
    public partial class TGDH
    {
        public static IPublishedContent GlobalSettings { get; set; }

        public static T Settings<T>(string key)
        {
            return Settings<T>(key, default(T));
        }

        public static T Settings<T>(string key, T defaultValue)
        {
            if (GlobalSettings != null
                && GlobalSettings.HasProperty(key)
                && GlobalSettings.HasValue(key))
            {
                return GlobalSettings.GetPropertyValue<T>(key, defaultValue);
            }
            return defaultValue;
        }

        public static event GlobalSettingsEventHandler SettingsChanged;
        public delegate void GlobalSettingsEventHandler(EventArgs e);

        internal static void LoadSettingsNode(bool raiseEvents = true)
        {
            UmbracoHelper umbraco = new UmbracoHelper(UmbracoContext.Current);
            var settings = umbraco.TypedContentSingleAtXPath("//globalSettings");
            if (settings != null)
            {
                TGDH.GlobalSettings = settings;

                if (raiseEvents && SettingsChanged != null)
                    SettingsChanged(new EventArgs());
            }
        }
    }

    public class SiteSettingEventHandler : ApplicationEventHandler
    {
        int settingsContentTypeId = -1;
        ILogger _logger;

        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {

            _logger = applicationContext.ProfilingLogger.Logger;
            TGDH.LoadSettingsNode(false);

            ContentService.Published += ContentService_Published;

            var contentType =
                applicationContext.Services.ContentTypeService.GetContentType("globalSettings");
            if (contentType != null)
                settingsContentTypeId = contentType.Id;

        }

        private void ContentService_Published(Umbraco.Core.Publishing.IPublishingStrategy sender, Umbraco.Core.Events.PublishEventArgs<IContent> e)
        {
            try
            {
                if (settingsContentTypeId != -1)
                {
                    foreach (var item in e.PublishedEntities)
                    {
                        if (item.ContentTypeId == settingsContentTypeId)
                        {
                            TGDH.LoadSettingsNode();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Warn<SiteSettingEventHandler>("Failed to re-load settings: {0}", () => ex.ToString());
            }
        }
    }
}
