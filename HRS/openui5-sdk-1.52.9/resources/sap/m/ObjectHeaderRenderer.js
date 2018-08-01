/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/library','sap/m/library','sap/ui/Device'],function(q,C,c,l,D){"use strict";var T=c.TextDirection;var B=l.BackgroundDesign;var a=c.TitleLevel;var O={};O._isEmptyObject=function(o){if(!o){return true;}if((!o._isEmpty||!o._isEmpty())&&(!o.getVisible||o.getVisible())){return false;}return true;};O._isEmptyArray=function(A){if(A){for(var i=0;i<A.length;i++){if(!O._isEmptyObject(A[i])){return false;}}}return true;};O._isEmptyRow=function(L,r){return O._isEmptyObject(L)&&O._isEmptyArray(r);};O._renderObjects=function(r,o,b){for(var i=0;i<o.length;i++){if(o[i]instanceof C){this._renderChildControl(r,b,o[i]);}}};O._computeChildControlsToBeRendered=function(o){o.__controlsToBeRendered={};var b=o.getAttributes();for(var i=0;i<b.length;i++){o.__controlsToBeRendered[b[i].getId()]=b[i];}b=o.getStatuses();for(var i=0;i<b.length;i++){o.__controlsToBeRendered[b[i].getId()]=b[i];}var d=o.getFirstStatus();if(d){o.__controlsToBeRendered[d.getId()]=d;}d=o.getSecondStatus();if(d){o.__controlsToBeRendered[d.getId()]=d;}d=o.getAggregation("_objectNumber");if(d){o.__controlsToBeRendered[d.getId()]=d;}};O._cleanupNotRenderedChildControls=function(r,o){for(var i in o.__controlsToBeRendered){r.cleanupControlWithoutRendering(o.__controlsToBeRendered[i]);}delete o.__controlsToBeRendered;};O._getMarkers=function(o){return o._getVisibleMarkers();};O._renderIntro=function(r,o,i,I){if(o.getIntroActive()){o._introText=new sap.m.Link(o.getId()+"-intro");o._introText.setText(o.getIntro());o._introText.setHref(o.getIntroHref());o._introText.setTarget(o.getIntroTarget());o._introText.press=o.introPress;}else{o._introText=new sap.m.Text(o.getId()+"-intro");o._introText.setText(o.getIntro());o._introText.setMaxLines(3);}o._introText.setTextDirection(o.getIntroTextDirection());r.write("<div");r.addClass(i);if(o.getIntroActive()){r.addClass(I);}r.writeClasses();r.write(">");this._renderChildControl(r,o,o._introText);r.write("</div>");};O._renderAttribute=function(r,o,A,f){r.write("<div");r.addClass("sapMOHAttr");r.writeClasses();if(f){r.addStyle("width","100%");r.writeStyles();}r.write(">");this._renderChildControl(r,o,A);r.write("</div>");};O._getVisibleStatuses=function(o){var v=[];if(o.getFirstStatus()&&o.getFirstStatus().getVisible()){v.push([o.getFirstStatus()]);}if(o.getSecondStatus()&&o.getSecondStatus().getVisible()){v.push([o.getSecondStatus()]);}if(o.getStatuses()){var s=o.getStatuses();for(var i=0;i<s.length;i++){if(!s[i].getVisible||s[i].getVisible()){if(s[i]instanceof sap.m.ObjectStatus||s[i]instanceof sap.m.ProgressIndicator){v.push([s[i]]);}else{q.sap.log.warning("Only sap.m.ObjectStatus or sap.m.ProgressIndicator are allowed in \"sap.m.ObjectHeader.statuses\" aggregation."+" Current object is "+s[i].constructor.getMetadata().getName()+" with id \""+s[i].getId()+"\"");}}}}return v;};O._getVisibleAttribsAndStatuses=function(o){var r=[],A=o.getAttributes(),v=[];for(var j=0;j<A.length;j++){if(A[j].getVisible()){v.push(A[j]);}}var V=this._getVisibleStatuses(o);r[0]=v;r[1]=V;return r;};O._renderRow=function(r,o,L,R){if(O._isEmptyRow(L,R)){return;}r.write("<div");r.addClass("sapMOHAttrRow");r.writeClasses();r.write(">");if(!O._isEmptyObject(L)){this._renderAttribute(r,o,L,O._isEmptyArray(R));}else if(O._isEmptyObject(L)&&!O._isEmptyArray(R)){if(R[0]instanceof sap.m.ProgressIndicator){r.write("<div");r.addClass("sapMOHAttr");r.writeClasses();r.write(">");r.write("</div>");}}if(!O._isEmptyArray(R)){r.write("<div");if(R[0]instanceof sap.m.ProgressIndicator){r.addClass("sapMOHStatusFixedWidth");}else if(R[0]instanceof sap.m.ObjectMarker){r.addClass("sapMOHStatusFixedWidth");r.addClass("sapMObjStatusMarker");}else{r.addClass("sapMOHStatus");}r.writeClasses();r.write(">");O._renderObjects(r,R,o);r.write("</div>");}r.write("</div>");};O._renderAttributesAndStatuses=function(r,o){var A=o.getAttributes();var v=[];for(var j=0;j<A.length;j++){if(A[j].getVisible()){v.push(A[j]);}}var i=v.length;var m=[];var M=O._getMarkers(o);if(!o.getResponsive()&&!O._isEmptyArray(M)){m.push(M);}var V=this._getVisibleStatuses(o);m=m.concat(V);var b=m.length;var n=i>b?i:b;if(!o.getResponsive()){for(var d=0;d<n;d++){this._renderRow(r,o,v[d],m[d]);}}};O._renderNumber=function(r,o){var n=o.getAdditionalNumbers();if(!o.getNumber()&&(n&&!n.length)){return;}r.write("<div");r.writeAttribute("id",o.getId()+"-numberdiv");r.addClass("sapMOHNumberDiv");r.writeClasses();r.write(">");var b=o.getAggregation("_objectNumber");if(b&&b.getNumber()){b.setTextDirection(o.getNumberTextDirection());this._renderChildControl(r,o,b);}r.write("</div>");if(!o.getCondensed()){this._renderAdditionalNumbers(r,o);}};O._renderAdditionalNumbers=function(r,o){var n=o.getAdditionalNumbers();if(n&&!n.length){return;}if(n.length===1){r.write("<div");r.addClass("additionalOHNumberSeparatorDiv");r.writeClasses();r.write("></div>");}for(var i=0;i<n.length;i++){r.write("<div");r.writeAttribute("id",o.getId()+"-additionalNumber"+i);r.addClass("sapMOHNumberDiv additionalOHNumberDiv");if(n.length===1){r.addClass("sapMOHOnlyANumber");}r.writeClasses();r.write(">");n[i].setTextDirection(o.getNumberTextDirection());this._renderChildControl(r,o,n[i]);r.write("</div>");}};O._renderTitle=function(r,o){o._oTitleArrowIcon.setVisible(o.getShowTitleSelector());if(o.getShowTitleSelector()&&o._oTitleArrowIcon.getVisible()){r.write("<div");r.addClass("sapMOHTitleAndArrow");r.writeClasses();r.write(">");}if(o.getTitle()){var t=(o.getTitleLevel()===a.Auto)?a.H1:o.getTitleLevel();o._titleText.setText(o.getTitle());o._titleText.setTextDirection(o.getTitleTextDirection());if(o.getTitleActive()){r.write("<a");if(o.getTitleHref()){r.writeAttributeEscaped("href",o.getTitleHref());if(o.getTitleTarget()){r.writeAttributeEscaped("target",o.getTitleTarget());}}r.writeAccessibilityState({role:"link",haspopup:!o.getTitleHref()});}else{r.write("<div");}r.writeAttribute("id",o.getId()+"-title");r.addClass("sapMOHTitle");if(o.getTitleActive()){r.writeAttribute("tabindex","0");r.addClass("sapMOHTitleActive");}if(o.getShowTitleSelector()){r.addClass("sapMOHTitleFollowArrow");}r.writeClasses();r.write(">");r.write("<"+t+">");this._renderChildControl(r,o,o._titleText);r.write("</"+t+">");if(o.getTitleActive()){r.write("</a>");}else{r.write("</div>");}}if(o.getShowTitleSelector()){r.write("<span");r.addClass("sapMOHTitleArrow");r.writeClasses();r.write(">");this._renderChildControl(r,o,o._oTitleArrowIcon);r.write("</span>");}if(o.getShowTitleSelector()&&o._oTitleArrowIcon.getVisible()){r.write("</div>");}};O._renderFullTitle=function(r,o){var n=o.getAdditionalNumbers();if(!o.getNumber()&&(n&&!n.length)){r.addClass("sapMOHTitleDivFull");}};O._renderFullOH=function(r,o){var L=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(o.getIntro()){this._renderIntro(r,o,"sapMOHIntro","sapMOHIntroActive");}r.write("<div");r.addClass("sapMOHTopRow");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",o.getId()+"-titlediv");r.addClass("sapMOHTitleDiv");if(o._hasIcon()){r.addClass("sapMOHTitleIcon");}this._renderFullTitle(r,o);r.writeClasses();r.write(">");if(o._hasIcon()){r.write("<div");r.addClass("sapMOHIcon");if(o.getIconActive()){r.writeAttribute("tabindex","0");r.addClass("sapMPointer");r.writeAccessibilityState({role:"link",haspopup:true,label:L.getText("OH_ARIA_ICON")});}r.writeClasses();r.write(">");this._renderChildControl(r,o,o._getImageControl());r.write("</div>");}this._renderTitle(r,o);r.write("</div>");this._renderNumber(r,o);r.write("<div class=\"sapMOHDivider\"></div>");r.write("</div>");if(o._hasBottomContent()){r.write("<div");r.addClass("sapMOHBottomRow");r.writeClasses();r.write(">");this._renderAttributesAndStatuses(r,o);r.write("<div class=\"sapMOHDivider\"></div>");r.write("</div>");}};O._renderCondensedOH=function(r,o){r.write("<div");r.writeAttribute("id",o.getId()+"-titlediv");r.addClass("sapMOHTitleDiv");this._renderFullTitle(r,o);r.writeClasses();r.write(">");this._renderTitle(r,o);r.write("</div>");this._renderNumber(r,o);var f=o.getAttributes()[0];if(f&&!f._isEmpty()){this._renderAttribute(r,o,f);}};O.render=function(r,o){if(o.getResponsive()){this._renderResponsive(r,o);return;}this._computeChildControlsToBeRendered(o);var b=o.getCondensed();r.write("<div");r.writeControlData(o);r.addClass("sapMOH");if(o._getBackground()!==B.Transparent){r.addClass("sapContrastPlus");}if(b){r.addClass("sapMOHC");}r.addClass("sapMOHBg"+o._getBackground());r.writeClasses();var t=o.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.writeAccessibilityState({role:"region",labelledby:{value:o.getId()+"-titleText-inner",append:true}});r.write(">");if(b){this._renderCondensedOH(r,o);}else{this._renderFullOH(r,o);}r.write("<div class=\"sapMOHLastDivider\"></div>");r.write("</div>");this._cleanupNotRenderedChildControls(r,o);};O._renderChildControl=function(r,o,b){r.renderControl(b);if(!o.getResponsive()&&o.__controlsToBeRendered){o.__controlsToBeRendered[b.getId()]=undefined;}};O._renderResponsive=function(r,o){var s=this._hasResponsiveStates(o),t=this._hasResponsiveTabs(o),h=o.getHeaderContainer();r.write("<div");r.addClass("sapMOHROuter");r.writeClasses();var b=o.getTooltip_AsString();if(b){r.writeAttributeEscaped("title",b);}r.writeAccessibilityState({role:"region",labelledby:{value:o.getId()+"-txt",append:true}});r.writeControlData(o);r.write(">");r.write("<div");r.addClass("sapMOHR");if(o._getBackground()!==B.Transparent){r.addClass("sapContrastPlus");}if(t){r.addClass("sapMOHRNoBorder");}r.addClass("sapMOHRBg"+o._getBackground());r.writeClasses();r.write(">");r.write("<div");if(D.system.desktop&&o._isMediaSize("Desktop")&&o.getFullScreenOptimized()&&o._iCountVisAttrStat>=1&&o._iCountVisAttrStat<=3){r.addClass("sapMOHRStatesOneOrThree");}r.writeClasses();r.write(">");this._renderResponsiveTitleBlock(r,o);if(s){this._renderResponsiveStates(r,o);}r.write("</div>");if(t){this._renderResponsiveTabs(r,o);}r.write("</div>");if(h&&h instanceof sap.m.IconTabBar){this._renderChildControl(r,o,h);}r.write("</div>");if(!o.getTitle()){if(!o.getBinding("title")){q.sap.log.warning("The title shouldn't be empty!");}}};O._renderResponsiveTitleBlock=function(r,o){var L=sap.ui.getCore().getLibraryResourceBundle("sap.m");r.write("<div");r.writeAttribute("id",o.getId()+"-titlenumdiv");r.addClass("sapMOHRTitleNumberDiv");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",o.getId()+"-titlediv");r.addClass("sapMOHRTitleDiv");if(o._hasIcon()){if(D.system.phone||o._isMediaSize("Phone")){if(D.orientation.landscape||(o._isMediaSize("Phone")&&!D.system.phone)){r.addClass("sapMOHRTitleIcon");}}else{r.addClass("sapMOHRTitleIcon");}}if(!o.getNumber()){r.addClass("sapMOHRTitleDivFull");}r.writeClasses();r.write(">");this._renderResponsiveTitle(r,o);if(o._hasIcon()){r.write("<div");r.writeAttribute("id",o.getId()+"-titleIcon");r.addClass("sapMOHRIcon");if((D.system.phone&&D.orientation.portrait)){r.addClass("sapMOHRHideIcon");}if(o.getIconActive()){r.addClass("sapMPointer");r.writeAttribute("tabindex","0");r.writeAccessibilityState({role:"link",haspopup:true,label:L.getText("OH_ARIA_ICON")});}r.writeClasses();r.write(">");this._renderChildControl(r,o,o._getImageControl());r.write("</div>");}r.write("</div>");this._renderResponsiveNumber(r,o);r.write("</div>");};O._renderResponsiveStates=function(r,o){r.write("<div");r.writeAttribute("id",o.getId()+"-states");r.addClass("sapMOHRStates");r.writeClasses();r.write(">");this._renderResponsiveRow(r,o);r.write("</div>");};O._renderResponsiveRow=function(r,o){var v=[];v=this._getVisibleAttribsAndStatuses(o);var V=v[0].concat(v[1]),i=v[0].length,b=V.length,R=1,s='';if(b===0){return;}if(D.system.desktop){if(!o.getFullScreenOptimized()){if(b>=1&&b<=4){R=2;s='sapMOHRTwoCols';}if(b>=5){R=3;s='sapMOHRThreeCols';}}else{if(b>=1&&b<=3){R=1;s='sapMOHROneCols';}if(b>=4){R=4;s='sapMOHRFourCols';}}}if((D.system.tablet&&!D.system.desktop)||(D.system.desktop&&o._isMediaSize("Tablet"))){if(!o.getFullScreenOptimized()||(D.orientation.portrait&&o.getFullScreenOptimized())){R=2;s='sapMOHRTwoCols';}else{if(o.getFullScreenOptimized()&&(D.orientation.landscape||(D.system.desktop&&o._isMediaSize("Tablet")))){if(b>=1&&b<=2){R=2;s='sapMOHRTwoCols';}if(b>=3){R=3;s='sapMOHRThreeCols';}}}}if(D.system.phone||(D.system.desktop&&o._isMediaSize("Phone"))){R=1;s='sapMOHROneCols';}this._renderResponsiveStatesColumn(r,o,R,V,i,s);};O._renderResponsiveStatesColumn=function(r,o,R,v,b,s){var d=Math.floor(v.length/R);var e=v.length%R;var f=0;var g=1;for(var i=0;i<v.length;i++){if(f==0){r.write("<div");r.addClass("sapMOHRStatesCont"+g);r.addClass(s);r.writeClasses();r.write(">");}if(i<b){this._renderResponsiveAttribute(r,o,v[i]);}else{this._renderResponsiveStatus(r,o,v[i]);}f++;if((f==d&&g>e)||(f==(d+1)&&g<=e)||i==v.length-1){r.write("</div>");f=0;g++;}}};O._renderResponsiveAttribute=function(r,o,A){r.write("<div");r.addClass("sapMOHRAttr");r.writeClasses();r.write(">");this._renderChildControl(r,o,A);r.write("</div>");};O._renderResponsiveStatus=function(r,o,s){r.write("<div");r.addClass("sapMOHRStatus");r.writeClasses();r.write(">");this._renderChildControl(r,o,s[0]);r.write("</div>");};O._renderResponsiveMarkers=function(r,o){var m=[],t=o.getTitleTextDirection(),p=sap.ui.getCore().getConfiguration().getRTL();m=o._getVisibleMarkers();r.write("<span");r.addClass("sapMObjStatusMarker");if((t===T.LTR&&p)||(t===T.RTL&&!p)){r.addClass("sapMObjStatusMarkerOpposite");}r.writeClasses();r.writeAttribute("id",o.getId()+"-markers");r.write(">");for(var i=0;i<m.length;i++){this._renderChildControl(r,o,m[i]);}r.write("</span>");};O._renderResponsiveNumber=function(r,o){var b=o.getAggregation("_objectNumber");if(b&&b.getNumber()){b.setTextDirection(o.getNumberTextDirection());this._renderChildControl(r,o,b);}};O._hasResponsiveStates=function(o){var A=o.getAttributes(),v=[];if(!(o._hasAttributes()||o._hasStatus())){o._iCountVisAttrStat=0;return false;}for(var j=0;j<A.length;j++){if(A[j].getVisible()){v.push(A[j]);}}var V=this._getVisibleStatuses(o);o._iCountVisAttrStat=v.length+V.length;return!!(v.length+V.length);};O._hasResponsiveTabs=function(o){var h=o.getHeaderContainer(),i;if(h){if(h instanceof sap.m.IconTabBar){i=h._getIconTabHeader();if(i.getVisible()){o._iCountVisTabs=i.getItems().length;return!!i.getItems().length;}}else if(h.getMetadata().getName()==="sap.m.HeaderContainer"){return!!h.getContent().length;}else if(h.getMetadata().getName()==="sap.suite.ui.commons.HeaderContainer"){return!!h.getItems().length;}}return false;};O._renderResponsiveTabs=function(r,o){var h=o.getHeaderContainer(),i;r.write("<div class=\"sapMOHRTabs"+(h instanceof sap.m.IconTabBar?" sapMOHRTabsITB":"")+"\">");if(h){if(h instanceof sap.m.IconTabBar){i=h._getIconTabHeader();this._renderChildControl(r,o,i);h._bHideHeader=true;}else if(h.getMetadata().getName()==="sap.m.HeaderContainer"||h.getMetadata().getName()==="sap.suite.ui.commons.HeaderContainer"){this._renderChildControl(r,o,h);}else{q.sap.log.warning("The control "+h+" is not supported for aggregation \"headerContainer\"");}}r.write("</div>");};O._renderResponsiveTitle=function(r,o){var n;o._oTitleArrowIcon.setVisible(o.getShowTitleSelector());r.write("<div");r.writeAttribute("id",o.getId()+"-title");r.addClass("sapMOHRTitle");if(o.getTitle().length&&o.getTitleActive()){r.addClass("sapMOHRTitleActive");}if(o.getShowTitleSelector()){r.addClass("sapMOHRTitleFollowArrow");}r.writeClasses();r.write(">");if((D.system.phone&&D.orientation.portrait)){n=50;}else{n=80;}r.write("<div");r.writeAttribute("id",o.getId()+"-title-arrow");r.addStyle("display","inline-block");r.writeStyles();r.write(">");this._renderResponsiveTitleAndArrow(r,o,n);r.write("</div>");if(o.getIntro()){this._renderIntro(r,o,"sapMOHRIntro","sapMOHRIntroActive");}r.write("</div>");};O._rerenderTitle=function(r,o,n){var i=o.getId();this._renderResponsiveTitleAndArrow(r,o,n);r.flush(q.sap.byId(i+"-title-arrow"));};O._renderResponsiveTitleAndArrow=function(r,o,n){var s,e='',t=o.getTitleTextDirection();var m=!!o._getVisibleMarkers().length;var b=(o.getTitleLevel()===a.Auto)?a.H1:o.getTitleLevel();r.write("<"+b+">");r.write("<span");r.addClass("sapMOHRTitleTextContainer");r.writeClasses();if(t!=T.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.write(">");if(o.getTitle().length&&o.getTitleActive()){r.write("<a");if(o.getTitleHref()){r.writeAttributeEscaped("href",o.getTitleHref());if(o.getTitleTarget()){r.writeAttributeEscaped("target",o.getTitleTarget());}}r.writeAttribute("tabindex","0");r.writeAccessibilityState({role:"link",haspopup:!o.getTitleHref()});}else{r.write("<span");}r.writeAttribute("id",o.getId()+"-txt");r.addClass("sapMOHRTitleText");r.writeClasses();r.write(">");r.write("<span");r.addClass("sapMOHRTitleTextWrappable");r.writeClasses();r.write(">");if(o.getTitle().length>n){s=o.getTitle().substr(0,n).trim();e='...';}else{s=o.getTitle();}if(m){var d=s.substr(s.lastIndexOf(" ")+1);var f=s.substr(0,s.lastIndexOf(" ")+1);if(d.length===1){d=s;f='';}r.writeEscaped(f);r.write("</span>");r.writeEscaped(d);r.write(e);if(o.getTitleActive()){r.write("</a>");}else{r.write("</span>");}this._renderResponsiveMarkers(r,o);r.write("</span>");}else{if(!e){r.writeEscaped(s);}else{r.writeEscaped(s+e);}if(o.getTitleActive()){r.write("</span></a></span>");}else{r.write("</span></span></span>");}}if(o.getShowTitleSelector()){r.write("<span");r.addClass("sapMOHRTitleArrow");r.writeClasses();r.write(">");this._renderChildControl(r,o,o._oTitleArrowIcon);r.write("</span>");}r.write("</"+b+">");};O._rerenderResponsiveStates=function(r,o){var i=o.getId(),v=this._getVisibleAttribsAndStatuses(o),V=v[0].concat(v[1]),b=v[0].length,d=V.length,R=1,s='';if(d===0){return;}if(D.orientation.portrait){R=2;s='sapMOHRTwoCols';}else{if(d>=1&&d<=2){R=2;s='sapMOHRTwoCols';}if(d>=3){R=3;s='sapMOHRThreeCols';}}this._renderResponsiveStatesColumn(r,o,R,V,b,s);r.flush(q.sap.byId(i+"-states")[0]);};return O;},true);
