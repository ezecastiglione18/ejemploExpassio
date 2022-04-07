sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("DevTablaConExcel.controller.Main", {
		handleUploadPress: function() {
			var fU = this.getView().byId("fileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];

			// Create a File Reader object
			var reader = new FileReader();
			var excelData = {};

			reader.onload = function (e) {
				var data = e.target.result;
				var workbook = XLSX.read(data, {
					type: "binary"
				});
				workbook.SheetNames.forEach(function(sheetName) {
					// Here is your object for every sheet in workbook
					excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

				});
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(excelData);
				this.getView().setModel(oModel, "modeloTabla");
			}.bind(this);
			reader.readAsBinaryString(file);
		}
	});
});