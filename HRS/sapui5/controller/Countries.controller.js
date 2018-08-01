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
    return Controller.extend("sap.ui.cons.controller.Countries", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("countries").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            //var jsonModel = new sap.ui.model.json.JSONModel({
            //    categotyId: oEvent.getParameter("arguments")
            //});
            //this.getView().setModel(jsonModel,"viewModel");

            //var oTileContainer = this.getView().byId('container');
            //oTileContainer.setModel(this.getView().getModel("consModel"));
            //var customParam = oEvent.getParameter("arguments");
            //oTileContainer.bindAggregation("tiles", {
            //    path: "/countries",
            //    parameters: {
            //        custom: customParam
            //    },
            //    template: templateTile
            //});
            //var c = oTileContainer.getBindingContext("consModel");
            //var i = oTileContainer.getBindingInfo("consModel");
            //var t = oTileContainer.getBinding("tiles");
            //t.mParameters.custom = { categoryId: '1' }
            //t.sCustomParams = "categoryId: 'categoryId12'";
            //t.refresh(true);

            //this.getView().getModel("consModel").refresh(true);
            //t.refreshAggregation("tiles");

            //var params = oTileContainer.mBindingInfos.tiles.parameters;
            //var categoryId = oEvent.getParameter("arguments");
            //params.custom = { test: 'categoryId' };
                        
            //var bindingInfo = oTileContainer.mBindingInfos;
            //var bindingInfoTiles = bindingInfo.tiles;
            //oTileContainer.tiles = bindingInfoTiles;
           
            //oTileContainer.unbindAggregation();
            //oTileContainer.bindAggregation();

            var host = location.origin;
            var baseUrl = sap.ui.getCore().AppContext.baseURL;
            var param = oEvent.getParameter("arguments");
            var oModel2 = new sap.ui.model.odata.v2.ODataModel(baseUrl + "/odata/", {
                json: true,
                maxDataServiceVersion: "2.0",
                useBatch: false,
                defaultCountMode: "Inline",
                defaultBindingMode: "TwoWay",
                defaultUpdateMethod: "Put",
                serviceUrlParams: {
                    categoryId: param.categoryId
                },
            });

            this.getView().setModel(oModel2, "viewModel");
            
            chosenCategoryId = param.categoryId;
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
        onCountryPress: function (oEvent) {
            var param = oEvent.getParameter("arguments");
            if (chosenCategoryId == undefined) {
                chosenCategoryId = sap.ui.getCore().AppContext.chosenCategory;;
            }
            var country = oEvent.getSource().getBindingContext("viewModel").getObject();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("vendors", {
                countryId: country.id,
                categoryId: chosenCategoryId
            });
        }
    });
});