using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Helpers
{
    public class ConfigUtils
    {
        const string ENTITY_MODEL_NAME = "HRSEntities";

        public static string GetAppConfig(string ConfigName)
        {
            string ConfigValue = null;

            System.Collections.Specialized.NameValueCollection tCfg = (System.Collections.Specialized.NameValueCollection)System.Configuration.ConfigurationManager.GetSection("appSettings");
            ConfigValue = tCfg[ConfigName];

            return ConfigValue;
        }

        public static string GetTemplDBName()
        {
            return GetAppConfig("TemplDBName");
        }

        public static string GetMessagesLogFile()
        {
            return GetAppConfig("MessagesLogFile");
        }

        public static string GetConnSettings(string EntityModelName)
        {
            string SQLConnStr = null;
            string connStr = System.Configuration.ConfigurationManager.ConnectionStrings[EntityModelName /*"MobeeAssetEntities"*/].ToString();
            //string[] tokens;

            //if (connStr != "")
            //{
            //   tokens = connStr.Split('\"');
            //   if (tokens.Length > 1)
            //      SQLConnStr = tokens[1];
            //}
            return connStr;
        }

        public static string GetConnectionString()
        {
            string ConnString = HRS.Helpers.ConfigUtils.GetConnSettings(ENTITY_MODEL_NAME);
            return ConnString;
        }

        public static string GetClientConnectSettings(string ClientDBSuff)
        {
            string newConnString = HRS.Helpers.ConfigUtils.GetConnSettings(ENTITY_MODEL_NAME);
            string DfltName = HRS.Helpers.ConfigUtils.GetTemplDBName();
            newConnString = newConnString.Replace(DfltName, DfltName + ClientDBSuff);

            return newConnString;
        }

        public static string GetClientConnectString(string ClientsDB)
        {
            string connStr = HRS.Helpers.ConfigUtils.GetConnSettings(ENTITY_MODEL_NAME);
            string DfltName = HRS.Helpers.ConfigUtils.GetTemplDBName();
            string newConnString = "";

            string[] tokens;

            if (connStr != "")
            {
                tokens = connStr.Split('\"');
                if (tokens.Length > 1)
                    newConnString = tokens[1].Replace(DfltName, ClientsDB);
            }
            return newConnString;
        }
    }
}
