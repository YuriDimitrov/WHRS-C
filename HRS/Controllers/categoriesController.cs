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
    builder.EntitySet<categories>("categories");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class categoriesController : ODataController
    {
        private readonly IHrsService service;
        public categoriesController(IHrsService service)
        {
            this.service = service;
        }

        // GET: odata/categories
        [EnableQuery]
        public IQueryable<categories> Getcategories()
        {
            IQueryable<categories> result = service.GetCategories();
            return result;
            
        }

        // GET: odata/categories(5)
        [EnableQuery]
        public SingleResult<categories> Getcategories([FromODataUri] int key)
        {
            return SingleResult.Create(service.GetCategories().Where(categories => categories.id == key));
        }       
    }
}
