//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HRS.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class inventory
    {
        public int id { get; set; }
        public bool in_stock { get; set; }
        public int product_id_id { get; set; }
        public decimal price { get; set; }
    
        public virtual products products { get; set; }
    }
}
