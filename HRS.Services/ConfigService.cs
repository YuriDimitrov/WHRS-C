using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Services
{
    public class ConfigService : IConfigService
    {
        public ConfigService()
        {

        }

        public virtual bool HasProperty(string key)
        {
            return !String.IsNullOrWhiteSpace(key) && ConfigurationManager.AppSettings.AllKeys.Select((string x) => x).Contains(key);
        }

        public virtual string ReadProperty(string key)
        {
            string returnValue = String.Empty;
            if (this.HasProperty(key))
            {
                returnValue = ConfigurationManager.AppSettings[key];
            }
            return returnValue;
        }

    }
}
