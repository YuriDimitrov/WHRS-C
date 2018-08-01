function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function exportGridAsXLS(oTable, model) {
    var colBindings = new Array();
    var colNames = new Array();
    var columns = oTable.mAggregations.columns;
    for (var i = 0; i < columns.length; i++) {
        var currentCol = columns[i];
        var currentColAggregations = currentCol.mAggregations;
        var label = currentColAggregations.label;
        var colName = label.mProperties.text;
        var bindingInfo = currentColAggregations.template.mBindingInfos;
        var colBinding;
        if (bindingInfo.text != null) {
            colBinding = currentColAggregations.template.mBindingInfos.text.parts["0"].path;
        }
        else if (bindingInfo.number != null) {
            colBinding = currentColAggregations.template.mBindingInfos.number.parts["0"].path;
        }
        colNames.push(colName);
        colBindings.push(colBinding);
    }

    uriPath = model.sServiceUrl + oTable.mBindingInfos.rows.path;
    var customParams = oTable.mBindingInfos.rows.parameters.custom;
   
    var params = oTable.mBindingInfos.rows.binding.aFilters;
    var customFilters = oTable.mBindingInfos.rows.parameters.custom;
     
    $.ajax({
        type: 'POST',
        url: uriPath + '/GenerateXLS',
        dataType: "json",
        data: { ColNames: colNames, ColBindings: colBindings, url: uriPath, customFilters: JSON.stringify(customFilters), queryParameters: JSON.stringify(params) },
        cache: false,
        success: function (result) {
            var reusultVal = result.value;
            if (reusultVal.search("ERROR") >= 0) {
                alert("Грешка при генерирането на експортния файл.");
                return;
            }
            window.location = BASE_HREF + '/api/Export/DownloadFile?filePath=' + result.value;

        
        }
    });
}

function updateRatingList (ratedProduct) {
    var ratedProducts = sap.ui.getCore().AppContext.ratedProducts;
    var ratingIdx = ratedProducts.findIndex(x => x.productId === ratedProduct.productId);
    if (ratingIdx >= 0) {        
        var existingRating = ratedProducts[ratingIdx];//.find(x => x.productId === ratedProduct.productId);
        if (ratedProduct.rating == 0) {
            ratedProducts.splice(ratingIdx, 1);
        }
        else {            
            existingRating.rating = ratedProduct.rating;            
            ratedProducts.splice(ratingIdx, 1, existingRating);
        }
    }
    else {
        ratedProducts.splice(0, 0, ratedProduct);
    }
}

function removeRatingFromList(productId){
    var ratedProducts = sap.ui.getCore().AppContext.ratedProducts;
    var ratingIdx = ratedProducts.findIndex(x => x.productId === productId);
    if (ratingIdx >= 0) { 
        ratedProducts.splice(ratingIdx, 1);
    }
}