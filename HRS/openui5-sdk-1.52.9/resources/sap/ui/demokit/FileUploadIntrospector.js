/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','./library','jquery.sap.act'],function(q,C,l){"use strict";var F=C.extend("sap.ui.demokit.FileUploadIntrospector",{metadata:{library:"sap.ui.demokit",properties:{uploadUrl:{type:"string",group:"Misc",defaultValue:null},autoRefreshInterval:{type:"string",group:"Misc",defaultValue:'0'},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null}}}});F.prototype.init=function(){this._aFiles=[];this._iHash=0;q.sap.act.attachActivate(this._activate,this);};F.prototype.exit=function(){q.sap.act.detachActivate(this._activate,this);};F.prototype._activate=function(){this.setAutoRefreshInterval(this.getAutoRefreshInterval());};F.prototype.setAutoRefreshInterval=function(i){this.setProperty("autoRefreshInterval",i);if(this.oTimer){q.sap.clearDelayedCall(this.oTimer);this.oTimer=undefined;}if(i>0){this.oTimer=q.sap.delayedCall(i,this,"_autoRefresh");}};F.prototype.refresh=function(){var t=this;q.getJSON(this.getUploadUrl(),function(d){t._receiveFileList(d);});};F.prototype._autoRefresh=function(){if(this.oTimer){q.sap.clearDelayedCall(this.oTimer);this.oTimer=undefined;}this.refresh();var i=this.getAutoRefreshInterval();if(i>0&&q.sap.act.isActive()){this.oTimer=q.sap.delayedCall(i,this,"_autoRefresh");}};F.prototype._receiveFileList=function(r){if(!this._aFiles||this._iHash!==r.hash){this._aFiles=r.files;this._iHash=r.hash;this.invalidate();}};return F;});
