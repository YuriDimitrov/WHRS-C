sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/cons/controller/Common"
], function (Controller, History, MessageToast, Common) {
    "use strict";
    return Controller.extend("sap.ui.cons.controller.Upload", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("upload").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            var apiBaseUrl = BASE_HREF;
            var newGuid;
            var oModel = new sap.ui.model.json.JSONModel({
                editButtonsVisible: false,
                apiBaseUrl: apiBaseUrl,
                uniqueID: newGuid,
                processPercent: 0,
                uploadInfo: 'Изберете файл за импорт'
            });
            this.getView().setModel(oModel);
        },
        onFileSelected: function () {
            var uploadBtn = this.getView().byId("uploadBtn")
            uploadBtn.setEnabled(true);

            this.resetMonitor(this.getView());
        },
        onUploadStart: function (oEvent) {
            var fileName = oEvent.mParameters.fileName;
            var oModel = this.getView().getModel();
            var info = oModel.getProperty("/uploadInfo")
            info = info + "\r\nНачало импорт на файл: " + fileName;
            oModel.setProperty("/uploadInfo", info);
        },
        onUploadCompleted: function (oEvent) {
            var responceMsg = oEvent.mParameters.responseRaw;

            var oModel = this.getView().getModel();
            var info = oModel.getProperty("/uploadInfo")
            info = info + "\r\nИмпорта приключи.\r\nРезултат: " + responceMsg;
            oModel.setProperty("/uploadInfo", info);
            	//var sResponse = oEvent.getParameter("response");
			    //if(sResponse) {
				//    var sMsg = "";
				//    var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				//    if (m[1]== "200") {
				//	    sMsg = "Return Code: " + m[1] + "\n" +m[2]+ "(Upload Success)";
				//	    oEvent.getSource().setValue("");
				//    } else {
				//	    sMsg = "Return Code: " +m[1]+ "\n" +m[2]+ "(Upload Error)";
				//    }
                //
				//    MessageToast.show(sMsg);
            	//}
        },
        onUploadBtnPress: function (oEvent) {
            var oFileUploader = this.getView().byId("distrFileUploader");
            if (!oFileUploader.getValue()) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                MessageToast.show(oResourceBundle.getText("_ChooseSupportedFile"));
                return;
            }

            var iterationsCount = 0;
            var taskId = createGuid();
            var currentView = this.getView();
            var oModel = currentView.getModel();
            oModel.setProperty("/uniqueID", taskId);

            var currentController = this;

            // Показваме докъде е стигнал процеса
            var isFailed = false;
            var intervalId = setInterval(function () {

                iterationsCount++;                
                $.ajax({
                    type: "POST",
                    url: BASE_HREF + "/api/Upload/Progress",
                    dataType: "json",
                    data: JSON.stringify({ id: taskId }),
                    //data: {id : taskId},
                    contentType: "application/json",
                    success: function (progress) {
                        console.log('progress = ' + progress);
                        if (progress >= 100) {
                            // при грешка спираме процеса
                            if (progress == 400) {
                                //TODO 
                                currentController.updateMonitor(currentView, taskId, 100, 'Error');
                            }
                            else {
                                currentController.updateMonitor(currentView, taskId, progress, 'Success');
                            }
                            clearInterval(intervalId);
                        }
                        else if (progress == 0) {
                            // ако сме направили повече от 500 итерации и стойността все още е нула
                            // спираме процеса по следене за да не цикли безкрайно ако е настъпила грешка.
                            if (iterationsCount > 500) {
                                clearInterval(intervalId);
                            }
                        }
                        else {
                            currentController.updateMonitor(currentView, taskId, progress, 'Warning');
                        }
                    }
                });
            }, 100);

            oFileUploader.upload();

            var uploadBtn = this.getView().byId("uploadBtn")
            uploadBtn.setEnabled(false);
        },
        updateMonitor: function (currentView, taskId, percent, status) {
            var oView = currentView;
            var progressBar = oView.byId("processTracker");

            var oModel = currentView.getModel();
            oModel.setProperty("/processPercent", percent);

            //progressBar.setPercentValue(percent);
            //progressBar.setDisplayValue(percent + '%');           
            progressBar.setState(status);            
        },
        resetMonitor: function (currentView) {
            var progressBar = this.getView().byId("processTracker");

            var oModel = currentView.getModel();
            oModel.setProperty("/processPercent", 0);
            //progressBar.setPercentValue(0);
            //progressBar.setDisplayValue('0%');
            progressBar.setState('None');
        }
    });
});