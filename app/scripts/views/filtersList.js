/**
 * Script que controla la vista de los parámetros módulo de Estadísticas
 *
 * @module app/scripts/views/filtersList
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	var moment = require('moment');

	var FilterListTpl = require('text!tpl/filtersList.html');

	return Marionette.ItemView.extend({

		template: _.template(FilterListTpl),

		events: {
			'valueChanged .filter': 'valueChanged',
			'select .filter': 'select',
			'checkChange .filter': 'checkChange',
			'click #specsBtn': 'downloadSpecs',
			'click #printBtn': 'printPage',
			'click #calcBtn': 'calcBtn'
		},

		valueChanged: function(e) {
			var bind = $(e.currentTarget).data('bind');
			var params = {};
			params[bind] = moment(e.args.date).format();
			console.log(AgronetEstadisticas.Router.toFragment('reporte', params));
			/*AgronetEstadisticas.Router.navigate(AgronetEstadisticas.Router.toFragment('report', params), {
				trigger: true
			});*/
		},

		select: function(e) {
			var bind = $(e.currentTarget).data('bind');
			var params = {};
			params[bind] = e.args.item.label;
			if (params !== 'undefined') {
				AgronetEstadisticas.params = $.extend(AgronetEstadisticas.params, params);
			}
			console.log(params);
		},

		checkChange: function(e) {
			var bind = $(e.currentTarget).data('bind');
			var params = {};			
			params[bind].push(e.args.item.label);
			if (params !== 'undefined') {
				AgronetEstadisticas.params = $.extend(AgronetEstadisticas.params, params);
			}
			console.log(params);
		},

		downloadSpecs: function() {
			console.log('Go specs!!');
		},

		printPage: function() {
			require(['jQuery.print'], function() {
				$('#charts').print({
					noPrintSelector: ".no-print"
				});
			});
		},

		calcBtn: function() {
			var route = AgronetEstadisticas.Router.toFragment('reporte/' + AgronetEstadisticas.idCategory + "/" + AgronetEstadisticas.idReport, AgronetEstadisticas.params);
			AgronetEstadisticas.Router.navigate(route, {
				trigger: true
			});
		},

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));

			var self = this;
			require(['jqx/jqx-all', 'globalize.culture.es-CO'], function() {
				_.each(self.collection.models, function(model) {
					var filter = model.toJSON();
					$('#inputfilter' + filter.idParametro)[filter.widget](filter.opciones);
				});
			});
		}

	});

});