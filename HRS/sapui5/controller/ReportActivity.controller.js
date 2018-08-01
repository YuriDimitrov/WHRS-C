sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/cons/controller/Common"
], function (Controller, History, MessageToast, Export, ExportTypeCSV, Common) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.ReportActivity", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("reportactivities").attachPatternMatched(this._onObjectMatched, this);
                        
            var oModel = this.getOwnerComponent().getModel('consModel');
            this.getView().setModel(oModel);
        },
        _onObjectMatched: function (oEvent) {
            var oModel = new sap.ui.model.json.JSONModel({
                editButtonsVisible: false,
                filter: {'test': 'test'}// 'test'
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
            exportGridAsXLS(this.getView().byId('activitiesTable'), model);
            //var aBoundProperties, aCols, oProperties, oRowBinding, oSettings, oTable, oController;

            //oController = this;

            //if (!this._oTable) {
            //    this._oTable = this.byId("activitiesTable");
            //}

            //oTable = this._oTable;
            //oRowBinding = oTable.getBinding("rows");

            //aCols = this.createColumnConfig();

            //var oModel = oRowBinding.getModel();
            //var oModelInterface = oModel.getInterface();

            //oSettings = {
            //    workbook: { columns: aCols },
            //    dataSource: {
            //        type: "oData",
            //        dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
            //        serviceUrl: oModelInterface.sServiceUrl,
            //        headers: oModelInterface.getHeaders ? oModelInterface.getHeaders() : null,
            //        count: oRowBinding.getLength ? oRowBinding.getLength() : null,
            //        useBatch: oModelInterface.bUseBatch,
            //        sizeLimit: oModelInterface.iSizeLimit
            //    },
            //    worker: false // We need to disable worker because we are using a MockServer as OData Service
            //};

            //new Spreadsheet(oSettings).build();


            //var oModel = this.getOwnerComponent().getModel('consModel');
            //oModel.setSizeLimit(10000);

            //var tableId = this.getView().byId('activitiesTable');

            //this.exportToExcel(tableId, oModel);

            //exportToExcel('activitiesTable',oModel);
            //var oExport = new Export({

            //    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
            //    exportType: new ExportTypeCSV({
            //        separatorChar: ";"
            //    }),

            //    // Pass in the model created above
            //    models: oModel, //this.getView().getModel(),

            //    // binding information for the rows aggregation
            //    rows: {
            //        path: "/Activities",
            //        parameters: {
            //            operationMode: 'Server',                
            //            select: 'ID, Reference, Reference2, UserID, ActivityType, Created, Reference3',
            //        }
                    
            //    },

            //    // column definitions with column name and binding info for the content
            //    columns: [{
            //        name: "i18n/_ARUserID",
            //        template: {
            //            content: "{UserID}"
            //        }
            //    },{
            //        name: "Тип",
            //        template: {
            //            content: "{ActivityType}"
            //    }
            //    }, {
            //        name : "Тип",
            //        template : {
            //            content : {
            //                parts : ["Created"],
            //                formaatOptions: {
            //                    style: 'long',
            //                    source: {pattern: 'yyyy-MM-dd HH:mm:ss'}
            //                }
            //            }
            //        }               
            //    }]
            //});

            //// download exported file
            //oExport.saveFile().catch(function (oError) {
            //    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
            //}).then(function () {
            //    oExport.destroy();
            //    oModel.setSizeLimit(100);
            //});
        },
        exportToExcel: function (table, oModel) {

            var cols = table.getColumns();

            var items = table.getRows();

            var cellId = null;

            var cellObj = null;

            var cellVal = null;

            var headerColId = null;

            var headerColObj = null;

            var headerColVal = null;

            var column = null;

            var json = {}; var colArray = []; var itemsArray= [];

            //push header column names to array

            for(var j=0; j<cols.length;j++){

                column = '';

                column = cols[j];

                //var a = column.sId;//getAggregation('header');
                headerColId = column.sId;

                headerColObj = sap.ui.getCore().byId(headerColId);

                headerColVal = 'test';//headerColObj.getAggregation('label').getProperty("Text");//.getText();

                if(headerColObj.getVisible()){

                    json={name: headerColVal};

                    colArray.push(json);

                }

            }

            itemsArray.push(colArray);

            //push table cell values to array

            for (var i = 0; i < items.length; i++) {

                colArray = [];

                cellId = '';   cellObj = '';  cellVal = '';

                headerColId = null; headerColObj = null; headerColVal = null;

                var item = items[i];

                for(var j=0; j<cols.length;j++){

                    cellId = item.getAggregation('cells')[j].getId();

                    cellObj = sap.ui.getCore().byId(cellId);

                    if(cellObj.getVisible()){

                        if(cellObj instanceof sap.m.Text ||cellObj instanceof sap.m.Label ||cellObj instanceof sap.m.Link) cellVal = cellObj.getText();

                        if(cellObj instanceof sap.m.ObjectNumber){

                            var k = cellObj.getUnit();

                            cellVal = cellObj.getNumber()+ ' ' +k;

                        }

                        if(cellObj instanceof sap.m.ObjectIdentifier){

                            var objectIdentifierVal = '';

                            if(cellObj.getTitle() != undefined && cellObj.getTitle() != '' && cellObj.getTitle() != null )

                                objectIdentifierVal = cellObj.getTitle();

                            if(cellObj.getText() != undefined && cellObj.getText() != '' && cellObj.getText() != null )

                                objectIdentifierVal = objectIdentifierVal+' '+cellObj.getText();

                      

                            cellVal = objectIdentifierVal;

                        }

                        if(cellObj instanceof sap.ui.core.Icon){

                            if(cellObj.getTooltip() != undefined && cellObj.getTooltip() != '' && cellObj.getTooltip() != null )

                                cellVal = cellObj.getTooltip();

                        }

                        if(j==0){

                            json={ name:  '\r'+cellVal};

                        }

                        else

                        {

                            json={ name:  cellVal};

                        }

                        colArray.push(json);

                    }

                }

                itemsArray.push(colArray);

          

          

            }

            //export json array to csv file

            var oExport = new sap.ui.core.util.Export({

                // Type that will be used to generate the content. Own ExportType’s can be created to support other formats

                exportType: new sap.ui.core.util.ExportTypeCSV({

                    separatorChar: ';'

                }),

                // Pass in the model created above

                models: oModel,

                // binding information for the rows aggregation

                rows: {

                    path: '/'

                },

                // column definitions with column name and binding info for the content

                columns: [itemsArray]

            });

          oExport.saveFile().always(function() {

                this.destroy();

          });

        }
        , onRefreshActivities: function () {
            var oTable = this.getView().byId('activitiesTable');

            //var params = oTable.mBindingInfos.rows.parameters;
            //params.custom = { test: "WOOOl", test2: '1', test3: '0.2' };

            var bindingInfo = oTable.mBindingInfos;
            var bindingInfoRows = bindingInfo.rows;
            oTable.unbindRows();
            oTable.bindRows(bindingInfoRows);           

            var model = this.getOwnerComponent().getModel('consModel').refresh(true);
            oTable.getBinding("rows").refresh(true);

    }
    });
});