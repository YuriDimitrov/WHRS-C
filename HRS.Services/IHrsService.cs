using HRS.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Services
{
    public interface IHrsService
    {
        IQueryable<categories> GetCategories();

        IQueryable<countries> GetCountriesByProductCategory(int categoryId);

        IQueryable<vendors> GetVendorsByCountry(int countryID);
        IQueryable<vendors> GetVendorsByCountryAndCategory(int countryID, int categoryID);

        IQueryable<products> GetProductsByVendor(int vendorID);

        List<CustomProductsDTO> GetRecommendedProducts(Dictionary<int, int> userRatings);

        IQueryable<products> GetProductsInInventory();

        IQueryable<inventory> GetInventory();

        ProductDetailsDTO GetProductDetails(int productId);

        List<ProductDetailsDTO> GetRecommendedProductsByProductCategory(int productId);

        List<ProductDetailsDTO> GetRecommendedProductsByCharacteristics(int productId);
    }
}
