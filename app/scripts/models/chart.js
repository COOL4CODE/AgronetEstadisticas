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
	var LoadingView = require('views/loading');
	var Helper = require('helpers/report');

	var Model = Backbone.Model.extend({

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			var self = this;
			if (method === 'read') {
				if (typeof this.idCategory !== 'undefined' && typeof this.idReport !== 'undefined') {
					require(['adapters/adapter', 'jqx/jqx-all'], function(Adapter) {

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
											/*if (records !== 'undefined') {
												v.opciones = $.extend(v.opciones, records);
											}*/
											if (typeof records.subtitle !== 'undefined' && records.subtitle !== "" && records.subtitle !== null) {
												v.opciones.subtitle.text = records.subtitle;
											}
											if (typeof records.series !== 'undefined') {
												var series = [];
												for (var j = 0; j < records.series.length; j++) {
													series.push($.extend(v.opciones.series[j], records.series[j]));
												}
												v.opciones.series = series;
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
											charts.sort(function(a, b) {
												return a.idGrafica - b.idGrafica;
											});
											options.success(charts);
										}
									},
									loadError: function(jqXHR, status, error) {
										var message = '';
										switch (jqXHR.status) {
											case 0:
												message = 'Error de conexión, verifica tu conexión ó intétalo más tarde.';
												break;
											case 404:
												message = 'Error 404, no encontramos resultados con tu búsqueda.';
												break;
											case 500:
												message = 'Error 500, hay problemas con el servidor de datos.';
												break;
										}
										options.error(message);
									},
									beforeSend: function(xhr) {
										AgronetEstadisticas.xhrPool.push(xhr);

										var loadingView = new LoadingView();
										loadingView.message = "gráficos";
										loadingView.height = 648;
										AgronetEstadisticas.mainRegion.currentView.chartsRegion.show(loadingView);
									}
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