using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using HRS.Data;
using HRS.Services;

namespace HRS.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using HRS.Data;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<countries>("countries");
    builder.EntitySet<regions>("regions"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class countriesController : ODataController
    {
        private readonly IHrsService service;
        public countriesController(IHrsService service)
        {
            this.service = service;
        }

        // GET: odata/countries
        [EnableQuery]
        public IQueryable<countries> Getcountries(int categoryId)
        {
            IQueryable<countries> countries = service.GetCountriesByProductCategory(categoryId);
            return countries;
        }       
    }
}
