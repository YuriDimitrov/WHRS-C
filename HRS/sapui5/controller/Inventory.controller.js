sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
    "use strict";
    //var templateTile = new sap.m.StandardTile("tileTemplate", {
    //    title: 'Orders'
    //    //number: '{COUNT}',
    //    //info: 'Number of Orders',
    //    //icon: "sap-icon://bar-chart",
    //});
    var chosenCategoryId;
    return Controller.extend("sap.ui.cons.controller.Inventory", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("inventory").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            //var host = location.origin;
            //var baseUrl = sap.ui.getCore().AppContext.baseURL;
            //var param = oEvent.getParameter("arguments");
            //var oModel2 = new sap.ui.model.odata.v2.ODataModel(baseUrl + "/odata/", {
            //    json: true,
            //    maxDataServiceVersion: "2.0",
            //    useBatch: false,
            //    defaultCountMode: "Inline",
            //    defaultBindingMode: "TwoWay",
            //    defaultUpdateMethod: "Put",
            //});

            //this.getView().setModel(oModel2, "viewModel");

            //chosenCategoryId = param.categoryId;
        },
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("info", {}, true);
            }
        },
        onProductSelected: function (oEvent) {            
            var product = oEvent.getSource().getBindingContext("consModel").getObject();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("proddetl", {
                productId: product.product_id_id
            });
        }
    });
});