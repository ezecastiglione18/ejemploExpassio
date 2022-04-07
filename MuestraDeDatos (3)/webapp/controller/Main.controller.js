sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("DevMuestraDeDatos.controller.Main", {
		onInit: function() {
			this.empleadoParaMostrar = {};
			this.apretoParaBuscarID = false;
		},
		buscarID: function() {
			this.id = this.byId("inputID").getValue();
			var odataModel = this.getView().getModel();
			var oModelo = new sap.ui.model.json.JSONModel();

			if (this.id === "") {
				alert("Ingrese un ID de empleado");
			} else {
				var idKey = odataModel.createKey("/ZEMPLEADOSSet", {
					Id: this.id.toString()
				});
				odataModel.read(idKey, {
					success: function(odata) {
						var data = [];
						//Se muestra en la tabla
						this.empleadoParaMostrar = {
							"ID": this.id,
							"Fecha": odata.Fecha.toLocaleDateString(),
							"Denominacion1": odata.Denom1,
							"Denominacion2": odata.Denom2,
							"Estado": odata.Estado,
							"Tipo": odata.Tipo,
							"CUIT": odata.Cuit,
							"Adeudado": odata.Adeudado
						};
						data.push(this.empleadoParaMostrar);
						oModelo.setData(data);
						this.getView().setModel(oModelo, "modeloTabla");
						this.apretoParaBuscarID = true;
						alert("Se leyo de la tabla correctamente");
					}.bind(this), //SI SE PIERDE EL SCOPE DEL THIS --> metes un .bind(this)
					error: function(odata) {
						alert("No se encontro ese ID de empleado. Por favor, ingrese otro");
					}
				});
			}
		},
		modificarSegunID: function() {
			if (this.id === "") {
				alert("Ingrese un ID de empleado");
			} else if (this.apretoParaBuscarID === false) {
				alert("Todavia no se verifico que exista un empleado con ese ID");
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("modify", {
					empleadoPath: window.encodeURIComponent(this.id)
				});
			}
		}
	});
});