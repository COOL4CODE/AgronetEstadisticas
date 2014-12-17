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

	var FilterListTpl = require('text!tpl/filtersList.html');

	return Marionette.ItemView.extend({

		template: _.template(FilterListTpl),

		events: {
			'valueChanged .filter': 'valueChanged',
			'select .filter': 'select',
			'click #specsBtn': 'downloadSpecs',
			'click #printBtn': 'printPage'
		},

		valueChanged: function(e) {
			console.log(e.args.date);
		},

		select: function(e) {
			console.log(e.args.item.label);
		},

		downloadSpecs: function() {
			console.log('Go specs!!');
		},

		printPage: function() {
			require(['jQuery.print'], function() {
				$('#charts').print({
					noPrintSelector : ".no-print"
				});
			});
		},

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));

			var self = this;
			require(['jqx', 'globalize.culture.es-CO'], function() {
				_.each(self.collection.models, function(model) {
					var filter = model.toJSON();
					$('#filter' + filter.idParametro)[filter.widget](filter.opciones);
				});
			});
		}

	});

});