sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/cons/controller/Common"
], function (Controller, History, MessageToast, Export, ExportTypeCSV, Common) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.ReportSalesByContragent", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("reportactivities").attachPatternMatched(this._onObjectMatched, this);

            var oModel = this.getOwnerComponent().getModel('consModel');
            this.getView().setModel(oModel);
        },
        _onObjectMatched: function (oEvent) {
            var oModel = new sap.ui.model.json.JSONModel({
                editButtonsVisible: false,
                filter: { 'test': 'test' }// 'test'
            });

            var a = this.getOwnerComponent().getModel('consModel');
            var data = a.getProperty('/Activities/ID');

            this.getView().setModel(oModel, 'vModel');

            //oTable.bindAggregation("rows", {                
            //    parameters: {
            //        custom: {test: 'text'}
            //    }
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
        },
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var model = this.getOwnerComponent().getModel('consModel');
            exportGridAsXLS(this.getView().byId('salesByContragentTable'), model);
        },
        onRefreshActivities: function () {
            var oTable = this.getView().byId('activitiesTable');

            var params = oTable.mBindingInfos.rows.parameters;
            params.custom = { test: "WOOOl" };

            var bindingInfo = oTable.mBindingInfos;
            var bindingInfoRows = bindingInfo.rows;
            oTable.unbindRows();
            oTable.bindRows(bindingInfoRows);

            var model = this.getOwnerComponent().getModel('consModel').refresh(true);
            oTable.getBinding("rows").refresh(true);
        },
        onCbRegionChange: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {

                var filter = new sap.ui.model.Filter({
                    filters: [
                      new sap.ui.model.Filter("R_Name", sap.ui.model.FilterOperator.Contains, sQuery),
                      new sap.ui.model.Filter("R_Code", sap.ui.model.FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });

                aFilters.push(filter);
                //var filterName = new sap.ui.model.Filter("R_Name", sap.ui.model.FilterOperator.Contains, sQuery);
                //aFilters.push(filterName);

                //var filterCode = new sap.ui.model.Filter("R_Code", sap.ui.model.FilterOperator.Contains, sQuery);
                //aFilters.push(filterCode);
            }

            // update list binding
            var list = this.getView().byId("cbRegion");
            var binding = list.getBinding("items");
            binding.filter(aFilters, "Application");

            //var model = this.getOwnerComponent().getModel('consModel');
            //model.attachBatchRequestCompleted(function (list) {
                
              //  list.open();
            //});
        },        
        onCBContragentChange: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {

                var filter = new sap.ui.model.Filter({
                    filters: [
                      new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery),
                      new sap.ui.model.Filter("Code", sap.ui.model.FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });

                aFilters.push(filter);               
            }

            // update list binding
            var list = this.getView().byId("cbContragent");
            var binding = list.getBinding("items");
            binding.filter(aFilters, "Application");
        },
        onCBDistrContragentsChange: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {

                var filter = new sap.ui.model.Filter({
                    filters: [
                      new sap.ui.model.Filter("DC_Name", sap.ui.model.FilterOperator.Contains, sQuery),
                      new sap.ui.model.Filter("DC_ContrID", sap.ui.model.FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });

                aFilters.push(filter);
            }

            // update list binding
            var list = this.getView().byId("cbDistrContragents");
            var binding = list.getBinding("items");
            binding.filter(aFilters, "Application");
        },
        onDataRefresh: function () {
            this.ReloadReport();
        },
        ReloadReport: function () {
            MessageToast.show("TODO Reload Data");
            var oTable = this.getView().byId('salesByContragentTable');

            var params = oTable.mBindingInfos.rows.parameters;
            //custom: {'fromDate': null,'toDate': null,'regionID': null,'territoryCode': null,'contrCode': null,'distrContrCode': null,'groupID': null,'itemCode': null}
            var fromDate = this.getView().byId("fromDateDP").getValue();            
            var toDate = this.getView().byId("toDateDP").getDateValue();
            var contrCode = this.getView().byId("cbContragent").getSelectedKey();
            var distrContrCode = this.getView().byId("cbDistrContragents").getSelectedKey();
            var groupID = this.getView().byId("cbItemGroup").getSelectedKey();
            var itemCode = this.getView().byId("cbItem").getSelectedKey();
            var regionID = this.getView().byId("cbRegion").getSelectedKey();
            var territoryCode = this.getView().byId("cbTerritory").getSelectedKey();

            params.custom.fromDate = fromDate;
            params.custom.toDate = toDate;
            params.custom.contrCode = contrCode;
            params.custom.distrContrCode = distrContrCode;
            params.custom.groupID = groupID;
            params.custom.itemCode = itemCode;
            params.custom.regionID = regionID;
            params.custom.territoryCode = territoryCode;

            var bindingInfo = oTable.mBindingInfos;
            var bindingInfoRows = bindingInfo.rows;
            oTable.unbindRows();
            oTable.bindRows(bindingInfoRows);

            var model = this.getOwnerComponent().getModel('consModel').refresh(true);
            oTable.getBinding("rows").refresh(true);
        }
    });
});