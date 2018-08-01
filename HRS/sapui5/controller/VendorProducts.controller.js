sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/cons/controller/Common"
], function (Controller, History, JSONModel, MessageToast) {
    "use strict";
    function reloadRatingsList(oHeaderContainer) {
        var ratedProducts = sap.ui.getCore().AppContext.ratedProducts;        
        oHeaderContainer.removeAllContent();
        for (var i = 0; i < ratedProducts.length; i++) {
            var prodInfo = new sap.m.Text({
                text: ratedProducts[i].productName,
                maxLines: 1
            });

            var vendorInfo = new sap.m.Text({
                text: ratedProducts[i].vendorName,
                maxLines: 1
            });

            var ratingIndicator = new sap.m.RatingIndicator({
                maxValue: 5,
                enabled: false,
                value: ratedProducts[i].rating,
                iconSize: "12px"
            });


            var innerVL = new sap.ui.layout.VerticalLayout();
            innerVL.addContent(prodInfo);
            innerVL.addContent(vendorInfo);
            innerVL.addContent(ratingIndicator);

            var image = new sap.m.Image({
                src: sap.ui.getCore().AppContext.baseURL +"/sapui5/images/" + ratedProducts[i].photoPath,
                width: "1rem",
                height: "3rem"
            });

            var button = new sap.m.Button({
                icon: "sap-icon://decline",
                width: "0.025rem",
                type: "Transparent"
            }).addStyleClass("customCloseButton")//.addStyleClass("hidden")
              .attachPress(ratedProducts[i].productId, function (oControlEvent) {
                  var oSource = oControlEvent.getSource();
                  var oData = oSource.mEventRegistry.press["0"].oData;
                  removeRatingFromList(oData);
                  reloadRatingsList(oSource.mEventRegistry.press["0"].oListener);
              }, oHeaderContainer);



            var innerHL = new sap.ui.layout.HorizontalLayout();
            innerHL.addContent(image);
            innerHL.addContent(innerVL);
            innerHL.addContent(button);

            var mainVL = new sap.ui.layout.VerticalLayout({
            }).addStyleClass("sapUiSmallMargin").addStyleClass("headerVerticalLayout");
            //.attachBrowserEvent("pointerover", function () {
            //    var test = $(".customCloseButton").removeClass("hidden");
            //    var a = 1;
            //}).attachBrowserEvent("pointerout", function () {
            //    $(".customCloseButton").addClass("hidden")
            //});

            mainVL.addContent(innerHL);
            oHeaderContainer.addContent(mainVL);
        }
    }
    return Controller.extend("sap.ui.cons.controller.VendorProducts", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("vendorproducts").attachPatternMatched(this._onObjectMatched, this);
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
                maxExpansionDepth: 3,
                serviceUrlParams: {
                    vendorId: param.vendorId,
                    categoryId: param.categoryId
                },
            });

            this.getView().setModel(oModel2, "viewModel");
        },
        getCachedRationg: function(productId) {
            var rating = 0;
            var ratedProducts = sap.ui.getCore().AppContext.ratedProducts;
            var ratingIdx = ratedProducts.findIndex(x => x.productId === productId);
            if (ratingIdx >= 0) {
                var existingRating = ratedProducts[ratingIdx];
                rating = existingRating.rating;
            }
            return rating;
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
        onChangeRating: function (oControlEvent) {
            var product = oControlEvent.getSource().getBindingContext("viewModel").getObject();
            var model = oControlEvent.getSource().getBindingContext("viewModel");
            var vendor = model.oModel.oData["vendors(" + product.vendor_id_id + ")"];            
            var prodRating = { 'productId': product.id, 'productName': product.name, 'vendorId': vendor.id, 'vendorName': vendor.name, 'photoPath': product.photo_path, 'rating': oControlEvent.mParameters.value };
            updateRatingList(prodRating);
                     
            var oHeaderContainer = this.getView().byId('ratingsContainer');
            reloadRatingsList(oHeaderContainer);                     
        },
        onRecommend: function (oEvent) {
            if (sap.ui.getCore().AppContext.ratedProducts.length > 0) {
                if (sap.ui.getCore().AppContext.ratedProducts.length > 40) {

                    MessageToast.show("You have rated too many products. Maximum allowed number is 40.");
                }
                else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("suggestions");
                }
            }
            else {
                MessageToast.show("Please rate atleast one product.");
            }
        },
        onRemoveRatingBtnClick: function (oControlEvent) {
            var product = oControlEvent.getSource();
        }
    });
});