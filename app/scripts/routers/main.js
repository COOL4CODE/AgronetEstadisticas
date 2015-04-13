/**
 * Rutas de la aplicación estadísticas, permitiendo realizar las consultas de distintos reportes
 * con la combinación de los distintos parámetros de la dirección.
 *
 * @module app/scripts/routers/main
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');

	/**
	 * Variables vista del inicio o home
	 */
	var HomeView = require('views/home');
	var CategoriesView = require('views/categories');
	var HomeReportsView = require('views/homeReports');

	/**
	 * Variables vista de los reportes
	 */
	var ReportsView = require('views/reports');
	var ReportsListView = require('views/reportsList');
	var ChartsListView = require('views/chartsList');
	var FilterListView = require('views/filtersList');
	var FilesListView = require('views/filesList');
	var FilesHeaderView = require('views/filesHeader');
	var ErrorView = require('views/error');

	var Category = require('models/category');
	var HomeReport = require('models/homeReport');
	var Report = require('models/report');
	var Chart = require('models/chart');
	var Filter = require('models/filter');
	var File = require('models/file');

	return Marionette.AppRouter.extend({

		appRoutes: {
			'': 'home',
			'reporte/:idCategory/:idReport': 'report'
		},

		controller: {

			/**
			 * En página de inicio de estadísticas se prentenden mostrar los reportes más vistados.
			 * Ver los más vistados en la cuenta Google Analytics - Agronet y pasar los índices deseados
			 *
			 * @param {array} params: Array de reportes para colocar en la página de inicio de estadíscas.
			 * @example http://www.agronet.gov.co/estadisticas/#?masVistos=12|35|67
			 */
			home: function(params) {
				$.map(AgronetEstadisticas.xhrPool, function(xhr) {
					xhr.abort();
				});
				var categories = new Category.Collection();
				//var reports = new HomeReport.Collection();
				var reports = new Report.Collection();

				var categoriesView = new CategoriesView();
				var homeReportsView = new HomeReportsView();
				var homeView = new HomeView();
				AgronetEstadisticas.mainRegion.show(homeView);

				categories.fetch({
					'success': function(categoriesCollection) {
						categoriesView.collection = categoriesCollection;
						AgronetEstadisticas.mainRegion.currentView.categoriesRegion.show(categoriesView);
					}
				});

				if (typeof params !== 'undefined') {
					reports.homeReports = params.masVistos;
				}
				reports.fetch({
					'success': function(reportsCollection) {
						homeReportsView.collection = reportsCollection;						

						reportsCollection.each(function(reportModel) {
							if (reportModel.get('tipo') === 'reporte') {

								var charts = new Chart.Collection();
								charts.idCategory = reportModel.get('idCategoria');
								charts.idReport = reportModel.get('idReporte');
								charts.tipo = 'homeView';

								charts.fetch({
									'success': function(chartsCollection) {
										AgronetEstadisticas.mainRegion.currentView.homeReportsRegion.show(homeReportsView);
										chartsCollection.each(function(model) {
											var chart = model.toJSON();
											switch (chart.widget) {
												case 'jqxGrid':
													require(['jqx/jqx-all'], function() {
														$('#chart' + reportModel.get('idReporte') + '-' + chart.idGrafica)[chart.widget](chart.opciones);
														$('#chart' + reportModel.get('idReporte') + '-' + chart.idGrafica).jqxGrid('autoresizecolumns');
													});
													break;
												case 'highstock':
													setTimeout(function() {
														var hstock = new Highcharts.StockChart(chart.opciones);
														model.set('hstock', hstock);
													}, 300);
													break;
												case 'highcharts':
													setTimeout(function() {
														var hchart = new Highcharts.Chart(chart.opciones);
														model.set('hchart', hchart);
													}, 300);
													break;
												default:
													break;
											}
										});
									},
									'error': function(model, error) {
										var errorView = new ErrorView();
										errorView.message = error;
										errorView.height = 849;
										AgronetEstadisticas.mainRegion.currentView.homeReportsRegion.show(errorView);
									}
								});
							}
						});
					}
				});
				ga('send', 'pageview', {
					'title': 'Inicio',
					'page': Backbone.history.location.hash
				});
			},

			/**
			 * @param {number} idCategory: Identificador del reporte inicial en la categoría marcada
			 * @param {number} idReport: Identificador de la categoría marcada
			 * @param {array} params: Parámetros de la construcción inicial de las gráficas del reporte
			 * @example http://www.agronet.gov.co/estadisticas/#reporte/3/10?departamento=1004&anios=2000|2001|2002&product_code=10023
			 */
			report: function(idCategory, idReport, params) {
				$.map(AgronetEstadisticas.xhrPool, function(xhr) {
					xhr.abort();
				});
				AgronetEstadisticas.xhrPool = [];
				AgronetEstadisticas.params = [];

				var categories = new Category.Collection();
				var reports = new Report.Collection();
				var report = new Report.Model();
				var charts = new Chart.Collection();
				var filters = new Filter.Collection();
				var files = new File.Collection();

				var reportsView = new ReportsView();
				var categoriesView = new CategoriesView();
				var reportsListView = new ReportsListView();
				var chartsListView = new ChartsListView();
				var filterListView = new FilterListView();
				var filesListView = new FilesListView();
				var filesHeaderView = new FilesHeaderView();

				AgronetEstadisticas.mainRegion.show(reportsView);

				if (typeof idCategory !== 'undefined') {
					reports.idCategory = idCategory;
					report.idCategory = idCategory;
					charts.idCategory = idCategory;
					filters.idCategory = idCategory;
					files.idCategory = idCategory;
					AgronetEstadisticas.idCategory = idCategory;
				}
				categories.fetch({
					'success': function(categoriesCollection) {
						categoriesView.collection = categoriesCollection;
						AgronetEstadisticas.mainRegion.currentView.categoriesRegion.show(categoriesView);
					}
				});

				if (typeof idReport !== 'undefined') {
					report.idReport = idReport;
					charts.idReport = idReport;
					filters.idReport = idReport;
					files.idReport = idReport;
					AgronetEstadisticas.idReport = idReport;
				}
				reports.fetch({
					'success': function(reportsCollection) {
						reportsListView.collection = reportsCollection;
						AgronetEstadisticas.mainRegion.currentView.reportsRegion.show(reportsListView);
					}
				});

				report.fetch({
					'success': function(reportModel) {
						document.title = reportModel.get("titulo");
						ga('send', 'pageview', {
							'title': reportModel.get("idReporte") + " " + reportModel.get("titulo"),
							'page': Backbone.history.location.hash
						});

						if (typeof params !== 'undefined') {
							charts.params = params;
							filters.params = params;
							AgronetEstadisticas.params = params;
						}
						switch (reportModel.get("tipo")) {
							case 'reporte':
								charts.tipo = 'reportView';
								charts.fetch({
									'success': function(chartsCollection) {
										chartsListView.collection = chartsCollection;
										chartsListView.report = reportModel;
										AgronetEstadisticas.mainRegion.currentView.chartsRegion.show(chartsListView);
									},
									'error': function(model, error) {
										var errorView = new ErrorView();
										errorView.message = error;
										errorView.height = 668;
										AgronetEstadisticas.mainRegion.currentView.chartsRegion.show(errorView);
									}
								});
								filters.fetch({
									'success': function(filtersCollection) {
										filterListView.collection = filtersCollection;
										filterListView.report = reportModel;
										AgronetEstadisticas.mainRegion.currentView.filtersRegion.show(filterListView);
									},
									'error': function(model, error) {
										var errorView = new ErrorView();
										errorView.message = error;
										errorView.height = 181;
										AgronetEstadisticas.mainRegion.currentView.filtersRegion.show(errorView);
									}
								});
								break;
							case 'descargable':
								files.fetch({
									'success': function(filesCollection) {
										filesListView.collection = filesCollection;
										AgronetEstadisticas.mainRegion.currentView.chartsRegion.show(filesListView);

										filesHeaderView.report = reportModel;
										AgronetEstadisticas.mainRegion.currentView.filtersRegion.show(filesHeaderView);
									},
									'error': function(model, error) {
										var errorView = new ErrorView();
										errorView.message = error;
										errorView.height = 181;
										AgronetEstadisticas.mainRegion.currentView.filtersRegion.show(errorView);
									}
								});
								break;
							default:
								break;
						}

					}
				});

			}
		}

	});

});