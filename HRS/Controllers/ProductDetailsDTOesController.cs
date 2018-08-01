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
    using HRS.Services;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<ProductDetailsDTO>("ProductDetailsDTOes");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class ProductDetailsDTOesController : ODataController
    {
        private readonly IHrsService service;
        public ProductDetailsDTOesController(IHrsService service)
        {
            this.service = service;
        }

        // GET: odata/ProductDetailsDTOes
        [EnableQuery]
        public IQueryable<ProductDetailsDTO> GetProductDetailsDTOes(int productId, string opType)
        {
            List<ProductDetailsDTO> res = new List<ProductDetailsDTO>();
            switch (opType)
            {
                case "prodDetails":
                    ProductDetailsDTO prod = service.GetProductDetails(productId);
                    res = new List<ProductDetailsDTO>();
                    res.Add(prod);
                    break;
                case "userSuggestions": res = service.GetRecommendedProductsByProductCategory(productId);
                    break;
                case "expertSuggestions": res = service.GetRecommendedProductsByCharacteristics(productId);
                    break;
                default:
                    break;
            }

            if (res == null)
            {
                return null;
            }
            return res.AsQueryable();
        }
    }
}
