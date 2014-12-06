/**
 * Script que controla la vista de la lista de reportes, módulo de Estadísticas
 *
 * @module app/scripts/views/reportsList
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');

	var ReportsListTpl = require('text!tpl/reportsList.html');

	return Marionette.ItemView.extend({

		template: _.template(ReportsListTpl),

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));
		}

	});

});