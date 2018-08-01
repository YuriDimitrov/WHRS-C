/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/core/Control','sap/ui/core/mvc/Controller','sap/ui/core/library'],function(q,M,C,a,b){"use strict";var V=b.mvc.ViewType;var c=C.extend("sap.ui.core.mvc.View",{metadata:{library:"sap.ui.core",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},viewName:{type:"string",group:"Misc",defaultValue:null},displayBlock:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},events:{afterInit:{},beforeExit:{},afterRendering:{},beforeRendering:{}},specialSettings:{controller:'sap.ui.core.mvc.Controller',controllerName:'string',preprocessors:'Object',resourceBundleName:'string',resourceBundleUrl:'sap.ui.core.URI',resourceBundleLocale:'string',resourceBundleAlias:'string',type:'string',viewContent:'any',viewData:'any',async:{type:"boolean",defaultValue:false}}}});c._mPreprocessors={};function d(p){p._settings={};for(var P in p){if(P.indexOf("_")!==0){p._settings[P]=p[P];}}}function r(p){if(typeof p.preprocessor==="string"){q.sap.require(p.preprocessor);p.preprocessor=q.sap.getObject(p.preprocessor);}else if(typeof p.preprocessor==="function"&&!p.preprocessor.process){p.preprocessor={process:p.preprocessor};}}function g(L,G){var i,l,O,p=[];for(i=0,l=G.length;i<l;i++){if(G[i]._onDemand){O=G[i];}else{p.push(G[i]);}}for(i=0,l=L.length;i<l;i++){var I=!L[i].preprocessor;if(I&&O){p.unshift(q.extend(L[i],O));}else if(!I){p.push(L[i]);}}return p;}function e(v,s){var i=v.getMetadata().getClass(),G=c._mPreprocessors[i._sType]||{};v.mPreprocessors=q.extend({},s.preprocessors);for(var _ in i.PreprocessorType){var t=i.PreprocessorType[_];if(v.mPreprocessors[t]&&!Array.isArray(v.mPreprocessors[t])){v.mPreprocessors[t]=[v.mPreprocessors[t]];}else if(!v.mPreprocessors[t]){v.mPreprocessors[t]=[];}v.mPreprocessors[t].forEach(d);v.mPreprocessors[t]=g(v.mPreprocessors[t],G[t]||[]);v.mPreprocessors[t].forEach(r);}}function f(v){v.oAsyncState={};v.oAsyncState.promise=null;}c.prototype._initCompositeSupport=function(s){this.oViewData=s.viewData;this.sViewName=s.viewName;var t=this;e(this,s);if(s.async){f(this);}var i=sap.ui.require('sap/ui/core/CustomizingConfiguration');if(i&&i.hasCustomProperties(this.sViewName,this)){this._fnSettingsPreprocessor=function(s){var I=this.getId();if(i&&I){if(t.isPrefixedId(I)){I=I.substring((t.getId()+"--").length);}var l=i.getCustomProperties(t.sViewName,I,t);if(l){s=q.extend(s,l);}}};}var p=function(l,n){var u=sap.ui.require("sap/ui/core/Component");var O=u&&u.getOwnerComponentFor(t);if(O){if(n){t.fnScopedRunWithOwner=t.fnScopedRunWithOwner||function(v){return O.runAsOwner(v);};}return O.runAsOwner(l);}return l();};var A=function(v){if(v.oController&&v.oController.connectToView){return v.oController.connectToView(v);}};var F=function(){if(t.onControllerConnected){return t.onControllerConnected(t.oController);}};if(this.initViewSettings){if(s.async){this.oAsyncState.promise=this.initViewSettings(s).then(function(){return p(h.bind(null,t,s),true);}).then(function(){return p(F,true);}).then(function(){return A(t);}).then(function(){return t.runPreprocessor("controls",t);}).then(function(){return p(t.fireAfterInit.bind(t),true);}).then(function(){return t;});}else{this.initViewSettings(s);var j=h(t,s);if(j instanceof Promise){j.then(function(){return p(F);}).then(function(){A(t);});}else{F();A(t);}this.runPreprocessor("controls",this,true);this.fireAfterInit();}}};c.prototype.getController=function(){return this.oController;};c.prototype.byId=function(i){return sap.ui.getCore().byId(this.createId(i));};c.prototype.createId=function(i){if(!this.isPrefixedId(i)){i=this.getId()+"--"+i;}return i;};c.prototype.getLocalId=function(i){var p=this.getId()+"--";return(i&&i.indexOf(p)===0)?i.slice(p.length):null;};c.prototype.isPrefixedId=function(i){return!!(i&&i.indexOf(this.getId()+"--")===0);};var h=function(t,s){if(!sap.ui.getCore().getConfiguration().getControllerCodeDeactivated()){var i=s.controller,n=i&&typeof i.getMetadata==="function"&&i.getMetadata().getName();if(!i&&t.getControllerName){var j=t.getControllerName();if(j){var l=sap.ui.require('sap/ui/core/CustomizingConfiguration');var p=l&&l.getControllerReplacement(j,M._sOwnerId);if(p){j=typeof p==="string"?p:p.controllerName;}i=sap.ui.controller(j,true);n=j;}}if(i){i=a.extendIfRequired(i,n,!!t.oAsyncState);var u=function(i){t.oController=i;i.oView=t;};if(i instanceof Promise){if(!t.oAsyncState){throw new Error("The view "+t.sViewName+" runs in sync mode and therefore cannot use async controller extensions!");}return i.then(u);}else{u(i);}}}else{t.oController={};}};c.prototype.getViewData=function(){return this.oViewData;};function k(){this.oAsyncState=null;}c.prototype.exit=function(){this.fireBeforeExit();delete this.oController;delete this.oPreprocessorInfo;if(this.oAsyncState){var D=k.bind(this);this.oAsyncState.promise.then(D,D);}};c.prototype.onAfterRendering=function(){this.fireAfterRendering();};c.prototype.onBeforeRendering=function(){this.fireBeforeRendering();};c.prototype.clone=function(i,l){var s={},K,n;for(K in this.mProperties&&!(this.isBound&&this.isBound(K))){if(this.mProperties.hasOwnProperty(K)){s[K]=this.mProperties[K];}}n=C.prototype.clone.call(this,i,l,{cloneChildren:false,cloneBindings:true});var E,p,j;for(E in n.mEventRegistry){p=n.mEventRegistry[E];for(j=p.length-1;j>=0;j--){if(p[j].oListener===this.getController()){p[j]={oListener:n.getController(),fFunction:p[j].fFunction,oData:p[j].oData};}}}n.applySettings(s);return n;};c.prototype.getPreprocessorInfo=function(s){if(!this.oPreprocessorInfo){this.oPreprocessorInfo={name:this.sViewName,componentId:this._sOwnerId,id:this.getId(),caller:this+" ("+this.sViewName+")",sync:!!s};}if(c._supportInfo){this.oPreprocessorInfo._supportInfo=c._supportInfo;}return this.oPreprocessorInfo;};c.prototype.runPreprocessor=function(t,s,S){var v=this.getPreprocessorInfo(S),p=this.mPreprocessors&&this.mPreprocessors[t]||[],j,P,A,n;if(!S){A=function(u){return P(u,v,j);};n=Promise.resolve(s);}for(var i=0,l=p.length;i<l;i++){P=p[i].preprocessor.process;if(S&&p[i]._syncSupport===true){s=P(s,v,p[i]._settings);}else if(!S){j=p[i]._settings;n=n.then(A);}else{q.sap.log.debug("Async \""+t+"\"-preprocessor was skipped in sync view execution for "+this.getMetadata().getClass()._sType+"View",this.getId());}}return S?s:n;};function m(t,v){if(!c._mPreprocessors[v]){c._mPreprocessors[v]={};}if(!c._mPreprocessors[v][t]){c._mPreprocessors[v][t]=[];}}function o(v,s,t){c._mPreprocessors[s][t].forEach(function(p){if(p._onDemand){q.sap.log.error("Registration for \""+t+"\" failed, only one on-demand-preprocessor allowed",v.getMetadata().getName());return false;}});return true;}c.registerPreprocessor=function(t,p,v,s,O,S){if(typeof O!=="boolean"){S=O;O=false;}if(p){m(t,v);if(O&&!o(this,v,t)){return;}c._mPreprocessors[v][t].push({preprocessor:p,_onDemand:O,_syncSupport:s,_settings:S});q.sap.log.debug("Registered "+(O?"on-demand-":"")+"preprocessor for \""+t+"\""+(s?" with syncSupport":""),this.getMetadata().getName());}else{q.sap.log.error("Registration for \""+t+"\" failed, no preprocessor specified",this.getMetadata().getName());}};c.prototype.hasPreprocessor=function(t){return!!this.mPreprocessors[t].length;};sap.ui.view=function(i,v,t){var j=null,l={};if(typeof i==="object"||typeof i==="string"&&v===undefined){v=i;i=undefined;}if(v){if(typeof v==="string"){l.viewName=v;}else{l=v;}}if(i){l.id=i;}if(t){l.type=t;}var n=sap.ui.require('sap/ui/core/CustomizingConfiguration');if(n){var p=n.getViewReplacement(l.viewName,M._sOwnerId);if(p){q.sap.log.info("Customizing: View replacement for view '"+l.viewName+"' found and applied: "+p.viewName+" (type: "+p.type+")");q.extend(l,p);}else{q.sap.log.debug("Customizing: no View replacement found for view '"+l.viewName+"'.");}}if(!l.type){throw new Error("No view type specified.");}else if(l.type===V.JS){var J=sap.ui.requireSync('sap/ui/core/mvc/JSView');j=new J(l);}else if(l.type===V.JSON){var s=sap.ui.requireSync('sap/ui/core/mvc/JSONView');j=new s(l);}else if(l.type===V.XML){var X=sap.ui.requireSync('sap/ui/core/mvc/XMLView');j=new X(l);}else if(l.type===V.HTML){var H=sap.ui.requireSync('sap/ui/core/mvc/HTMLView');j=new H(l);}else if(l.type===V.Template){var T=sap.ui.requireSync('sap/ui/core/mvc/TemplateView');j=new T(l);}else{throw new Error("Unknown view type "+l.type+" specified.");}return j;};c.prototype.loaded=function(){if(this.oAsyncState&&this.oAsyncState.promise){return this.oAsyncState.promise;}else{return Promise.resolve(this);}};c._resolveEventHandler=function(n,i){var H;if(!sap.ui.getCore().getConfiguration().getControllerCodeDeactivated()){switch(n.indexOf('.')){case 0:H=i&&q.sap.getObject(n.slice(1),undefined,i);break;case-1:H=i&&i[n];if(H!=null){break;}default:H=q.sap.getObject(n);}}else{H=function(){};}if(typeof H==="function"){H._sapui_handlerName=n;return[H,i];}};return c;});
