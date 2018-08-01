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

    return Controller.extend("sap.ui.cons.controller.Suggestions", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("suggestions").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {

            //$.ajax({
            //    type: 'POST',
            //    url: sap.ui.getCore().AppContext.baseURL + 'odata/products/GetSuggestedProducts',
            //    dataType: "json",
            //    data: {
            //        jsonData: sap.ui.getCore().AppContext.ratedProducts
            //    },
            //    cache: false,
            //    success: function (result) {
            //        var reusultVal = result.value;
            //        if (reusultVal.search("ERROR") >= 0) {
            //            alert("Грешка при генерирането на експортния файл.");
            //            return;
            //        }
            //        window.location = BASE_HREF + '/api/Export/DownloadFile?filePath=' + result.value;


            //    }
            //});

            var host = location.origin;
            var baseUrl = sap.ui.getCore().AppContext.baseURL;
            var param = oEvent.getParameter("arguments");
            var ratedProducts = sap.ui.getCore().AppContext.ratedProducts;
            var productRatings = [];
            for (var i = 0; i < ratedProducts.length; i++) {
                productRatings.push({ Key: ratedProducts[i].productId, Value: ratedProducts[i].rating });
            }

            var ratingsStringified = JSON.stringify(productRatings);
            var oModel2 = new sap.ui.model.odata.v2.ODataModel(baseUrl + "/odata/", {
                json: true,
                maxDataServiceVersion: "2.0",
                useBatch: false,
                defaultCountMode: "Inline",
                defaultBindingMode: "TwoWay",
                defaultUpdateMethod: "Put",
                serviceUrlParams: {
                    jsonData: ratingsStringified,
                    $orderby: 'Rate desc'
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