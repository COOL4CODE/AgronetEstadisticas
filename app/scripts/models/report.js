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
	var LoadingView = require('views/loading');
	var Adapter = require('adapters/adapter');

	var Model = Backbone.Model.extend({

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			var self = this;

			if (method === 'read') {
				if (typeof this.idCategory !== 'undefined') {
					Adapter.findReportsByCategoryId(this.idCategory).done(function(data) {
						data.sort(function(a, b) {
							return a.idReporte - b.idReporte;
						});
						options.success(data);
					});
				} else if (typeof this.searchText !== 'undefined') {
					Adapter.findReportsByTagName(this.searchText).done(function(data) {
						data.sort(function(a, b) {
							return a.idReporte - b.idReporte;
						});
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