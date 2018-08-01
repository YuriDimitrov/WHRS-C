using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Data
{
    public class HrsContext : DbContext
    {
        public HrsContext(string ConncetionString/*string database*/)
            // : base("metadata=res://*/AssetModel.csdl|res://*/AssetModel.ssdl|res://*/AssetModel.msl;provider=System.Data.SqlClient;provider connection string=\";data source=192.168.0.201;initial catalog=MobeeAsset" + database +";user id=sysdba;MultipleActiveResultSets=True;App=EntityFramework\"")
            : base(ConncetionString)
        {
        }

        public virtual DbSet<appellation> appellation { get; set; }
        public virtual DbSet<vendors> vendors { get; set; }
        public virtual DbSet<products> products { get; set; }
        public virtual DbSet<categories> categories { get; set; }
        public virtual DbSet<expert_product_characteristic> expert_product_characteristic { get; set; }
        public virtual DbSet<expert_rates> expert_rates { get; set; }
        public virtual DbSet<experts> experts { get; set; }
        public virtual DbSet<countries> countries { get; set; }
        public virtual DbSet<star_ratings_rating> star_ratings_rating { get; set; }
        public virtual DbSet<star_ratings_userrating> star_ratings_userrating { get; set; }

        public virtual DbSet<user_rates> user_rates { get; set; }
        public virtual DbSet<characteristics_headers> characteristics_headers { get; set; }
        public virtual DbSet<characteristics_values> characteristics_values { get; set; }
        public virtual DbSet<inventory> inventory { get; set; }
    }
}
