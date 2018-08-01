/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/DataType','sap/ui/base/ManagedObject','sap/ui/core/CustomData','./mvc/View','./ExtensionPoint','./StashedControlSupport','sap/ui/model/odata/v4/lib/_SyncPromise'],function(q,D,M,C,V,E,S,a){"use strict";function p(t,v,n,c){var B=M.bindingParser(v,c,true);if(B&&typeof B==="object"){return B;}var d=v=B||v;var T=D.getType(t);if(T){if(T instanceof D){d=T.parseValue(v);}}else{throw new Error("Property "+n+" has unknown type "+t);}return typeof d==="string"?M.bindingParser.escape(d):d;}function l(x){return x.localName||x.baseName||x.nodeName;}function u(c){if(c.isRejected()){throw c.getResult();}return c.getResult();}function g(A,c){function s(n,o,m){var e,v,f=[];for(e=n.firstChild;e;e=e.nextSibling){v=c(n,o,m,e);if(v){f.push(u(v));}}return a.resolve(f);}function d(n,o,m){var e,f=Promise.resolve(),h=[];for(e=n.firstChild;e;e=e.nextSibling){f=f.then(c.bind(null,n,o,m,e));h.push(f);}return Promise.all(h);}return A?d:s;}var X={};X.loadTemplate=function(t,e){var r=q.sap.getResourceName(t,"."+(e||"view")+".xml");return q.sap.loadResource(r).documentElement;};X.loadTemplatePromise=function(t,e){var r=q.sap.getResourceName(t,"."+(e||"view")+".xml");return q.sap.loadResource(r,{async:true}).then(function(R){return R.documentElement;});};X.parseViewAttributes=function(x,v,s){var A=v.getMetadata().getAllProperties();for(var i=0;i<x.attributes.length;i++){var c=x.attributes[i];if(c.name==='controllerName'){v._controllerName=c.value;}else if(c.name==='resourceBundleName'){v._resourceBundleName=c.value;}else if(c.name==='resourceBundleUrl'){v._resourceBundleUrl=c.value;}else if(c.name==='resourceBundleLocale'){v._resourceBundleLocale=c.value;}else if(c.name==='resourceBundleAlias'){v._resourceBundleAlias=c.value;}else if(c.name==='class'){v.addStyleClass(c.value);}else if(!s[c.name]&&A[c.name]){s[c.name]=p(A[c.name].type,c.value,c.name,v._oContainingView.oController);}}};X.enrichTemplateIds=function(x,v){X.enrichTemplateIdsPromise(x,v,false);return x;};X.enrichTemplateIdsPromise=function(x,v,A){return b(x,v,true,A).then(function(){return x;});};X.parseTemplate=function(x,v){return u(X.parseTemplatePromise(x,v,false));};X.parseTemplatePromise=function(x,v,A,P){return b(x,v,false,A,P);};function b(x,v,c,A,P){var r=[],d=a.resolve();A=A&&sap.ui.getCore().getConfiguration().getXMLProcessingMode()==="sequential";q.sap.log.debug("XML processing mode is "+(A?"sequential":"default"),"","XMLTemplateProcessor");var f=sap.ui.getCore().getConfiguration().getDesignMode();if(f){v._sapui_declarativeSourceInfo={xmlNode:x,xmlRootNode:v._oContainingView===v?x:v._oContainingView._sapui_declarativeSourceInfo.xmlRootNode};}var s=v.sViewName||v._sFragmentName;if(!s){var t=v;var L=0;while(++L<1000&&t&&t!==t._oContainingView){t=t._oContainingView;}s=t.sViewName;}if(v.isSubView()){o(x,true);}else{if(x.localName==="View"&&x.namespaceURI!=="sap.ui.core.mvc"){q.sap.log.warning("XMLView root node must have the 'sap.ui.core.mvc' namespace, not '"+x.namespaceURI+"'"+(s?" (View name: "+s+")":""));}w(x);}var i=0;function h(){for(;i<r.length;i++){var e=r[i];if(e&&typeof e.then==='function'){return e.then(k).then(h);}}return r;}function k(e){var j=[i,1].concat(e);Array.prototype.splice.apply(r,j);}return d.then(h);function m(I){return I;}function n(I){return v._oContainingView.createId(I);}function o(x,R,I){if(x.nodeType===1){var e=l(x);if(x.namespaceURI==="http://www.w3.org/1999/xhtml"||x.namespaceURI==="http://www.w3.org/2000/svg"){r.push("<"+e+" ");var j=false;for(var i=0;i<x.attributes.length;i++){var J=x.attributes[i];var K=J.value;if(J.name==="id"){j=true;K=G(v,x);}r.push(J.name+"=\""+q.sap.encodeHTML(K)+"\" ");}if(R===true){r.push("data-sap-ui-preserve"+"=\""+v.getId()+"\" ");if(!j){r.push("id"+"=\""+v.getId()+"\" ");}}r.push(">");var N=x;if(window.HTMLTemplateElement&&x instanceof HTMLTemplateElement&&x.content instanceof DocumentFragment){N=x.content;}w(N);r.push("</"+e+">");}else if(e==="FragmentDefinition"&&x.namespaceURI==="sap.ui.core"){w(x,false,true);}else{d=d.then(function(){return B(x).then(function(T){for(var i=0;i<T.length;i++){var U=T[i];if(v.getMetadata().hasAggregation("content")){v.addAggregation("content",U);}else if(v.getMetadata().hasAssociation(("content"))){v.addAssociation("content",U);}}return T;});});r.push(d);}}else if(x.nodeType===3&&!I){var O=x.textContent||x.text,Q=l(x.parentNode);if(O){if(Q!="style"){O=q.sap.encodeHTML(O);}r.push(O);}}}function w(x,R,I){var e=x.childNodes;for(var i=0;i<e.length;i++){o(e[i],R,I);}}function y(N,e){var j;var I=sap.ui.getCore().getLoadedLibraries();q.each(I,function(O,Q){if(N===Q.namespace||N===Q.name){j=Q.name+"."+((Q.tagNames&&Q.tagNames[e])||e);}});j=j||N+"."+e;function J(K){if(!K){q.sap.log.error("Control '"+j+"' did not return a class definition from sap.ui.define.","","XMLTemplateProcessor");K=q.sap.getObject(j);}if(!K){q.sap.log.error("Can't find object class '"+j+"' for XML-view","","XMLTemplateProcessor");}return K;}var R=q.sap.getResourceName(j,"");var K=sap.ui.require(R);if(!K){if(A){return new Promise(function(O){sap.ui.require([R],function(K){K=J(K);O(K);});});}else{K=sap.ui.requireSync(R);K=J(K);}}return K;}function z(e){if(e.namespaceURI==="http://www.w3.org/1999/xhtml"||e.namespaceURI==="http://www.w3.org/2000/svg"){var j=e.attributes['id']?e.attributes['id'].textContent||e.attributes['id'].text:null;if(c){return X.enrichTemplateIdsPromise(e,v,A).then(function(){return[];});}else{var I=function(K){var N={id:j?G(v,e,j):undefined,xmlNode:e,containingView:v._oContainingView};if(v.fnScopedRunWithOwner){return v.fnScopedRunWithOwner(function(){return new K(N);});}return new K(N);};if(A){return new Promise(function(K,N){sap.ui.require(["sap/ui/core/mvc/XMLView"],function(J){K([I(J)]);});});}else{var J=sap.ui.requireSync("sap/ui/core/mvc/XMLView");return a.resolve([I(J)]);}}}else{return B(e);}}function B(e){if(l(e)==="ExtensionPoint"&&e.namespaceURI==="sap.ui.core"){if(c){return a.resolve([]);}else{var j=v instanceof V?v._oContainingView:v;return a.resolve(E(j,e.getAttribute("name"),function(){var J=a.resolve();var K=[];var N=e.childNodes;for(var i=0;i<N.length;i++){var O=N[i];if(O.nodeType===1){J=J.then(z.bind(null,O));K.push(J);}}return a.all(K).then(function(Q){var R=[];Q.forEach(function(T){R=R.concat(T);});return R;});}));}}else{var I=y(e.namespaceURI,l(e));if(I&&typeof I.then==='function'){return I.then(function(J){return F(e,J);});}else{return F(e,I);}}}function F(I,J){var K=I.namespaceURI,N={},O="",Q=[],R=null,T=null;if(!J){return a.resolve([]);}var U=J.getMetadata();var W=U.getAllSettings();if(!c){for(var i=0;i<I.attributes.length;i++){var Y=I.attributes[i],Z=Y.name,$=W[Z],_=Y.value;if(Z==="id"){N[Z]=G(v,I,_);}else if(Z==="class"){O+=_;}else if(Z==="viewName"){N[Z]=_;}else if(Z==="fragmentName"){N[Z]=_;N['containingView']=v._oContainingView;}else if((Z==="binding"&&!$)||Z==='objectBindings'){var a1=M.bindingParser(_,v._oContainingView.oController);if(a1){N.objectBindings=N.objectBindings||{};N.objectBindings[a1.model||undefined]=a1;}}else if(Z==='metadataContexts'){var b1=null;try{b1=X._calculatedModelMapping(_,v._oContainingView.oController,true);}catch(e){q.sap.log.error(v+":"+e.message);}if(b1){N.metadataContexts=b1;if(X._preprocessMetadataContexts){X._preprocessMetadataContexts(J.getMetadata().getName(),N,v._oContainingView.oController);}}}else if(Z.indexOf(":")>-1){if(Y.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"){var c1=l(Y);Q.push(new C({key:c1,value:p("any",_,c1,v._oContainingView.oController)}));}else if(Y.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1"){T=_;}else if(Z.indexOf("xmlns:")!==0){if(!R){R={};}if(!R.hasOwnProperty(Y.namespaceURI)){R[Y.namespaceURI]={};}R[Y.namespaceURI][l(Y)]=Y.nodeValue;q.sap.log.debug(v+": XMLView parser encountered unknown attribute '"+Z+"' (value: '"+_+"') with unknown namespace, stored as sap-ui-custom-settings of customData");}}else if($&&$._iKind===0){N[Z]=p($.type,_,Z,v._oContainingView.oController);}else if($&&$._iKind===1&&$.altTypes){N[Z]=p($.altTypes[0],_,Z,v._oContainingView.oController);}else if($&&$._iKind===2){var a1=M.bindingParser(_,v._oContainingView.oController);if(a1){N[Z]=a1;}else{q.sap.log.error(v+": aggregations with cardinality 0..n only allow binding paths as attribute value (wrong value: "+Z+"='"+_+"')");}}else if($&&$._iKind===3){N[Z]=n(_);}else if($&&$._iKind===4){N[Z]=_.split(/[\s,]+/g).filter(m).map(n);}else if($&&$._iKind===5){var d1=V._resolveEventHandler(_,v._oContainingView.oController);if(d1){N[Z]=d1;}else{q.sap.log.warning(v+": event handler function \""+_+"\" is not a function or does not exist in the controller.");}}else if($&&$._iKind===-1){if(V.prototype.isPrototypeOf(J.prototype)&&Z=="async"){N[Z]=p($.type,_,Z,v._oContainingView.oController);}else{q.sap.log.warning(v+": setting '"+Z+"' for class "+U.getName()+" (value:'"+_+"') is not supported");}}else{if(X._supportInfo){X._supportInfo({context:I,env:{caller:"createRegularControls",error:true,info:"unknown setting '"+Z+"' for class "+U.getName()}});}}}if(R){Q.push(new C({key:"sap-ui-custom-settings",value:R}));}if(Q.length>0){N.customData=Q;}}var e1=g(A,f1);function f1(I,g1,h1,i1,j1){var k1;if(i1.nodeType===1){if(i1.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1"){N[l(i1)]=i1.querySelector("*");return;}k1=i1.namespaceURI===K&&h1&&h1[l(i1)];if(k1){return e1(i1,k1);}else if(g1){if(!j1&&i1.getAttribute("stashed")==="true"&&!c){S.createStashedControl(G(v,i1),{sParentId:N["id"],sParentAggregationName:g1.name,fnCreate:function(){var j=A;A=false;try{return u(f1(I,g1,h1,i1,true));}finally{A=j;}}});return;}return z(i1).then(function(l1){for(var j=0;j<l1.length;j++){var m1=l1[j];var n1=g1.name;if(g1.multiple){if(!N[n1]){N[n1]=[];}if(typeof N[n1].path==="string"){N[n1].template=m1;}else{N[n1].push(m1);}}else{N[n1]=m1;}}return l1;});}else if(l(I)!=="FragmentDefinition"||I.namespaceURI!=="sap.ui.core"){throw new Error("Cannot add direct child without default aggregation defined for control "+U.getElementName());}}else if(i1.nodeType===3){if(q.trim(i1.textContent||i1.text)){throw new Error("Cannot add text nodes as direct child of an aggregation. For adding text to an aggregation, a surrounding html tag is needed: "+q.trim(i1.textContent||i1.text));}}}var g1=U.getDefaultAggregation();var h1=U.getAllAggregations();return e1(I,g1,h1).then(function(){var j;if(c&&I.hasAttribute("id")){H(v,I);}else if(!c){if(V.prototype.isPrototypeOf(J.prototype)&&typeof J._sType==="string"){var i1=function(){return sap.ui.view(N,undefined,J._sType);};if(v.fnScopedRunWithOwner){j=v.fnScopedRunWithOwner(i1);}else{j=i1();}}else{var j1=function(){if(v.fnScopedRunWithOwner){return v.fnScopedRunWithOwner(function(){return new J(N);});}else{return new J(N);}};if(P&&P.fnRunWithPreprocessor){j=P.fnRunWithPreprocessor(j1);}else{j=j1();}}if(O&&j.addStyleClass){j.addStyleClass(O);}}if(!j){j=[];}else if(!Array.isArray(j)){j=[j];}if(X._supportInfo&&j){for(var i=0,k1=j.length;i<k1;i++){var l1=j[i];if(l1&&l1.getId()){var m1=X._supportInfo({context:I,env:{caller:"createRegularControls",nodeid:I.getAttribute("id"),controlid:l1.getId()}}),n1=T?T+",":"";n1+=m1;X._supportInfo.addSupportInfo(l1.getId(),n1);}}}if(f){j.forEach(function(l1){if(U.getCompositeAggregationName){var o1=I.getElementsByTagName(l1.getMetadata().getCompositeAggregationName());for(var i=0;i<o1.length;i++){I.removeChild(o1[0]);}}l1._sapui_declarativeSourceInfo={xmlNode:I,xmlRootNode:v._sapui_declarativeSourceInfo.xmlRootNode,fragmentName:U.getName()==='sap.ui.core.Fragment'?N['fragmentName']:null};});}return j;});}function G(v,x,I){if(x.getAttributeNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1","id")){return x.getAttribute("id");}else{return n(I?I:x.getAttribute("id"));}}function H(v,x){x.setAttribute("id",n(x.getAttribute("id")));x.setAttributeNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1","id",true);}}X._preprocessMetadataContexts=null;X._calculatedModelMapping=function(B,c,A){var o,m={},d=M.bindingParser(B,c);function e(f){if(f.length%2===0){throw new Error("The last entry is no binding");}for(var i=1;i<=f.length;i=i+2){if(typeof f[i-1]=='string'){throw new Error("Binding expected not a string");}if(f[i]){if((typeof f[i]!='string')||(f[i]!=",")){throw new Error("Missing delimiter ','");}}}}if(d){if(!d.formatter){o=d;d={parts:[o]};}else{e(d.formatter.textFragments);}for(var i=0;i<d.parts.length;i++){o=d.parts[i];m[o.model]=m[o.model]||(A?[]:null);if(Array.isArray(m[o.model])){m[o.model].push(o);}else{m[o.model]=o;}}}return m;};return X;},true);
