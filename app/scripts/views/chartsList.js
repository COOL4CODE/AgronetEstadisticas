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

		className: 'container-fluid',

		template: _.template(ChartListTpl),

		events: {
			'click .exportBtn': 'export'
		},

		export: function(e) {
			var chart = $(e.currentTarget).data('chart');
			$('#' + chart).jqxGrid('exportdata', 'xls', chart);
		},

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));

			var self = this;
			require(['highcharts', 'jqx'], function() {
				_.each(self.collection.models, function(model) {
					var chart = model.toJSON();
					$('#chart' + chart.idGrafica)[chart.widget](chart.opciones);
				});
			});
		}

	});

});