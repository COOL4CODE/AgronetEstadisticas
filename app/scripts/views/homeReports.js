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

	return Marionette.LayoutView.extend({

		tagName: 'div',

		className: 'container-fluid',

		template: _.template(HomeReportsTpl),

		render: function() {

			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));

			var self = this;
			require(['highcharts'], function() {
				_.each(self.collection.models, function(model) {
					var report = model.toJSON();
					$('#chart' + report.id).highcharts(report.graficas[0].highcharts);
				});
			});
		}

	});

});