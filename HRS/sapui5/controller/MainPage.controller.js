sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.MainPage", {
        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            //var loggedUser = sap.ui.getCore().AppContext.LoggedUser;
            //var context = sap.ui.getCore().AppContext;
            var mainPageModel = new sap.ui.model.json.JSONModel({
                LoggedUser: sap.ui.getCore().AppContext.LoggedUser
            });

            this.getView().setModel(mainPageModel, "mainPageModel");
        },
        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        },
        onExitApp: function(){
            var getUrl = sap.ui.getCore().AppContext.baseURL;
            var logOutUrl = getUrl + "/Account/SignOut";
            window.location.replace(logOutUrl);
        },
        onSideNavButtonPress: function () {
            var viewId = this.getView().getId();
            var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
            var sideExpanded = toolPage.getSideExpanded();

            this._setToggleButtonTooltip(sideExpanded);

            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
        _setToggleButtonTooltip: function (bLarge) {
            var toggleButton = this.getView().byId('sideNavigationToggleButton');
            if (bLarge) {
                toggleButton.setTooltip('Large Size Navigation');
            } else {
                toggleButton.setTooltip('Small Size Navigation');
            }
        },
        onNavToUpload: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("upload");
        },
        onNavToReportActivity: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("reportactivities");
        },
        onNavToReportStock: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("reportstock");
        },
        onNavToInfo: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("info");
        },
        onNavToReportSalesByContragent: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("reportsalesbycontragent");
        },
        onNavToHome: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("menu");
        }
    });
});