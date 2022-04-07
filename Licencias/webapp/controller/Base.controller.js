sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"../utils/odataAPI",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function(Controller, UIComponent, odataAPI, Filter, FilterOperator) {

	"use strict";

	return Controller.extend("EjercicioLicencias.controller.BaseController", {

		getRouter: function() {
			return UIComponent.getRouterFor(this);
		},

		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		setBusy: function(sName, busy) {
			return this.getView().getModel(sName).setProperty('/busy', busy)
		},

		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getOdataModel: function(sName) {

			let oData = new odataAPI(this.getModel(sName));

			return oData
		},

	});

});