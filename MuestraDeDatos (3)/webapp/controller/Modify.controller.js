sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("DevMuestraDeDatos.controller.Modify", {
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("modify").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.id = oEvent.getParameter('arguments');
		},
		modificarCampos: function() {
			var fecha = this.byId("inputFecha").getDateValue();
			var denom1 = this.byId("inputDenom1").getValue();
			var denom2 = this.byId("inputDenom2").getValue();
			var estado = this.byId("inputEstado").getValue();
			var tipo = this.byId("inputTipo").getValue();
			var cuit = this.byId("inputCUIT").getValue();
			var adeudamiento = this.byId("inputAdeuda").getValue();

			var entrada = {
				"Id":this.id.empleadoPath,
				"Fecha": fecha,
				"Denom1": denom1,
				"Denom2": denom2,
				"Estado": estado,
				"Tipo": tipo,
				"Cuit": cuit,
				"Adeudado": adeudamiento
			};

			//No encontre una manera mas linda de verificar que todos los campos esten con contenido :(
			if (fecha !== "" && denom1 !== "" && denom2 !== "" && estado !== "" && tipo !== "" && cuit !== "" &&
				adeudamiento !== "") {
				var odataModel = this.getView().getModel();
				var key = odataModel.createKey("/ZEMPLEADOSSet", {Id: this.id.empleadoPath.toString()});
				odataModel.update(key, entrada, {
					success: function(oata) {
						alert("Se modificaron los atributos del empleado con exito");
					},
					error:function(odata){
						alert(JSON.parse(odata.responseText).error.message.value);
					}
				});
			} else {
				alert("Hay un/os campo/s sin completar. Verifica bien!");
			}
		}
	});
});