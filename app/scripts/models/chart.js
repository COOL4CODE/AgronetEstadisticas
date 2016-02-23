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
	var Adapter = require('adapters/adapter');

	var Model = Backbone.Model.extend({

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			var self = this;
			if (method === 'read') {
				if (typeof this.idCategory !== 'undefined' && typeof this.idReport !==
					'undefined') {
					require(['jqx/jqx-all'], function() {

						Adapter.findChartsByReportId(self.idCategory, self.idReport).done(
							function(data) {
								var charts = [];
								$.each(data, function(k, v) {
									var source = v['jqx.dataAdapter'].source;
									if (self.params !== 'undefined') {
										source.data = $.extend(source.data, self.params);
									}

									var dataAdapter = new $.jqx.dataAdapter(v['jqx.dataAdapter']
										.source, {
											loadComplete: function(records) {
												switch (v.widget) {
													case 'jqxGrid':
														v.opciones.localization = {
															'/': "/",
															':': ":",
															firstDay: 1,
															days: {
																names: ["Domingo", "Lunes", "Martes", "Miércoles",
																	"Jueves", "Viernes", "Sábado"
																],
																namesAbbr: ["Dom", "Lun", "Mar", "Mie", "Jue",
																	"Vie", "Sab"
																],
																namesShort: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi",
																	"Sa"
																]
															},

															months: {
																names: ["Enero", "Febrero", "Marzo", "Abril",
																	"Mayo", "Junio", "Julio", "Agosto", "Septiembre",
																	"Octubre", "Noviembre", "Diciembre", ""
																],
																namesAbbr: ["Ene", "Feb", "Mar", "Abr", "May",
																	"Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
																	""
																]
															},
															AM: ["AM", "am", "AM"],
															PM: ["PM", "pm", "PM"],
															eras: [{
																"name": "A.D.",
																"start": null,
																"offset": 0
															}],
															twoDigitYearMax: 2029,
															patterns: {
																d: "dd/MM/yyyy",
																D: "d MMMM/yyyy",
																t: "HH:mm",
																T: "HH:mm:ss",
																f: "dddd, d/ MMMM yyyy HH:mm",
																F: "dddd, d/ MMMM yyyy HH:mm:ss",
																M: "dd MMMM",
																Y: "MMMM yyyy"

															},
															'pagergotopagestring': 'Ir a la página:',
															'pagershowrowsstring': 'Mostrar filas:',
															'pagerrangestring': ' de ',
															'pagerpreviousbuttonstring': 'anterior',
															'pagernextbuttonstring': 'siguiente',
															'pagerfirstbuttonstring': 'primero',
															'pagerlastbuttonstring': 'último',
															'loadtext': 'Cargando...',
															'clearstring': 'Limpiar',
															'todaystring': 'Hoy',
															'sortascendingstring': 'Orden Ascendente',
															'sortdescendingstring': 'Orden Descendente',
															'sortremovestring': 'Limpiar Orden',
															'groupsheaderstring': 'Arrastre aquí una columna para agrupar los valores',
															'groupbystring': 'Agrupar por esta columna',
															'groupremovestring': 'Eliminar de los grupos',
															'decimalseparator': ',',
															'thousandsseparator': '.'
														};
														v.opciones.pagesizeoptions = [20, 50, 100, 500];

														var columns = v.opciones.columns;
														var rows = records.rows;
														var gridAdapter = new $.jqx.dataAdapter({
															datafields: v['jqx.dataAdapter'].source[
																"datafields"],
															localdata: rows,
															pagesize: 100
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
														break;
													case 'highstock':
														v.opciones.exporting = {
															enabled: false
														};
														v.opciones.credits = {
															enabled: false
														};
														v.opciones.chart = {
															renderTo: 'chart' + self.idReport + '-' + v.idGrafica
														};
														if (typeof records.subtitle !== 'undefined' &&
															records.subtitle !== "" && records.subtitle !== null
														) {
															v.opciones.subtitle.text = records.subtitle;
														}
														if (typeof records.series !== 'undefined') {
															var series1 = [];
															for (var h = 0; h < records.series.length; h++) {
																var rdata = records.series[h].data;
																for (var g = 0; g < rdata.length; g++) {
																	rdata[g]['x'] = parseInt(rdata[g]['name'] + "000",
																		0);
																	if (rdata[g]['y'] === 'NaN') {
																		rdata[g]['y'] = 0;
																	}
																	delete rdata[g]['name'];
																}
																series1.push(records.series[h]);
															}
															v.opciones.series = series1;
														}
														break;
													case 'highcharts':
														v.opciones.exporting = {
															enabled: false
														};
														v.opciones.credits = {
															enabled: false
														};
														v.opciones.chart = $.extend(v.opciones.chart, {
															renderTo: 'chart' + self.idReport + '-' + v.idGrafica
														});
														if (typeof records.subtitle !== 'undefined' &&
															records.subtitle !== "" && records.subtitle !== null
														) {
															v.opciones.subtitle.text = records.subtitle;
														}
														if (typeof records.series !== 'undefined') {
															var series2 = [];
															for (var j = 0; j < records.series.length; j++) {

																////////
																if (typeof v.opciones.xAxis !== "undefined" && v.opciones.xAxis["type"] === "datetime") {
																	var hdata = records.series[j].data;
																	for (var t = 0; t < hdata.length; t++) {

																		hdata[t]['x'] = parseInt(hdata[t]['name'] + "000",
																			0);
																		if (hdata[t]['y'] === 'NaN') {
																			hdata[t]['y'] = 0;
																		}
																		delete hdata[t]['name'];
																	}
																}
																////////
																series2.push($.extend(v.opciones.series[j], records.series[j]));
															}
															v.opciones.series = series2;
														}

														if (typeof v.opciones.tooltip !== 'undefined') {
															if (typeof v.opciones.tooltip.formatter === 'string') {
																v.opciones.tooltip.formatter = Helper[v.opciones.tooltip
																	.formatter];
															}
														}
														break;
													default:
														break;
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
														message =
															'Error de conexión, verifica tu conexión ó intétalo más tarde.';
														break;
													case 404:
														message =
															'Error 404, no encontramos resultados con tu búsqueda.';
														break;
													case 500:
														message =
															'Error 500, hay problemas con el servidor de datos.';
														break;
													default:
														break;
												}
												options.error(message);
											},
											beforeSend: function(xhr) {
												AgronetEstadisticas.xhrPool.push(xhr);

												var loadingView = new LoadingView();
												loadingView.message = "gráficos";
												if (self.tipo === 'homeView') {
													loadingView.height = 849;
													AgronetEstadisticas.mainRegion.currentView.homeReportsRegion
														.show(loadingView);
												} else if (self.tipo === 'reportView') {
													loadingView.height = 716;
													AgronetEstadisticas.mainRegion.currentView.chartsRegion
														.show(loadingView);
												}
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
