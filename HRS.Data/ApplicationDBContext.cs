using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("HrsEntities", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public System.Data.Entity.DbSet<HRS.Data.categories> categories { get; set; }

        public System.Data.Entity.DbSet<HRS.Data.countries> countries { get; set; }

        public System.Data.Entity.DbSet<HRS.Data.vendors> vendors { get; set; }

        public System.Data.Entity.DbSet<HRS.Data.appellation> appellations { get; set; }

        public System.Data.Entity.DbSet<HRS.Data.products> products { get; set; }

        public System.Data.Entity.DbSet<HRS.Data.inventory> inventories { get; set; }

        public System.Data.Entity.DbSet<HRS.Data.ProductDetailsDTO> ProductDetailsDTOes { get; set; }
    }
}
