using HRS.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.Entity.SqlServer;

namespace HRS.Services
{
    public class HrsService : IHrsService
    {
        private readonly HrsContext db;
            #region Constructor
        public HrsService(/*string ConnectionTmplt, string TmplDB, string RealDB*/)
        {
            this.db = new HrsContext(HRS.Helpers.ConfigUtils.GetConnectionString());

            db.Configuration.AutoDetectChangesEnabled = false;

            // Премахва Lazy Loading
            db.Configuration.ProxyCreationEnabled = false;

        }

        #endregion

        public IQueryable<categories> GetCategories()
        {
            IQueryable<categories> result = this.db.categories;            
            return result.OrderByDescending(x => x.id);
        }

        public IQueryable<countries> GetCountriesByProductCategory(int categoryId)
        {
            string[] countryIds = db.products.Where(x => x.category_id_id == categoryId).Select(x => SqlFunctions.StringConvert((double)x.vendors.regions.countries.id)).ToArray();
            IQueryable<countries> results = db.countries.Include("regions").Where(x => countryIds.Contains(SqlFunctions.StringConvert((double)x.id))).Distinct();
            return results;
        }

        public IQueryable<vendors> GetVendorsByCountry(int countryID)
        {
            IQueryable<vendors> result = db.vendors.Include("regions").Where(x => x.regions.country_id_id == countryID);
            return result;
        }

        public IQueryable<vendors> GetVendorsByCountryAndCategory(int countryID, int categoryID)
        {
            int[] vendorIds = db.products.Where(x => x.category_id_id == categoryID).Select(x => x.vendor_id_id).ToArray();
            IQueryable<vendors> result = db.vendors.Include("regions").Where(x => x.regions.country_id_id == countryID && vendorIds.Contains(x.id));
            return result;
        }

        public IQueryable<products> GetProductsByVendor(int vendorID)
        {
            IQueryable<products> result = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").Where(x => x.vendor_id_id == vendorID);
            return result;
        }

