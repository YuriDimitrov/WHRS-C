sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.ReportStock", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("reportstock").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            //this.byId("rating").reset();
            //this.getView().bindElement({
            //    path: "/" + oEvent.getParameter("arguments").invoicePath,
            //    model: "consModel"
            //});
        },
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(HOME_VIEW, {}, true);
            }
        }
    });
});