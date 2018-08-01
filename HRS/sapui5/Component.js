sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel", 
	"sap/ui/cons/controller/HelloDialog",
	"sap/ui/Device"
], function (UIComponent, JSONModel, HelloDialog, Device) {
    "use strict";
    return UIComponent.extend("sap.ui.cons.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            var oData = {
                baseUrl: sap.ui.getCore().AppContext.baseURL
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel, "appSettings");

            // Odata v2
            // Header requirement: https://archive.sap.com/discussions/thread/3674882
            var host = location.origin;
            var baseUrl = sap.ui.getCore().AppContext.baseURL;
            var oModel2 = new sap.ui.model.odata.v2.ODataModel(baseUrl + "/odata/", {
                json: true,
                maxDataServiceVersion: "2.0",
                useBatch: false,
                defaultCountMode: "Inline",
                defaultBindingMode: "TwoWay",
                defaultUpdateMethod: "Put"
                //headers: {
                //    "myHeader1": "value1",
                //    "myHeader2": "value2"
                //}
            });

            this.setModel(oModel2, "consModel");

            // set dialog
            this._helloDialog = new HelloDialog(this.getRootControl());
            var a = this.getModel("i18n");
            // create the views based on the url/hash
            var router = this.getRouter();
            router.initialize();

            // set device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");
        },
        exit: function () {
            this._helloDialog.destroy();
            delete this._helloDialog;
        },

        openHelloDialog: function () {
            this._helloDialog.open();
        },
        getContentDensityClass : function() {
            if (!this._sContentDensityClass) {
                if (!sap.ui.Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });
});