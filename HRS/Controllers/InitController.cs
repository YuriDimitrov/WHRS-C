using HRS.Services;
using HRS.ViewModels.Init;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRS.Controllers
{
    public class InitController : Controller
    {
        // GET: Init
        public ActionResult Index()
        {
            IConfigService confService = new ConfigService();
            string baseUrl = confService.ReadProperty("BaseURL");
            string ui5Src = confService.ReadProperty("UI5SrcPath");
            string uiResourceRoots = confService.ReadProperty("data-sap-ui-resourceroots");
            var model = new InitViewModel()
            {
                BaseURL = baseUrl,
                Ui5Src = ui5Src,
                UiResourceRoots = uiResourceRoots,
            };

            return View(model);
        }
    }
}