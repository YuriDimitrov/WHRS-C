﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Services
{
    public interface IConfigService
    {
        string ReadProperty(string key);

        bool HasProperty(string key);
    }
}
