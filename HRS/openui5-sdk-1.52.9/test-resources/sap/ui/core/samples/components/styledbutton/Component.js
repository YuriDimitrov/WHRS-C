/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/commons/Button', 'sap/ui/core/UIComponent', 'sap/ui/model/control/ControlModel'],
	function(jQuery, Button, UIComponent, ControlModel) {
	"use strict";


	// new Component
	var Component = UIComponent.extend("samples.components.styledbutton.Component", {

		metadata : {
			properties : {
				text: {	name:"text", type:"string", defaultValue:"Value1" }
			},
			aggregations : {},
			associations : {},
			events : {},
			library: "sap.ui.core.samples.components.styledbutton"
		}
	});


	Component.prototype.init = function(){
		UIComponent.prototype.init.apply(this);
		jQuery.sap.require("sap.ui.model.control.ControlModel");
		this.getRootControl().setModel(new ControlModel(this));
	};

	Component.prototype.createContent = function(){
		return new Button(this.createId("mybutn"), {text: "{text}"});
	};

	return Component;

});
