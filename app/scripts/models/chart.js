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
					require(['adapters/adapter', 'helpers/report', 'jqx'], function(Adapter, Helper) {

						Adapter.findChartsByReportId(self.idCategory, self.idReport).done(function(data) {
							var charts = [];
							$.each(data, function(k, v) {
								var source = v['jqx.dataAdapter'].source;
								if (self.params !== 'undefined') {
									source.data = $.extend(source.data, self.params);
								}

								var dataAdapter = new $.jqx.dataAdapter(v['jqx.dataAdapter'].source, {
									loadComplete: function(records) {
										if (v.widget === 'highcharts') {
											if (typeof records.name !== 'undefined') {
												v.opciones.subtitle.text = records.name;
											}
											if (typeof records.series !== 'undefined') {
												v.opciones.series = records.series;
											}
										} else if (v.widget === 'jqxGrid') {
											var columns = v.opciones.columns;
											var rows = records.rows;
											var gridAdapter = new $.jqx.dataAdapter({
												localdata: rows
											});

											for (var i = 0; i < columns.length; i++) {
												if (columns[i].cellsrenderer !== 'undefined') {
													columns[i].cellsrenderer = Helper[columns[i].cellsrenderer];
												}
											}

											if (v.opciones.groupsrenderer !== 'undefined') {
												v.opciones.groupsrenderer = Helper[v.opciones.groupsrenderer];
											}
											v.opciones.source = gridAdapter;
										}
										charts.push(v);
										if (charts.length === data.length) {
											options.success(charts);
										}
									},
									loadError: function(jqXHR, status, error) {
											//alert('Error! ' + error);
										}
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