/**
 * Script que controla la vista de los reportes más vistos en el inicio del módulo de Estadísticas
 *
 * @module app/scripts/views/homeReports
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	var $ = require('jquery');
	var HomeReportsTpl = require('text!tpl/homeReports.html');
	require('highstock');
	require('helpers/hchartexport');

	return Marionette.LayoutView.extend({

		tagName: 'div',

		template: _.template(HomeReportsTpl),

		events: {
			'click .reportItem': 'openReport'
		},

		openReport: function(e) {
			var model = this.collection.where({
				'idReporte': $(e.currentTarget).data('report')
			});
			var route = AgronetEstadisticas.Router.toFragment('reporte/' + model[0].get('idCategoria') + "/" + model[0].get('idReporte'), model[0].get('parametrosIniciales'));
			AgronetEstadisticas.Router.navigate(route, {
				trigger: true
			});
		},

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));			

			_.each(this.collection.models, function(model) {
				var report = model.toJSON();
				var chart = report.graficas[0];				
				switch (chart.widget) {
					case 'jqxGrid':
						require(['jqx/jqx-all'], function() {
							$('#chart' + report.idReporte)[chart.widget](chart.opciones);
							$('#chart' + report.idReporte).jqxGrid('autoresizecolumns');
						});
						break;
					case 'highstock':
						setTimeout(function() {
							console.log(chart.opciones);
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
		}

	});

});