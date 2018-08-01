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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace HRS.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using HRS.Data;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<products>("products");
    builder.EntitySet<categories>("categories"); 
    builder.EntitySet<vendors>("vendors"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class productsController : ODataController
    {
        private readonly IHrsService service;
        public productsController(IHrsService service)
        {
            this.service = service;
        }

        // GET: odata/products
        [EnableQuery(MaxExpansionDepth = 4)]
        public IQueryable<products> Getproducts(int vendorId, int categoryId)
        {
            IQueryable<products> products = service.GetProductsByVendor(vendorId).Where(x => x.category_id_id == categoryId);
            //List<products> test = products.ToList();
            return products;
        }

        [EnableQuery(MaxExpansionDepth = 4)]
        public IQueryable<CustomProductsDTO> Getproducts(string jsonData)
        {
            //var prodRatings = JArray.Parse(jsonData);
            var list = JsonConvert.DeserializeObject<IEnumerable<KeyValuePair<int, int>>>(jsonData);
            var prodRatings = list.ToDictionary(x => x.Key, x => x.Value);

            IEnumerable<CustomProductsDTO> products = service.GetRecommendedProducts(prodRatings);

            return products.AsQueryable<CustomProductsDTO>().OrderByDescending(x => x.Rate);
        }


        [EnableQuery(MaxExpansionDepth = 4)]
        public IQueryable<ProductDetailsDTO> GetProductById(int productId)
        {
            ProductDetailsDTO prod = service.GetProductDetails(productId);
            List<ProductDetailsDTO> res = new List<ProductDetailsDTO>();
            res.Add(prod);
            return res.AsQueryable();
           
        }

        // GET: odata/products(5)
        //[EnableQuery]
        //public SingleResult<products> Getproducts([FromODataUri] int key)
        //{
        //    return SingleResult.Create(db.products.Where(products => products.id == key));
        //}      
    }
}
