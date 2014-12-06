/**
 * Script de estructura para el modelo Reporte, funciona para consultar, pasar variables y parámetros a un reporte en detalle.
 *
 * @module app/scripts/models/report
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Backbone = require('backbone');
	var Adapter = require('adapters/adapter');

	var Model = Backbone.Model.extend({

		sync: function(method, model, options) {
			if (method === 'read') {
				Adapter.findReportById(this.id).done(function(data) {
					options.success(data);
				});
			}
		}

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			if (method === 'read') {
				if (typeof this.homeReports !== 'undefined' && this.homeReports.length > 0) {
					Adapter.findReportsByIds(this.homeReports).done(function(data) {
						options.success(data);
					});
				} else if (typeof this.categoryId !== 'undefined') {
					Adapter.findReportsByCategoryId(this.categoryId).done(function(data) {
						options.success(data);
					});
				}
			}
		}

	});

	return {
		Model: Model,
		Collection: Collection
	};

});