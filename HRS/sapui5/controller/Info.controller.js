sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.Info", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("info").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            var oModel = new JSONModel({
                HTML: "<span style=\"  margin: auto;               width: 90%;            text-align: center;            position: absolute;            bottom: 0;\">" +
                          "<p>Системата за събиране на данни от дистрибутори е проектирана и изпълнена от:</p>" +
                          "<br />" +
                          "<p>Баркод Системи България ООД</p>" +
                          "<br />" +
                          "<p>Поддръжка</p>" +
                          "<p>+359 882881883</p>" +
                          "<p>software@barcodes.bg</p>" +
                          "<a href=\"http://barcodes.bg/\">www.barcodes.bg</a>" +
                          "<br />" +
                          "<br />" +
                          "<p>Този продукт е защитен по Закона за авторското право и сродните му права.</p>" +
                      "</span>"
            });
            this.getView().setModel(oModel);
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