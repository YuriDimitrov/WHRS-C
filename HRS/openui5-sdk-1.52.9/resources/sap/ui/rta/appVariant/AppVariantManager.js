/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/appVariant/AppVariantDialog","sap/ui/rta/appVariant/AppVariantUtils","sap/m/MessageToast","sap/ui/fl/FlexControllerFactory","sap/m/MessageBox","sap/ui/rta/Utils","sap/ui/rta/appVariant/Feature","sap/ui/fl/transport/TransportSelection","sap/ui/rta/appVariant/S4HanaCloudBackend","sap/ui/core/BusyIndicator"],function(A,a,M,F,b,R,c,T,S,B){"use strict";var d=function(){};d.prototype._openDialog=function(C,f){var D=new A("appVariantDialog");D.attachCreate(C);D.attachCancel(f);D.open();return D;};d.prototype._prepareAppVariantData=function(D,p){return{idBaseApp:D["sap.ui5"].componentName,idRunningApp:D["sap.app"].id,title:p.title,subTitle:p.subTitle,description:p.description,icon:p.icon,inbounds:D["sap.app"].crossNavigation.inbounds};};d.prototype.createDescriptor=function(o){var s,e=[],p;s=a.getId(o.idBaseApp);var f={id:s,reference:o.idRunningApp};e.push(a.createDescriptorVariant(f));p=a.getInlinePropertyChange("title",o.title);e.push(a.createInlineChange(p,"title"));if(o.subTitle){p=a.getInlinePropertyChange("subtitle",o.subTitle);e.push(a.createInlineChange(p,"subTitle"));}if(o.description){p=a.getInlinePropertyChange("description",o.description);e.push(a.createInlineChange(p,"description"));}p=a.getInlineChangeInputIcon(o.icon);e.push(a.createInlineChange(p,"icon"));var i=a.getInboundInfo(o.inbounds);var C=i.currentRunningInbound;var g=i.addNewInboundRequired;if(C==="customer.savedAsAppVariant"&&g){p=a.getInlineChangeCreateInbound(C);e.push(a.createInlineChange(p,"createInbound"));}p=a.getInlineChangeForInboundPropertySaveAs(C);e.push(a.createInlineChange(p,"inbound"));p=a.getInlineChangeRemoveInbounds(C);e.push(a.createInlineChange(p,"removeInbound"));p=a.getInlineChangesForInboundProperties(C,s,"title",o.title);e.push(a.createInlineChange(p,"inboundTitle"));if(o.subTitle){p=a.getInlineChangesForInboundProperties(C,s,"subTitle",o.subTitle);e.push(a.createInlineChange(p,"inboundSubtitle"));}p=a.getInlineChangesForInboundProperties(C,s,"icon",o.icon);e.push(a.createInlineChange(p,"inboundIcon"));var O=function(t){var h=new T();return h.openTransportSelection(t,this,R.getRtaStyleClassName());};return Promise.all(e).then(function(r){f=r.shift();e=[];r.forEach(function(I){e.push(f.addDescriptorInlineChange(I));});return Promise.all(e);}).then(function(){var n=f._getMap().namespace;var t=a.getTransportInput("",n,"manifest","appdescr_variant");return O.call(this,t);}.bind(this)).then(function(t){return this._onTransportInDialogSelected(f,t);}.bind(this))["catch"](function(E){var h=this._buildErrorMessageText("MSG_CREATE_DESCRIPTOR_FAILED",f._id,E);return this._showErrorMessage(h);}.bind(this));};d.prototype._onTransportInDialogSelected=function(o,t){if(t){if(t.transport&&t.packageName!=="$TMP"){var p=[];if(t.transport){p.push(o.setTransportRequest(t.transport));}if(p.length){return Promise.all(p).then(function(){return Promise.resolve(o);});}}return Promise.resolve(o);}return Promise.resolve(false);};d.prototype.processSaveAsDialog=function(D){return new Promise(function(r,e){var C=function(o){var p=o.getParameters();var g=this._prepareAppVariantData(D,p);r(g);}.bind(this);var f=function(o){e(o);};this._openDialog(C,f);}.bind(this));};d.prototype._showErrorMessage=function(e,s){var t=a.getTextResources();var f=t.getText("HEADER_SAVE_APP_VARIANT_FAILED");B.hide();var C;var g=t.getText("SAVE_APP_VARIANT_CLOSE_TEXT");var h=[];if(e.copyId){C=t.getText("SAVE_APP_VARIANT_COPY_ID_TEXT");h.push(C);}h.push(g);return new Promise(function(r,i){var j=function(k){if(k===g){i();}else if(k===C){a.copyId(s);i();}};b.error(e.text,{icon:b.Icon.ERROR,title:f,onClose:j,actions:h,styleClass:R.getRtaStyleClassName()});});};d.prototype._buildErrorMessageText=function(m,s,e,C){var t=a.getTextResources();var E="";if(e.messages&&e.messages.length){if(e.messages.length>1){e.messages.forEach(function(e){E+=e.text+"\n";});}else{E+=e.messages[0].text;}}else if(e.iamAppId){E+="IAM App Id: "+e.iamAppId;}else{E+=e.stack||e.message||e.status||e;}var f=t.getText(m)+"\n\n"+t.getText("MSG_APP_VARIANT_ID",s)+"\n"+t.getText("MSG_TECHNICAL_ERROR",E);return{text:f,copyId:C};};d.prototype.saveAppVariantToLREP=function(o){return o.submit()["catch"](function(e){var E=this._buildErrorMessageText("MSG_SAVE_APP_VARIANT_FAILED",o._id,e);return this._showErrorMessage(E);}.bind(this));};d.prototype._copyDirtyChangesToAppVariant=function(r,o){var f=F.createForControl(o);return f.saveAs(r);};d.prototype.copyUnsavedChangesToLREP=function(s,r,C){if(C){return this._copyDirtyChangesToAppVariant(s,r)["catch"](function(e){var E=this._buildErrorMessageText("MSG_COPY_UNSAVED_CHANGES_FAILED",s,e);return this._showErrorMessage(E);}.bind(this));}else{return Promise.resolve(true);}};d.prototype.triggerCatalogAssignment=function(o){if(a.isS4HanaCloud(o._oSettings)){return a.triggerCatalogAssignment(o._id,o._reference)["catch"](function(e){var E=this._buildErrorMessageText("MSG_CATALOG_ASSIGNMENT_FAILED",o._id,e);return this._showErrorMessage(E);}.bind(this));}else{return Promise.resolve(true);}};d.prototype.notifyKeyUserWhenTileIsReady=function(i,s){var o=new S();return o.notifyFlpCustomizingIsReady(i,function(I){var t=a.getTextResources();var m=t.getText("MSG_SAVE_APP_VARIANT_NEW_TILE_AVAILABLE");var e=t.getText("SAVE_APP_VARIANT_NEW_TILE_AVAILABLE_TITLE");return new Promise(function(r){b.show(m,{icon:b.Icon.INFORMATION,title:e,onClose:r,styleClass:R.getRtaStyleClassName()});});})["catch"](function(e){var E=this._buildErrorMessageText("MSG_TILE_CREATION_FAILED",s,e,true);return this._showErrorMessage(E,s);}.bind(this));};d.prototype._buildSuccessMessageText=function(o,C){var t=a.getTextResources();var e=false;var m=t.getText("SAVE_APP_VARIANT_SUCCESS_MESSAGE")+"\n\n";if(a.isS4HanaCloud(o._oSettings)){if(C){m+=t.getText("SAVE_APP_VARIANT_SUCCESS_S4HANA_CLOUD_MESSAGE");}else{m+=t.getText("SAVE_APP_VARIANT_SUCCESS_S4HANA_CLOUD_MESSAGE_OVERVIEW_LIST");}}else if(C){m+=t.getText("SAVE_APP_VARIANT_SUCCESS_S4HANA_ON_PREMISE_MESSAGE",o._id);e=true;}else{m+=t.getText("SAVE_APP_VARIANT_SUCCESS_S4HANA_ON_PREMISE_MESSAGE_OVERVIEW_LIST",o._id);e=true;}return{text:m,copyId:e};};d.prototype._showSaveSuccessMessage=function(s,e){var t=a.getTextResources();var f=t.getText("SAVE_APP_VARIANT_SUCCESS_MESSAGE_TITLE");var C;var o=t.getText("SAVE_APP_VARIANT_OK_TEXT");var g=[];if(s.copyId){C=t.getText("SAVE_APP_VARIANT_COPY_ID_TEXT");g.push(C);}g.push(o);return new Promise(function(r){var h=function(i){if(i===o){r();}else if(i===C){a.copyId(e);r();}};b.show(s.text,{icon:b.Icon.INFORMATION,onClose:h,title:f,actions:g,styleClass:R.getRtaStyleClassName()});});};d.prototype._navigateToFLPHomepage=function(){var o=sap.ushell.services.AppConfiguration.getCurrentApplication();var C=o.componentHandle.getInstance();if(C){var e=sap.ushell.Container.getService("CrossApplicationNavigation");if(e.toExternal){e.toExternal({target:{shellHash:"#"}},C);return Promise.resolve(true);}}return Promise.resolve(false);};d.prototype.showSuccessMessageAndTriggerActionFlow=function(o,C,r){var s=this._buildSuccessMessageText(o,C);return this._showSaveSuccessMessage(s,o._id).then(function(){if(C){return this._navigateToFLPHomepage();}else{return c.onGetOverview(r);}}.bind(this));};return d;},true);
