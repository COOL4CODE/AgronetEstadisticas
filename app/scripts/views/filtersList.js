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
			'click #specsBtn' : 'downloadSpecs'
		},

		downloadSpecs: function(e) {
			console.log('Go specs!!');
			e.preventDefault();
			return false;
		},

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));

			var self = this;
			require(['jqx', 'jqx.globalization', 'jqx.globalization.es.co'], function() {
				_.each(self.collection.models, function(model) {
					var filter = model.toJSON();
					$('#filter' + filter.idParametro)[filter.widget](filter.opciones);
				});
			});
		}

	});

});