        public List<CustomProductsDTO> GetRecommendedProducts(Dictionary<int, int> userRatings)
        {
            int[] userIds = db.Database.SqlQuery<int>(@"select distinct user_id_id from user_rates ur
                                                        inner join inventory i on ur.product_id_id = i.product_id_id and i.in_stock > 0").ToArray();
            List<user_rates> userRates = db.user_rates.Where(x => userIds.Contains(x.user_id_id)).ToList();
            Dictionary<int, double> uCoeficient = new Dictionary<int, double>();

            double avgAURRating = userRatings.Sum(x => x.Value) / userRatings.Count;
            if (avgAURRating % 1 == 0)
            {
                avgAURRating += 0.00001;
            }
            foreach (int userID in userIds)
            {
                double divisible = 0;
                double divisorAUR = 0;
                double divisorUR = 0;
                double coeficient = 0;
                List<user_rates> uRates = userRates.Where(x => x.user_id_id == userID).ToList();
                double avgURRating = uRates.Sum(x => x.rate) / uRates.Count;
                if (avgURRating % 1 == 0)
                {
                    avgURRating += 0.00001;
                }
                foreach (int prodID in userRatings.Keys)
                {
                    user_rates rate = uRates.FirstOrDefault(x => x.product_id_id == prodID);
                    if (rate == null)
                    {
                        continue;
                    }
                    divisible += (userRatings[prodID] - avgAURRating) * (rate.rate - avgURRating);
                    divisorAUR += Math.Pow((double)(userRatings[prodID] - avgAURRating), 2);
                    divisorUR += Math.Pow((double)(rate.rate - avgURRating), 2);
                }
                coeficient = divisible / (Math.Sqrt(divisorAUR) * Math.Sqrt(divisorUR));
                if (Double.IsNaN(coeficient))
                {
                    coeficient = 0;
                }
                uCoeficient.Add(userID, coeficient);
            }

            int[] topUsers = uCoeficient.OrderByDescending(x => x.Value).Take(10).Select(x => x.Key).ToArray();
            List<user_rates> topUserRates = userRates.Where(x => topUsers.Contains(x.user_id_id)).ToList();
            int[] productsArray = topUserRates.Select(x => x.product_id_id).ToArray();

            List<inventory> inventory = db.inventory.ToList();
            inventory = inventory.Where(y => productsArray.Contains(y.product_id_id) && !userRatings.ContainsKey(y.product_id_id)).ToList();
            Dictionary<int,double> recrate = new Dictionary<int,double>();
            foreach (inventory inv in inventory)
            {
                int prodId = inv.product_id_id;
                List<user_rates> ratesByProduct = topUserRates.Where(x => x.product_id_id == prodId).ToList();
                double totalRateValue = 0;
                foreach (user_rates rate in ratesByProduct)
                {
                    totalRateValue += uCoeficient[rate.user_id_id] * rate.rate;
                }

                recrate.Add(prodId, totalRateValue / ratesByProduct.Count);
            }

            int[] topProductIds = recrate.OrderByDescending(x => x.Value).Take(10).Select(x => x.Key).ToArray();
            List<products> topProducts = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").Where(x => topProductIds.Contains(x.id)).ToList();

            List<CustomProductsDTO> result = new List<CustomProductsDTO>();
            int currentRank = 1;
            foreach (products prod in topProducts)
            {
                CustomProductsDTO newDTO = new CustomProductsDTO();
                newDTO.ProdID = prod.id;
                newDTO.ProdName = prod.name;
                newDTO.VendorName = prod.vendors.name;
                newDTO.CategoryName = prod.categories.name;
                newDTO.RegionName = prod.vendors.regions.name;
                newDTO.CountryName = prod.vendors.regions.countries.name;
                newDTO.PhotoPath = prod.photo_path;
                newDTO.Rate = (int)recrate[prod.id];
                result.Add(newDTO);
                currentRank++;
            }

            result = result.Where(x => x.Rate > 0).OrderByDescending(x => x.Rate).ToList();

            return result;
        }

        public IQueryable<products> GetProductsInInventory()
        {
            int[] availableProducts = db.inventory.Include("products.categories").Include("products.vendors").Include("products.vendors.regions").Include("products.vendors.regions.countries").Include("products.appellation").Where(x => x.in_stock == true).Select(x => x.product_id_id).ToArray();
            IQueryable<products> result = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").Where(x => availableProducts.Contains(x.id));
            return result;
        }

        public IQueryable<inventory> GetInventory()
        {
            IQueryable<inventory> result = db.inventory.Include("products.categories").Include("products.vendors").Include("products.vendors.regions").Include("products.vendors.regions.countries").Include("products.appellation").Where(x => x.in_stock == true);
            //IQueryable<products> result = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").Where(x => availableProducts.Contains(x.id));
            return result;
        }

        public ProductDetailsDTO GetProductDetails(int productId)
        {
            products selectedProduct = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").FirstOrDefault(x => x.id == productId);
            List<user_rates> userRates = db.user_rates.Where(x => x.product_id_id == productId).ToList();
            List<expert_rates> expertRates = db.expert_rates.Where(x => x.product_id_id == productId).ToList();
            List<expert_product_characteristic> prodCharacteristics = db.expert_product_characteristic.Where(x => x.product_id_id == productId).ToList();

            var sweetnessCharacteristics = prodCharacteristics.Where(x => x.c_header_id_id == 1);
            var acidityCharacteristics = prodCharacteristics.Where(x => x.c_header_id_id == 2);
            var tanninCharacteristics = prodCharacteristics.Where(x => x.c_header_id_id == 3);
            var alcoholCharacteristics = prodCharacteristics.Where(x => x.c_header_id_id == 4);
            var bodyCharacteristics = prodCharacteristics.Where(x => x.c_header_id_id == 5);

            ProductDetailsDTO newDTO = new ProductDetailsDTO();
            newDTO.ProdID = selectedProduct.id;
            newDTO.ProdName = selectedProduct.name;
            newDTO.VendorName = selectedProduct.vendors.name;
            newDTO.CategoryName = selectedProduct.categories.name;
            newDTO.RegionName = selectedProduct.vendors.regions.name;
            newDTO.CountryName = selectedProduct.vendors.regions.countries.name;
            newDTO.PhotoPath = selectedProduct.photo_path;
            newDTO.UserAvgRate = userRates.Count > 0 ? userRates.Sum(x => x.rate) / userRates.Count : 0;
            newDTO.ExpertAvgRate = expertRates.Count > 0 ? expertRates.Sum(x => x.rate) / expertRates.Count : 0;
            newDTO.SweetnessRate = sweetnessCharacteristics.Count() > 0 ? sweetnessCharacteristics.Sum(x => x.characteristic_values) / sweetnessCharacteristics.Count() : 0;
            newDTO.AcidityRate = acidityCharacteristics.Count() > 0 ? acidityCharacteristics.Sum(x => x.characteristic_values) / acidityCharacteristics.Count() : 0;
            newDTO.TanninRate = tanninCharacteristics.Count() > 0 ? tanninCharacteristics.Sum(x => x.characteristic_values) / tanninCharacteristics.Count() : 0;
            newDTO.AlcoholRate = alcoholCharacteristics.Count() > 0 ? alcoholCharacteristics.Sum(x => x.characteristic_values) / alcoholCharacteristics.Count() : 0;
            newDTO.BodyRate = bodyCharacteristics.Count() > 0 ? bodyCharacteristics.Sum(x => x.characteristic_values) / bodyCharacteristics.Count() : 0;
            newDTO.Apellation = selectedProduct.appellation != null ? selectedProduct.appellation.name : string.Empty;

            return newDTO;
        }

        public List<ProductDetailsDTO> GetRecommendedProductsByProductCategory(int productId)
        {
            products selectedProduct = db.products.FirstOrDefault(x => x.id == productId);
            int[] productIds = db.Database.SqlQuery<int>(@"  select distinct ur.product_id_id from user_rates ur
                                                          inner join inventory i on ur.product_id_id = i.product_id_id and i.in_stock > 0
                                                          inner join products p on p.id = ur.product_id_id
                                                          where ur.product_id_id <> '" + productId + "' AND p.category_id_id = '" + selectedProduct.category_id_id + "'").ToArray();

            List<user_rates> userRates = db.user_rates.Where(x => productIds.Contains(x.product_id_id)).ToList();
            Dictionary<int, double> uCoeficient = new Dictionary<int, double>();

            List<user_rates> spRates = db.user_rates.Where(x => x.product_id_id == productId).ToList();
            if (spRates.Count == 0)
            {
                return null;
            }
            double avgSPRating = spRates.Sum(x => x.rate) / spRates.Count;
            if (avgSPRating % 1 == 0)
            {
                avgSPRating += 0.00001;
            }

            foreach (int prodID in productIds)
            {
                double divisible = 0;
                double divisorSP = 0;
                double divisorP = 0;
                double coeficient = 0;
                List<user_rates> pRates = userRates.Where(x => x.product_id_id == prodID).ToList();
                double avgPRating = pRates.Sum(x => x.rate) / pRates.Count;
                if (avgPRating % 1 == 0)
                {
                    avgPRating += 0.00001;
                }
                foreach (int userID in pRates.Select(x => x.user_id_id))
                {
                    user_rates rate = pRates.FirstOrDefault(x => x.user_id_id == userID);
                    user_rates spRate = spRates.FirstOrDefault(x => x.user_id_id == userID);
                    if (rate == null || spRate == null)
                    {
                        continue;
                    }
                    divisible += (spRate.rate - avgSPRating) * (rate.rate - avgPRating);
                    divisorSP += Math.Pow((double)(spRate.rate - avgSPRating), 2);
                    divisorP += Math.Pow((double)(rate.rate - avgPRating), 2);
                }
                coeficient = divisible / (Math.Sqrt(divisorSP) * Math.Sqrt(divisorP));
                if (Double.IsNaN(coeficient))
                {
                    coeficient = 0;
                }
                uCoeficient.Add(prodID, coeficient);
            }

            int[] topProducts = uCoeficient.OrderByDescending(x => x.Value).Take(10).Select(x => x.Key).ToArray();
           
            List<inventory> inventory = db.inventory.ToList();
            inventory = inventory.Where(y => topProducts.Contains(y.product_id_id)).ToList();
            Dictionary<int, double> recrate = new Dictionary<int, double>();
            foreach (inventory inv in inventory)
            {
                int prodId = inv.product_id_id;
                List<user_rates> ratesByProduct = userRates.Where(x => x.product_id_id == prodId).ToList();
                double totalRateValue = 0;
                foreach (user_rates rate in ratesByProduct)
                {
                    totalRateValue += uCoeficient[rate.product_id_id] * rate.rate;
                }

                recrate.Add(prodId, totalRateValue / ratesByProduct.Count);
            }

            int[] topProductIds = recrate.OrderByDescending(x => x.Value).Take(10).Select(x => x.Key).ToArray();
            List<products> recommendedProducts = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").Where(x => topProductIds.Contains(x.id)).ToList();

            List<ProductDetailsDTO> result = new List<ProductDetailsDTO>();
            foreach (products prod in recommendedProducts)
            {
                ProductDetailsDTO newDTO = new ProductDetailsDTO();
                newDTO.ProdID = prod.id;
                newDTO.ProdName = prod.name;
                newDTO.VendorName = prod.vendors.name;
                newDTO.CategoryName = prod.categories.name;
                newDTO.RegionName = prod.vendors.regions.name;
                newDTO.CountryName = prod.vendors.regions.countries.name;
                newDTO.PhotoPath = prod.photo_path;
                newDTO.UserAvgRate = (int)recrate[prod.id];
                result.Add(newDTO);
            }

            result = result.Where(x => x.UserAvgRate > 0).OrderByDescending(x => x.UserAvgRate).ToList();

            return result;
        }

        public List<ProductDetailsDTO> GetRecommendedProductsByCharacteristics(int productId)
        {
            products selectedProduct = db.products.FirstOrDefault(x => x.id == productId);
            List<expert_product_characteristic> productsCharacteristics = db.expert_product_characteristic.ToList();
            Dictionary<int, double> pCoeficient = new Dictionary<int, double>();

            int[] productIds = db.Database.SqlQuery<int>(@"  select distinct ur.product_id_id from expert_product_characteristic ur                                                         
                                                          inner join products p on p.id = ur.product_id_id
                                                          where ur.product_id_id <> '" + productId + "' AND p.category_id_id = '" + selectedProduct.category_id_id + "'").ToArray();
            List<expert_product_characteristic> selectedProdChars = productsCharacteristics.Where(x => x.product_id_id == productId).ToList();
            foreach (int prodId in productIds)
            {
                double divisible = 0;
                double divisorAi = 0;
                double divisorBi = 0;
                double coeficient = 0;
                for (int i = 1; i <= 5; i++)
                {
                    expert_product_characteristic ai = selectedProdChars.FirstOrDefault(x => x.c_header_id_id == i && x.product_id_id == productId);
                    expert_product_characteristic bi = productsCharacteristics.FirstOrDefault(x => x.c_header_id_id == i && x.product_id_id == prodId);
                    divisible += ai.characteristic_values * bi.characteristic_values;
                    divisorAi += ai.characteristic_values * ai.characteristic_values;
                    divisorBi += bi.characteristic_values * bi.characteristic_values;
                }
//                SUM(Ai*Bi) / SQRT(SUM(Ai*Ai)) / SQRT (SUM(Bi*Bi))

                coeficient = divisible / Math.Sqrt(divisorAi) / Math.Sqrt(divisorBi);
                if (Double.IsNaN(coeficient))
                {
                    coeficient = 0;
                }
                pCoeficient.Add(prodId, coeficient);                
            }

            int[] topProducts = pCoeficient.OrderByDescending(x => x.Value).Take(10).Select(x => x.Key).ToArray();

            List<products> recommendedProducts = db.products.Include("categories").Include("vendors").Include("vendors.regions").Include("vendors.regions.countries").Include("appellation").Where(x => topProducts.Contains(x.id)).ToList();

            List<ProductDetailsDTO> result = new List<ProductDetailsDTO>();
            foreach (products prod in recommendedProducts)
            {
                ProductDetailsDTO newDTO = new ProductDetailsDTO();
                newDTO.ProdID = prod.id;
                newDTO.ProdName = prod.name;
                newDTO.VendorName = prod.vendors.name;
                newDTO.CategoryName = prod.categories.name;
                newDTO.RegionName = prod.vendors.regions.name;
                newDTO.CountryName = prod.vendors.regions.countries.name;
                newDTO.PhotoPath = prod.photo_path;
                newDTO.UserAvgRate = (int)(pCoeficient[prod.id] * 100);
                result.Add(newDTO);
            }

            return result;
        }
    }
}
