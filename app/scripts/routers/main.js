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

	var Category = require('models/category');
	var Report = require('models/report');
	var Chart = require('models/chart');
	var Filter = require('models/filter');

	return Marionette.AppRouter.extend({

		appRoutes: {
			'': 'home',
			'reporte/:ixReport/:ixCategory': 'report'
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
				var categories = new Category.Collection();
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
						AgronetEstadisticas.mainRegion.currentView.homeReportsRegion.show(homeReportsView);
					}
				});
			},

			/**
			 * @param {number} idCategory: Identificador del reporte inicial en la categoría marcada
			 * @param {number} idReport: Identificador de la categoría marcada
			 * @param {array} params: Parámetros de la construcción inicial de las gráficas del reporte
			 * @example http://www.agronet.gov.co/estadisticas/#reporte/3/10?departamento=1004&anios=2000|2001|2002&product_code=10023
			 */
			report: function(idCategory, idReport, params) {
				var categories = new Category.Collection();
				var reports = new Report.Collection();
				var charts = new Chart.Collection();
				var filters = new Filter.Collection();

				var reportsView = new ReportsView();
				var categoriesView = new CategoriesView();
				var reportsListView = new ReportsListView();
				var chartsListView = new ChartsListView();
				var filterListView = new FilterListView();
				
				AgronetEstadisticas.mainRegion.show(reportsView);

				categories.fetch({
					'success': function(categoriesCollection) {
						categoriesView.collection = categoriesCollection;
						AgronetEstadisticas.mainRegion.currentView.categoriesRegion.show(categoriesView);
					}
				});

				if (typeof idCategory !== 'undefined') {
					reports.idCategory = idCategory;
				}				
				reports.fetch({
					'success': function(reportsCollection) {
						reportsListView.collection = reportsCollection;
						AgronetEstadisticas.mainRegion.currentView.reportsRegion.show(reportsListView);
					}
				});

				if (typeof idReport !== 'undefined') {
					charts.idReport = idReport;
					filters.idReport = idReport;
				}
				charts.fetch({
					'success' : function(chartsCollection) {
						chartsListView.collection = chartsCollection;
						AgronetEstadisticas.mainRegion.currentView.chartsRegion.show(chartsListView);
					}
				});
				filters.fetch({
					'success' : function(filtersCollection) {
						filterListView.collection = filtersCollection;
						AgronetEstadisticas.mainRegion.currentView.filtersRegion.show(filterListView);
					}
				});
			}
		}

	});

});