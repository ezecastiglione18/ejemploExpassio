sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/type/Date",
	"sap/ui/core/format/DateFormat"
], function(Controller, JSONModel, Export, ExportTypeCSV, Date, DateFormat) {
	"use strict";

	return Controller.extend("DevCargaDatos.controller.Main", {
		onInit: function() {
			//Aca se definen variables globales
			this.oModelo = new sap.ui.model.json.JSONModel();
			this.data = [];
			this.oTabla = this.getView().byId("tabla1");
			this.filaSeleccionada = "";
			this.cantidadEmpleados = 0;
		},
		guardarEntrada: function() {
			var id = this.byId("inputID").getValue();
			var fecha = this.byId("inputFecha").getDateValue();
			var denom1 = this.byId("inputDenom1").getValue();
			var denom2 = this.byId("inputDenom2").getValue();
			var estado = this.byId("inputEstado").getValue();
			var tipo = this.byId("inputTipo").getValue();
			var cuit = this.byId("inputCUIT").getValue();
			var adeudamiento = this.byId("inputAdeuda").getValue();

			var entrada = {
				"ID": id,
				"Fecha": fecha,
				"Denominacion1": denom1,
				"Denominacion2": denom2,
				"Estado": estado,
				"Tipo": tipo,
				"CUIT": cuit,
				"Adeudado": adeudamiento
			};

			//No encontre una manera mas linda de verificar que todos los campos esten con contenido :(
			if (id !== "" && fecha !== "" && denom1 !== "" && denom2 !== "" && estado !== "" && tipo !== "" && cuit !== "" && adeudamiento !==
				"") {
				var oEmpleado = {
					"Id": this.byId("inputID").getValue().toString(),
					"Fecha": this.byId("inputFecha").getDateValue(),
					"Denom1": this.byId("inputDenom1").getValue().toString(),
					"Denom2": this.byId("inputDenom2").getValue().toString(),
					"Estado": this.byId("inputEstado").getValue().toString(),
					"Tipo": this.byId("inputTipo").getValue().toString(),
					"Cuit": this.byId("inputCUIT").getValue().toString(),
					"Adeudado": this.byId("inputAdeuda").getValue().toString()
				};

				var odataModel = this.getView().getModel();
				var key = odataModel.createKey("/ZEMPLEADOSSet", {Id: this.byId("inputID").getValue().toString()});
				odataModel.create(key, oEmpleado, {
					success: function(oata) {
						alert("Se escribio en tabla");
					},
					error: function(odata) {
						alert(JSON.parse(odata.responseText).error.message.value);
					}
				});
				this.data.push(entrada);
				var oTemplate = new sap.m.ColumnListItem({
					type: sap.m.ListType.Active,
					cells: [
						new sap.m.Label({
							text: "{ID}"
						}),
						new sap.m.Label({
							text: "{Fecha}"
						}),
						new sap.m.Label({
							text: "{Denominacion1}"
						}),
						new sap.m.Label({
							text: "{Denominacion2}"
						}),
						new sap.m.Label({
							text: "{Estado}"
						}),
						new sap.m.Label({
							text: "{Tipo}"
						}),
						new sap.m.Label({
							text: "{CUIT}"
						}),
						new sap.m.Label({
							text: "{Adeudado}"
						})
					]
				});
				this.oModelo.setData(this.data);
				this.getView().setModel(this.oModelo, "modeloTabla");
				this.oTabla.bindAggregation("tabla1", "/", oTemplate);
				this.cantidadEmpleados++;
			} else {
				alert("Compruebe que todos los campos esten llenados");
			}
		},
		borrarFila: function() {
			if (this.filaSeleccionada === "") {
				alert("No se selecciono ninguna fila para borrar");
			} else {
				for (var i = 0; i < this.data.length; i++) {
					if (this.data[i].ID === this.filaSeleccionada.ID) {
						//Elimino 1 registro desde la posicion i
						this.data.splice(i, 1);
						this.oModelo.refresh();
						break;
					}
				}
				var odataModel = this.getView().getModel();
				var key = odataModel.createKey("/ZEMPLEADOSSet", {
					Id: this.filaSeleccionada.ID.toString()
				});
				odataModel.remove(key, {
					success: function(oata) {
						alert("Se borro el campo correctamente de la tabla");
					}
				});
			}
			this.cantidadEmpleados--;
		},
		seleccionFila: function(oEvent) {
			var oItemSeleccionado = oEvent.getParameter("listItem");
			this.filaSeleccionada = oItemSeleccionado.getBindingContext("modeloTabla").getObject();
		},
		guardarTabla: function() {
			var rgb = this.getView().byId("rbg1");
			var indexElegido = rgb.getSelectedIndex();
			indexElegido++;

			var that = this;
			//	var oModeloArgumento = this.getView().getModel("modeloTabla");

			switch (indexElegido) {
				case 1:
					//Elige el formato .txt
					//El primer parametro es el formato a descargar y el segundo es el caracter con el que se separan las filas
					that.descargarArchivo("txt", "|");
					break;

				case 2:
					//Elige el formato .csv
					that.descargarArchivo("csv", ",");
					break;

				case 3:
					//Elige el formato .xlsx
					that.descargarArchivo("xls", "\t");
					break;
				default:
					alert("Debe seleccionar un formato");
			}
		},
		descargarArchivo: function(oArg1, oArg2) {
			var oFile = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: oArg1,
					separatorChar: oArg2
				}),
				models: this.getView().getModel("modeloTabla"),
				rows: {
					path: "/"
				},
				columns: [{
					name: "ID",
					template: {
						content: "{ID}"
					}
				}, {
					name: "Fecha",
					template: {
						content: "{Fecha}"
					}
				}, {
					name: "Denominacion 1",
					template: {
						content: "{Denominacion1}"
					}
				}, {
					name: "Denominacion 2",
					template: {
						content: "{Denominacion2}"
					}
				}, {
					name: "Estado",
					template: {
						content: "{Estado}"
					}
				}, {
					name: "Tipo",
					template: {
						content: "{Tipo}"
					}
				}, {
					name: "CUIT",
					template: {
						content: "{CUIT}"
					}
				}, {
					name: "Adeudado",
					template: {
						content: "{Adeudado}"
					}
				}]
			});
			oFile.saveFile().catch(function(oError) {
				alert("Error descargando el archivo");
			}).then(function() {
				oFile.destroy();
			});
		}
	});
});