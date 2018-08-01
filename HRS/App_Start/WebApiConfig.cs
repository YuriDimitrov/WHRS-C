using HRS.Custom;
using HRS.Data;
using HRS.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.OData.Batch;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Routing;
using System.Web.Http.OData.Routing.Conventions;

namespace HRS
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // TODO: Add any additional configuration code.

            // Web API routes
            #region OData
            ODataModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<products>("products");
            var entitySetProducts = builder.EntitySet<products>("products");
            entitySetProducts.EntityType.HasKey(entity => entity.id);
            entitySetProducts.EntityType.Collection.Action("GetProductById");

            builder.EntitySet<categories>("categories");
            var entityCategories = builder.EntitySet<categories>("categories");
            entityCategories.EntityType.HasKey(entity => entity.id);

            builder.EntitySet<appellation>("appellation");
            var entityAppellation = builder.EntitySet<appellation>("appellation");
            entityAppellation.EntityType.HasKey(entity => entity.id);

            builder.EntitySet<countries>("countries");
            var entityCounty = builder.EntitySet<countries>("countries");
            entityCounty.EntityType.HasKey(entity => entity.id);

            builder.EntitySet<regions>("regions");
            var entityRegions = builder.EntitySet<regions>("regions");
            entityRegions.EntityType.HasKey(entity => entity.id);

            builder.EntitySet<CustomProductsDTO>("CustomProductsDTO");
            var entityCustomProductsDTO = builder.EntitySet<CustomProductsDTO>("CustomProductsDTO");
            entityCustomProductsDTO.EntityType.HasKey(entity => entity.ProdID);

            builder.EntitySet<inventory>("inventories");
            var entityInventory = builder.EntitySet<inventory>("inventories");
            entityInventory.EntityType.HasKey(entity => entity.id);

            builder.EntitySet<ProductDetailsDTO>("ProductDetailsDTOes");
            var entityProductDetailsDTO = builder.EntitySet<ProductDetailsDTO>("ProductDetailsDTOes");
            entityProductDetailsDTO.EntityType.HasKey(entity => entity.ProdID);

            //builder.EntitySet<GetSalesByContragent_Result>("SalesByContragent");
            //var entitySalesByContragent_Result = builder.EntitySet<GetSalesByContragent_Result>("SalesByContragent");
            //entitySalesByContragent_Result.EntityType.HasKey(entity => entity.ContragentCode);
            //entitySalesByContragent_Result.EntityType.Collection.Action("GenerateXLS");

            builder.EntitySet<vendors>("vendors");
            var entityVendor = builder.EntitySet<vendors>("vendors");
            entityVendor.EntityType.HasKey(entity => entity.id);

            //builder.EntitySet<Item>("Items");
            //var entityItem = builder.EntitySet<Item>("Items");
            //entityItem.EntityType.HasKey(entity => entity.Code);

            //builder.EntitySet<Dealers>("Dealers");
            //var entityDealers = builder.EntitySet<Dealers>("Dealers");
            //entityDealers.EntityType.HasKey(entity => entity.D_ID);

            //builder.EntitySet<V_DistrContragents>("DistrContragents");
            //var entityV_DistrContragents = builder.EntitySet<V_DistrContragents>("DistrContragents");
            //entityV_DistrContragents.EntityType.HasKey(entity => new { entity.DC_DistID, entity.DC_ContrID });

            //builder.EntitySet<V_ItemGroups>("ItemGroups");
            //var entityItemGroups = builder.EntitySet<V_ItemGroups>("ItemGroups");
            //entityItemGroups.EntityType.HasKey(entity => entity.G_Code);

            //builder.EntitySet<V_Regions>("Regions");
            //var entityRegions = builder.EntitySet<V_Regions>("Regions");
            //entityRegions.EntityType.HasKey(entity => entity.R_Code);

            //builder.EntitySet<V_Territories>("Territories");
            //var entityTerritories = builder.EntitySet<V_Territories>("Territories");
            //entityTerritories.EntityType.HasKey(entity => entity.T_Code);

            BatchServer server = new BatchServer(config);
                        
            var conventions = ODataRoutingConventions.CreateDefault();
            // Insert the custom convention at the start of the collection.
            conventions.Insert(0, new CustomActionRoutingConvention());
            var batchHndle = new DefaultODataBatchHandler(server);
            config.Routes.MapODataRoute(routeName: "ODataRoute",
             routePrefix: "odata",
             model: builder.GetEdmModel(),
             pathHandler: new DefaultODataPathHandler(),
             routingConventions: conventions,
             batchHandler: batchHndle);
            //config.Routes.MapODataRoute("ODataRoute", "odata", builder.GetEdmModel(), new DefaultODataBatchHandler(server), routingConventions: conventions);

            // Enable Query support for IQuerable
            config.EnableQuerySupport();
            //config.AddODataQueryFilter();


            #endregion


            // Подменяме хедърите в заявките за да връщаме OData v2
            config.MessageHandlers.Add(new FormatSupportHandler());
            
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/json"));
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/octet-stream"));

            //config.Routes.MapHttpRoute(
            //     name: "ActionApi",
            //     routeTemplate: "api/{controller}/{action}/{id}",
            //     defaults: new { id = RouteParameter.Optional }
            // );

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = System.Web.Http.RouteParameter.Optional }
            //);
            config.Filters.Add(new UnhandledExceptionFilter());

            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    }
}

