/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/TreeBinding','./CountMode'],function(q,T,C){"use strict";var O=T.extend("sap.ui.model.odata.ODataTreeBinding",{constructor:function(m,p,c,f,P){T.apply(this,arguments);this.bPendingRequest=false;this.oFinalLengths={};this.oLengths={};this.oKeys={};this.bNeedsUpdate=false;this.bHasTreeAnnotations=this._hasTreeAnnotations();this.oRootContext=null;this.iNumberOfExpandedLevels=P&&P.numberOfExpandedLevels;this.sCountMode=(P&&P.countMode)||this.oModel.sDefaultCountMode;if(!this.bHasTreeAnnotations){if(!P||!P.navigation){q.sap.log.error("A navigation paths parameter object has to be defined");this.oNavigationPaths={};}else{this.oNavigationPaths=P.navigation;}}else{q.sap.log.warning("Tree hierarchy annotations are deprecated and may not work correctly with the sap.ui.model.odata.ODataModel."+" Please use the sap.ui.model.odata.v2.ODataModel (since version 1.28) instead which fully supports hierarchy annotations.");}}});O.prototype.getRootContexts=function(s,l,t){var n=null,r={numberOfExpandedLevels:this.iNumberOfExpandedLevels},R=[],b=true,a=this;if(this.bHasTreeAnnotations){r.level=0;if(!this.bDisplayRootNode){r.level=1;}}else{n=this.oModel.resolve(this.getPath(),this.getContext());r.navPath=this._getNavPath(this.getPath());if(r.numberOfExpandedLevels>0){var A=n;for(var i=0;i<r.numberOfExpandedLevels;i++){var N=this._getNavPath(A);r.navPath+="/"+N;A+="/"+N;}}var I=this.oModel.isList(this.sPath,this.getContext());if(I){this.bDisplayRootNode=true;}else{b=false;this.oModel.createBindingContext(n,null,{expand:r.navPath},function(o){R=[o];if(a.oRootContext!==o){a.oRootContext=o;a._processODataObject(o.getObject(),n,r.navPath);a.bNeedsUpdate=true;}},this.bRefresh);this.bRefresh=false;}}if(b){if(!this.bDisplayRootNode){R=this._getContextsForNodeId(n,0,1,0,r);}else{R=this._getContextsForNodeId(n,s,l,t,r);}}if(!this.bDisplayRootNode&&R.length>0){this.oRootContext=R[0];R=this.getNodeContexts(R[0],s,l,t);}return R;};O.prototype.getNodeContexts=function(c,s,l,t){var n,r={};if(this.bHasTreeAnnotations){var d=c.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);if(d=="leaf"){return[];}n=c.getProperty(this.oTreeProperties["hierarchy-node-for"]);r.level=parseInt(c.getProperty(this.oTreeProperties["hierarchy-level-for"]),10)+1;}else{var N=this._getNavPath(c.getPath());if(!N){return[];}n=this.oModel.resolve(N,c);r.navPath=this.oNavigationPaths[N];}return this._getContextsForNodeId(n,s,l,t,r);};O.prototype.hasChildren=function(c){if(!c){return false;}if(this.bHasTreeAnnotations){var d=c.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);return d==="expanded"||d==="collapsed";}else{var n=this._getNavPath(c.getPath());var p=c.getPath()+"/"+n;return n&&this.oLengths[p]>0;}};O.prototype.getChildCount=function(c){if(this.bHasTreeAnnotations){var h;if(!c){if(this.oRootContext){h=this.oRootContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);}else{h="000000";}}else{h=c.getProperty(this.oTreeProperties["hierarchy-node-for"]);}return this.oLengths[h];}else{if(!c){return this.oLengths[this.getPath()];}return this.oLengths[c.getPath()+"/"+this._getNavPath(c.getPath())];}};O.prototype._getContextsForNodeId=function(n,s,l,t,p){var c=[],L,k;if(!s){s=0;}if(!l){l=this.oModel.iSizeLimit;}if(!t){t=0;}if(this.bHasTreeAnnotations){if(n==null){n="000000";}if(p.level==0){p.level++;}}if(this.oFinalLengths[n]&&this.oLengths[n]<l){l=this.oLengths[n];}if(this.oKeys[n]){for(var i=s;i<s+l;i++){k=this.oKeys[n][i];if(!k){break;}c.push(this.oModel.getContext('/'+k));}}L=c.length!=l&&!(this.oFinalLengths[n]&&c.length>=this.oLengths[n]);if(this.oModel.getServiceMetadata()){if(!this.bPendingRequest&&L){var P=[];if(this.bHasTreeAnnotations){if(p.numberOfExpandedLevels>0){var a=p.level+p.numberOfExpandedLevels;P.push("$filter="+this.oTreeProperties["hierarchy-level-for"]+" le '0"+a+"'");}else{P.push("$filter="+this.oTreeProperties["hierarchy-level-for"]+" eq '0"+p.level+"' and "+this.oTreeProperties["hierarchy-parent-node-for"]+" eq '"+n+"'");}}else{if(p.navPath){P.push("$expand="+p.navPath);}}this._loadSubNodes(n,s,l,t,P,p);}}return c;};O.prototype._getCountForNodeId=function(n,s,l,t,p){var a=this;var P=[];function _(d){a.oFinalLengths[n]=true;a.oLengths[n]=parseInt(d,10);}function b(e){var E="Request for $count failed: "+e.message;if(e.response){E+=", "+e.response.statusCode+", "+e.response.statusText+", "+e.response.body;}q.sap.log.warning(E);}var c;if(this.bHasTreeAnnotations){c=this.oModel.resolve(this.getPath(),this.getContext());P.push("$filter="+this.oTreeProperties["hierarchy-parent-node-for"]+" eq '"+n+"'");}else{c=n;}if(c){var u=this.oModel._createRequestUrl(c+"/$count",null,P);var r=this.oModel._createRequest(u,"GET",false);r.headers["Accept"]="text/plain, */*;q=0.5";this.oModel._request(r,_,b,undefined,undefined,this.oModel.getServiceMetadata());}};O.prototype._loadSubNodes=function(n,s,l,t,p,P){var a=this,I=false;if(s||l){p.push("$skip="+s+"&$top="+l);}if(!a.bHasTreeAnnotations&&!this.oFinalLengths[n]&&(this.sCountMode==C.Inline||this.sCountMode==C.Both)){p.push("$inlinecount=allpages");I=true;}function S(d){if(d.results){if(!a.bHasTreeAnnotations){if(I&&d.__count){a.oLengths[n]=parseInt(d.__count,10);a.oFinalLengths[n]=true;}else{if(a.oModel.isCountSupported()){a._getCountForNodeId(n);}}a.oKeys[n]=[];for(var i=0;i<d.results.length;i++){var E=d.results[i];var k=a.oModel._getKey(E);a._processODataObject(E,"/"+k,P.navPath);a.oKeys[n][i+s]=k;}}else{var L={};for(var i=0;i<d.results.length;i++){var E=d.results[i];n=E[a.oTreeProperties["hierarchy-parent-node-for"]];if(i==0){L[n]=s;}else if(L[n]==undefined){L[n]=0;}if(!(n in a.oKeys)){a.oKeys[n]=[];a._getCountForNodeId(n);}a.oKeys[n][L[n]]=a.oModel._getKey(E);L[n]++;}}}else{a.oKeys[null]=a.oModel._getKey(d);if(!a.bHasTreeAnnotations){a._processODataObject(d,n,P.navPath);}}a.oRequestHandle=null;a.bPendingRequest=false;a.bNeedsUpdate=true;}function c(){a.fireDataReceived();}function e(d){a.oRequestHandle=null;a.bPendingRequest=false;a.fireDataReceived();}function u(h){a.oRequestHandle=h;}if(n){if(!this.oFinalLengths[n]){this.bPendingRequest=true;this.fireDataRequested();var A;if(this.bHasTreeAnnotations){A=this.oModel.resolve(this.getPath(),this.getContext());}else{A=n;}this.oModel._loadData(A,p,S,e,false,u,c);}}};O.prototype.resetData=function(c){if(c){var p=c.getPath();delete this.oKeys[p];delete this.oLengths[p];delete this.oFinalLengths[p];}else{this.oKeys={};this.oLengths={};this.oFinalLengths={};this.oRootContext=null;}};O.prototype.refresh=function(f,c,e){var b=false;if(!f){if(e){var r=this.oModel.resolve(this.sPath,this.oContext);var E=this.oModel.oMetadata._getEntityTypeByPath(r);if(E&&(E.entityType in e)){b=true;}}if(c&&!b){q.each(this.oKeys,function(i,n){q.each(n,function(i,k){if(k in c){b=true;return false;}});if(b){return false;}});}if(!c&&!e){b=true;}}if(f||b){this.resetData();this.bNeedsUpdate=false;this.bRefresh=true;this._fireChange();}};O.prototype.filter=function(f){q.sap.log.warning("Filtering is currently not possible in the ODataTreeBinding");return this;};O.prototype.checkUpdate=function(f,c){var b=false;if(!f){if(this.bNeedsUpdate||!c){b=true;}else{q.each(this.oKeys,function(i,n){q.each(n,function(i,k){if(k in c){b=true;return false;}});if(b){return false;}});}}if(f||b){this.bNeedsUpdate=false;this._fireChange();}};O.prototype._getNavPath=function(p){var a=this.oModel.resolve(p,this.getContext());if(!a){return;}var P=a.split("/"),e=P[P.length-1],n;var c=e.split("(")[0];if(c&&this.oNavigationPaths[c]){n=this.oNavigationPaths[c];}return n;};O.prototype._processODataObject=function(o,p,n){var N=[],t=this;if(n&&n.indexOf("/")>-1){N=n.split("/");n=N[0];N.splice(0,1);}var r=this.oModel._getObject(p);if(Array.isArray(r)){this.oKeys[p]=r;this.oLengths[p]=r.length;this.oFinalLengths[p]=true;}if(n&&o[n]){if(Array.isArray(r)){r.forEach(function(R){var o=t.getModel().getData("/"+R);t._processODataObject(o,"/"+R+"/"+n,N.join("/"));});}else if(typeof r==="object"){t._processODataObject(o,p+"/"+n,N.join("/"));}}};O.prototype._hasTreeAnnotations=function(){var m=this.oModel,M=m.oMetadata,a=m.resolve(this.getPath(),this.getContext()),e=M._getEntityTypeByPath(a),t=M.mNamespaces["sap"],b=this;this.oTreeProperties={"hierarchy-level-for":false,"hierarchy-parent-node-for":false,"hierarchy-node-for":false,"hierarchy-drill-state-for":false};if(!e){q.sap.log.fatal("EntityType for path "+a+" could not be found.");return false;}q.each(e.property,function(i,p){if(!p.extensions){return true;}q.each(p.extensions,function(i,E){var n=E.name;if(E.namespace===t&&n in b.oTreeProperties&&!b.oTreeProperties[n]){b.oTreeProperties[n]=p.name;}});});var c=false;q.each(this.oTreeProperties,function(i,o){if(!o){c=true;return false;}});return!c;};return O;});
