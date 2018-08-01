using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace HRS.Data
{
    public partial class CustomProductsDTO
    {
        public int Rank { get; set; }
        public int ProdID { get; set; }
        public string ProdName { get; set; }
        public string VendorName { get; set; }
        public string CategoryName { get; set; }
        public string RegionName { get; set; }
        public string CountryName { get; set; }
        public int Rate { get; set; }
        public string PhotoPath { get; set; }
    }

    public partial class ProductDetailsDTO
    {
        [Key]
        public int ProdID { get; set; }
        public string ProdName { get; set; }
        public string VendorName { get; set; }
        public string CategoryName { get; set; }
        public string RegionName { get; set; }
        public string CountryName { get; set; }
        public string Apellation { get; set; }
        public string PhotoPath { get; set; }

        public int SweetnessRate {get; set;}
        public int AcidityRate {get; set;}
        public int TanninRate {get; set;}
        public int AlcoholRate {get; set;}
        public int BodyRate { get; set; }

        public int UserAvgRate { get; set; }
        public int ExpertAvgRate { get; set; }
            
    }
}
