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
				if (typeof this.homeReports !== 'undefined' && this.homeReports.length > 0) {
					require(['helpers/report', 'jqx/jqx-all'], function(Helper) {

						Adapter.findReportsByIds(self.homeReports).done(function(data) {
							var reports = [];
							$.each(data, function(k, v) {
								var reportData = v;
								var chart = reportData.graficas[Math.floor(Math.random() * reportData.graficas.length)];
								var dataAdapter = new $.jqx.dataAdapter(chart['jqx.dataAdapter'].source, {
									loadComplete: function(records) {
										switch (chart.widget) {
											case 'jqxGrid':
												var columns = chart.opciones.columns;
												var rows = records.rows;
												var gridAdapter = new $.jqx.dataAdapter({
													localdata: rows
												});

												for (var i = 0; i < columns.length; i++) {
													if (columns[i].cellsrenderer !== 'undefined') {
														columns[i].cellsrenderer = Helper[columns[i].cellsrenderer];
													}
												}

												if (chart.opciones.groupsrenderer !== 'undefined') {
													chart.opciones.groupsrenderer = Helper[chart.opciones.groupsrenderer];
												}
												chart.opciones.source = gridAdapter;
												break;
											case 'highstock':
												chart.opciones.exporting = {
													enabled: false
												};
												chart.opciones.chart = {
													renderTo: 'chart' + v.idReporte
												};
												if (typeof records.subtitle !== 'undefined' && records.subtitle !== "" && records.subtitle !== null) {
													chart.opciones.subtitle.text = records.subtitle;
												}
												if (typeof records.series !== 'undefined') {													
													var series1 = [];
													for (var h = 0; h < records.series.length; h++) {															
														var rdata = records.series[h].data;
														for (var g = 0; g < rdata.length; g++) {
															rdata[g]['x'] = parseInt(rdata[g]['name'] + "000", 0);
															if (rdata[g]['y'] === 'NaN') {
																rdata[g]['y'] = 0;
															}
															delete rdata[g]['name'];
														}
														series1.push($.extend(chart.opciones.series[h], records.series[h]));													
													}
													chart.opciones.series = series1;
												}
												break;
											case 'highcharts':
												chart.opciones.exporting = {
													enabled: false
												};
												chart.opciones.chart = {
													renderTo: 'chart' + v.idReporte
												};
												if (typeof records.subtitle !== 'undefined' && records.subtitle !== "" && records.subtitle !== null) {
													chart.opciones.subtitle.text = records.subtitle;
												}
												if (typeof records.series !== 'undefined') {
													var series2 = [];
													for (var j = 0; j < records.series.length; j++) {
														series2.push($.extend(chart.opciones.series[j], records.series[j]));
													}
													chart.opciones.series = series2;
												}
												break;
											default:
												break;
										}

										reportData.graficas = [];
										reportData.graficas.push(chart);
										reports.push(reportData);

										if (reports.length === data.length) {
											options.success(reports);
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
											default:
												break;
										}
										if (reports.length === data.length) {
											options.error(message);
										}
									},
									beforeSend: function(xhr) {
										var loadingView = new LoadingView();
										loadingView.message = "gráficos";
										AgronetEstadisticas.mainRegion.currentView.homeReportsRegion.show(loadingView);
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