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

	return Marionette.ItemView.extend({

		tagName: 'div',

		template: _.template(ChartListTpl),

		events: {
			'click .exportBtn': 'exportEvent',
			'click .printBtn': 'printPageEvent'
		},

		exportEvent: function(e) {
			var chart = $(e.currentTarget).data('chart');
			require(['jqx/jqx-all'], function() {
				//$('#' + chart).jqxGrid('exportdata', 'xls', 'jqxGrid', false, false, false, "http://localhost/save-file.php");	
				$('#' + chart).jqxGrid('exportdata', 'xls', chart + '.xls');
			});
		},

		printPageEvent: function(e) {
			var chart = $(e.currentTarget).data('chart');
			require(['jQuery.print'], function() {
				$('#' + chart).print();
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
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));

			var self = this;
			require(['highcharts', 'jqx/jqx-all'], function() {
				_.each(self.collection.models, function(model) {
					var chart = model.toJSON();
					$('#chart' + chart.idGrafica)[chart.widget](chart.opciones);
					if (chart.widget === 'jqxGrid') {
						$('#chart' + chart.idGrafica).jqxGrid('autoresizecolumns');
					}
				});
			});

			$('#charts').on('scroll', this.scrollCharts);
		}

	});

});