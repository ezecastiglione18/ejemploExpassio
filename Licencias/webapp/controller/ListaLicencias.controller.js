sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("EjercicioLicencias.controller.ListaLicencias", {
		onAfterRendering: async function() {
			var oModeloHeader = new sap.ui.model.json.JSONModel();
			var oModel = this.getView().getModel();
			var userInfo = sap.ushell.Container.getService("UserInfo");
			var sUserId = userInfo.getId();
			//ACA SE TRABAJA PARA OBTENER EL HEADER DEL USUARIO
			var idKey;
			await oModel.metadataLoaded().then(function() {
				idKey = oModel.createKey("/USUARIOSSet", {
					Bname: "EXPA_DEV1" //Va sUserId! Mismo caso que con la validacion de licencias
				});
			});
			oModel.read(idKey, {
				success: function(odata) {
					var	entrada = {
						"User_Id": odata.Bname,
						"Nombre": odata.NameFirst,
						"Apellido": odata.NameLast,
						"FechaCreacion": odata.Gltgv.toLocaleDateString(),
						"Email": odata.SmtpAddr
					};
					oModeloHeader.setData(entrada);
				},
				error: function(odata) {
					alert(JSON.parse(odata.responseText).error.message.value);
				}
			});
			this.getView().setModel(oModeloHeader,"modeloUser");
		},
		verDetalle: function(oEvent) {
			var oLicencia = oEvent.getSource();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detalle", {
				licenciaPath: window.encodeURIComponent(oLicencia.getBindingContext("licencias").getPath().substr(1))
					//oLicencia.getBindingContext("licencias").getPath().substr(1) = String "Licencias/i", siendo
					//i la posicion de la lista que se selecciono ==> De aca se sabe la licencia que apreto
			});
		}
	});
});