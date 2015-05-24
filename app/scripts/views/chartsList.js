/**
 * Script que controla la vista de los gráficos del Reporte módulo de Estadísticas
 *
 * @module app/scripts/views/chartList
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	var ChartListTpl = require('text!tpl/chartsList.html');
	require('helpers/hchartexport');
	require('helpers/technical-indicators');

	return Marionette.ItemView.extend({

		tagName: 'div',

		className : 'pad-top',

		template: _.template(ChartListTpl),

		events: {
			'click .exportBtn': 'exportEvent',
			'click .jpgBtn': 'jpgPageEvent',
			'click .svgBtn': 'svgPageEvent',
			'click .printBtn': 'printPageEvent'
		},

		exportEvent: function(e) {
			var report = this.report.toJSON();
			var chart = $(e.currentTarget).data('chart');
			require(['jqx/jqx-all', 'jqx/jqxgrid.export'], function() {
				//$('#' + chart).jqxGrid('exportdata', 'xls', 'datos_tabla', false, false, false, "http://207.239.250.246/seaApi/home/downloadtable");
				$('#' + chart).jqxGrid('exportdata', 'xls', report.titulo);
			});
			ga('send', 'event', {
				'eventCategory': report.idReporte + " " + report.titulo,
				'eventAction': 'descargar',
				'eventLabel': 'Excel, ' + chart,
				'page': Backbone.history.location.hash
			});
		},

		jpgPageEvent: function(e) {
			var report = this.report.toJSON();
			var id = $(e.currentTarget).data('chart');
			var model = this.collection.findWhere({
				idGrafica: id
			});

			var hchart = model.get('hchart');
			var hstock = model.get('hstock');
			if (typeof hchart !== 'undefined') {
				hchart.exportChartLocal({
					name: report.titulo
				});
			} else if (typeof hstock !== 'undefined') {
				hstock.exportChartLocal({
					name: report.titulo
				});
			}

			ga('send', 'event', {
				'eventCategory': report.idReporte + " " + report.titulo,
				'eventAction': 'descargar PDF',
				'eventLabel': 'chart' + id,
				'page': Backbone.history.location.hash
			});
		},

		svgPageEvent: function(e) {
			var report = this.report.toJSON();
			var id = $(e.currentTarget).data('chart');
			var model = this.collection.findWhere({
				idGrafica: id
			});

			var hchart = model.get('hchart');
			var hstock = model.get('hstock');
			if (typeof hchart !== 'undefined') {
				hchart.exportChartLocal({
					name: report.titulo,
					type: 'image/svg+xml'
				});
			} else if (typeof hstock !== 'undefined') {
				hstock.exportChartLocal({
					name: report.titulo,
					type: 'image/svg+xml'
				});
			}

			ga('send', 'event', {
				'eventCategory': report.idReporte + " " + report.titulo,
				'eventAction': 'descargar PDF',
				'eventLabel': 'chart' + id,
				'page': Backbone.history.location.hash
			});
		},

		printPageEvent: function(e) {
			var chart = $(e.currentTarget).data('chart');
			require(['jQuery.print'], function() {
				$('#' + chart).print();
			});

			var report = this.report.toJSON();
			ga('send', 'event', {
				'eventCategory': report.idReporte + " " + report.titulo,
				'eventAction': 'imprimir',
				'eventLabel': chart,
				'page': Backbone.history.location.hash
			});
		},

		onShow: function() {
			setTimeout(function() {
				$('#charts').animate({
					scrollTop: AgronetEstadisticas.scrolls.chartsList
				}, '600', 'swing', function() {});
			}, 100);
		},

		scrollCharts: function(e) {
			AgronetEstadisticas.scrolls.chartsList = $(e.currentTarget).scrollTop();
		},

		render: function() {

			var idReporte = this.report.get('idReporte');
			this.$el.html(this.template({
				idReporte: idReporte,
				data: this.collection.toJSON()
			}));

			_.each(this.collection.models, function(model) {
				var chart = model.toJSON();
				switch (chart.widget) {
					case 'jqxGrid':
						require(['jqx/jqx-all'], function() {
							$('#chart' + idReporte + '-' + chart.idGrafica)[chart.widget](chart.opciones);
							// $('#chart' + idReporte + '-' + chart.idGrafica).jqxGrid('autoresizecolumns');
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

			$('#charts').on('scroll', this.scrollCharts);
		}

	});

});
