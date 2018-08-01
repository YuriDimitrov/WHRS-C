/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";function u(c){if(!c){return'';}return c.replace(/^\/\*\*+/,'').replace(/\*+\/$/,'').replace(/(^|\r\n|\r|\n)([ \t*]*[ \t]*)/g,'$1');}var r=/((?:^|\r\n|\r|\n)[ \t]*@)([a-zA-Z][-_a-zA-Z0-9]*)/g;function D(c){this.comment=c=u(c);this.tags=[];var m;var l=0;var a="description";while((m=r.exec(c))!=null){this._addTag(a,c.slice(l,m.index));a=m[2];l=r.lastIndex;}this._addTag(a,c.slice(l));}D.prototype._addTag=function(t,c){if(/^(public|private|protected)$/.test(t)){this.visibility=t;}else if(/^(classdesc|description|deprecated|experimental|since|name|alias|type)$/.test(t)){this[t]=q.trim(c);}else if(t==="class"){c=q.trim(c);if(c.split(/\s+/).length>1){this.classdesc=c;}}else{this.tags.push({tag:t,content:q.trim(c)});}};D.prototype.isPublic=function(){return this.visibility==='public';};D.get=function(n){var c=null;var l=n.leadingComments;if(q.isArray(l)){for(var i=0;i<l.length;i++){if(l[i].value&&/^\*/.test(l[i].value)){c=l[i].value;}}}return c?new D(c):null;};return D;},true);
