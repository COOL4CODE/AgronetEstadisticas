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

	var Model = Backbone.Model.extend({

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			var self = this;
			if (method === 'read') {
				if (typeof this.idCategory !== 'undefined' && typeof this.idReport !== 'undefined') {
					require(['adapters/adapter', 'jqx'], function(Adapter) {

						Adapter.findChartsByReportId(self.idCategory, self.idReport).done(function(data) {
							var charts = [];
							$.each(data, function(k, v) {
								var dataAdapter = new $.jqx.dataAdapter(v['jqx.dataAdapter'].source, {
									loadComplete: function(records) {
											if (v.widget === 'highcharts') {
												v.opciones.subtitle.text = records.name;
												v.opciones.series = records.series;
											} else if (v.widget === 'jqxGrid') {
												v.opciones.source = dataAdapter;
											}
											charts.push(v);
											if (charts.length === data.length) {
												options.success(charts);
											}
										}
										//loadError: function(jqXHR, status, error) {},
										//beforeLoadComplete: function(records) {}
								});
								dataAdapter.dataBind();
							});
						});

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