sap.ui.define([
	"./Base.controller",
	"sap/ui/core/routing/History"
], function(BaseController, History) {
	"use strict";

	return BaseController.extend("EjercicioLicencias.controller.Detalle", {
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detalle").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.licencia = oEvent.getParameter("arguments").licenciaPath;
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(this.licencia),
				model: "licencias"
			});
		},
		navegarParaAtras: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("listalicencias", {}, true);
			}
		},
		grabarContenido: async function() {
			var fechaOtorgamiento = this.byId("inputFechaOtorgamiento").getValue();
			var fechaVencimiento = this.byId("inputFechaVencimiento").getValue();
			var descripcion = this.byId("inputComentarios").getValue();
			
			this.tieneLicencia = false;

			var oModel = this.getView().getModel("asignaciones");

			var userInfo = sap.ushell.Container.getService("UserInfo");
			var sUserId = userInfo.getId();

			var consultor = "juani"; //Deberia ir sUserId, pero como es una app local, nunca se muestra el nombre del user
			//que ingreso sesion. 

			var keyUser = "";
			keyUser = oModel.createKey("/ZASIGNACIONESSet", {
				Consultor: consultor
			});
			
			var oLectura = this.getOdataModel("asignaciones").read(keyUser);
			await oLectura.then(function(odata){
				this.tieneLicencia = true;
			}.bind(this)).catch(function(oerror){
				alert(JSON.parse(oerror.responseText).error.message.value);
			}.bind(this));
			if (fechaOtorgamiento !== "" && fechaVencimiento !== "") {
				if (this.sonFechasValidas()) {
					if (this.tieneLicencia) {
						alert("Tiene licencias");
					} else {
						var posicionLicencia = this.obtenerPosicionLicencia();
						var codigoLicencia = this.obtenerCodigoLicencia(posicionLicencia);
						
						var oAsignacion = {
							"Consultor": consultor.toString(),
							"Licencia": codigoLicencia.toString(),
							"FechaOtorgamiento": this.byId("inputFechaOtorgamiento").getDateValue(),
							"FechaVencimiento": this.byId("inputFechaVencimiento").getDateValue(),
							"Descripcion": descripcion.toString()
						};
						
						oModel.create("/ZASIGNACIONESSet", oAsignacion, {
							success: function(odata) {
								alert("Se ingreso con exito la asignacion!");
							},
							error: function(odata) {
								alert("JSON.parse(odata.responseText).error.message.value");
							}
						});
					}
				} else {
					alert("La fecha de vencimiento no puede ser igual o anterior a la de otorgamiento. Por favor, revise");
				}
			} else {
				alert("La fecha de otorgamiento/vencimiento no puede estar vacia. Por favor, indique una fecha");
			}
		},
		reiniciar: function() {
			var otorgamiento = this.getView().byId("inputFechaOtorgamiento");
			otorgamiento.setValue("");

			var vencimiento = this.getView().byId("inputFechaVencimiento");
			vencimiento.setValue("");

			var descr = this.getView().byId("inputComentarios");
			descr.setValue("");
		},
		sonFechasValidas: function() {
			return this.byId("inputFechaOtorgamiento").getDateValue() < this.byId("inputFechaVencimiento").getDateValue();
		},
		obtenerPosicionLicencia: function() {
			var numero = this.licencia.charAt(12);
			var numeroFinal = numero;
			if (this.licencia.length === 14) {
				var segundoNum = this.licencia.charAt(13);
				numeroFinal = numero + segundoNum;
			}
			return parseInt(numeroFinal, 10);
		},
		obtenerCodigoLicencia: function(oArg) {
			return this.getView().getModel("licencias").getData().Licencias[oArg].Codigo;
		}
	});
});