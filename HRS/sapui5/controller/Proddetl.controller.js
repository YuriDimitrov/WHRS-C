sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.Proddetl", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("proddetl").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {


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
                    productId: param.productId,
                    $orderby: 'UserAvgRate desc'
                },
            });

            this.getView().setModel(oModel2, "viewModel");
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
        }
    });
});