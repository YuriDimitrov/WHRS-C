/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/LrepConnector","sap/ui/fl/Utils"],function(L,U){"use strict";var C=function(){};C._isOn=true;C._entries={};C._switches={};C._oFlexDataPromise=undefined;C.getSwitches=function(){return C._switches;};C.isActive=function(){return C._isOn;};C.setActive=function(a){C._isOn=a;};C.getFlexDataPromise=function(){return C._oFlexDataPromise;};C.getEntries=function(){return C._entries;};C.clearEntries=function(){C._entries={};};C.getEntry=function(c,a){if(!C._entries[c]){C._entries[c]={};}if(!C._entries[c][a]){C._entries[c][a]={file:{changes:{changes:[],contexts:[]}}};}return C._entries[c][a];};C.clearEntry=function(c,a){C.getEntry(c,a);C._entries[c][a]={};};C._deleteEntry=function(c,a){if(C._entries[c]&&C._entries[c][a]){delete C._entries[c][a];}if(jQuery.isEmptyObject(C._entries[c])){delete C._entries[c];}};C.getChangesFillingCache=function(l,c,p){if(!this.isActive()){return l.loadChanges(c,p);}var s=c.name;var a=c.appVersion||U.DEFAULT_APP_VERSION;var o=C.getEntry(s,a);if(o.promise){return o.promise;}var b=C._getChangesFromBundle(p);if(p&&p.cacheKey==="<NO CHANGES>"){return b.then(function(f){return{changes:{changes:f,contexts:[]},componentClassName:s};});}var d=l.loadChanges(c,p).then(function(r){return r;},function(E){var f=jQuery.sap.formatMessage("flexibility service is not available:\nError message: {0}",E.status);jQuery.sap.log.error(f);return Promise.resolve({changes:{changes:[],contexts:[],variantSection:{},settings:{}}});});var e=Promise.all([b,d]).then(function(v){var f=v[0];var m=v[1];if(m&&m.changes){if(m.changes.settings&&m.changes.settings.switchedOnBusinessFunctions){m.changes.settings.switchedOnBusinessFunctions.forEach(function(V){C._switches[V]=true;});}m.changes.changes=f.concat(m.changes.changes);}o.file=m;return o.file;},function(f){C._deleteEntry(s,a);throw f;});o.promise=e;C._oFlexDataPromise=e;return e;};C._getChangesFromBundle=function(p){var c=p&&p.appName;if(!c){return Promise.resolve([]);}var r=jQuery.sap.getResourceName(p.appName,"/changes/changes-bundle.json");var b=jQuery.sap.isResourceLoaded(r);if(b){return Promise.resolve(jQuery.sap.loadResource(r));}else{if(!sap.ui.getCore().getConfiguration().getDebug()){return Promise.resolve([]);}try{return Promise.resolve(jQuery.sap.loadResource(r));}catch(e){jQuery.sap.log.warning("flexibility did not find a changesBundle.json  for the application");return Promise.resolve([]);}}};C.NOTAG="<NoTag>";C.getCacheKey=function(c){if(!c||!c.name||!c.appVersion){jQuery.sap.log.warning("Not all parameters were passed to determine a flexibility cache key.");return Promise.resolve(C.NOTAG);}return this.getChangesFillingCache(new L(),c).then(function(w){if(w&&w.etag){return w.etag;}else{return C.NOTAG;}});};C._getChangeArray=function(c){var s=c.name;var a=c.appVersion||U.DEFAULT_APP_VERSION;var e=C.getEntry(s,a);return e.file.changes.changes;};C.addChange=function(c,o){var a=C._getChangeArray(c);if(!a){return;}a.push(o);};C.updateChange=function(c,o){var a=C._getChangeArray(c);if(!a){return;}for(var i=0;i<a.length;i++){if(a[i].fileName===o.fileName){a.splice(i,1,o);break;}}};C.deleteChange=function(c,o){var a=C._getChangeArray(c);if(!a){return;}for(var i=0;i<a.length;i++){if(a[i].fileName===o.fileName){a.splice(i,1);break;}}};return C;},true);