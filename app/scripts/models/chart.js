/**
 * Script de estructura para el modelo de los gráficos del reporte.
 *
 * @module app/scripts/models/chart
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Backbone = require('backbone');
	var Adapter = require('adapters/adapter');

	var Model = Backbone.Model.extend({
		
	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			if (method === 'read') {
				if (typeof this.idCategory !== 'undefined' && typeof this.idReport !== 'undefined') {
					Adapter.findChartsByReportId(this.idCategory, this.idReport).done(function(data) {
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