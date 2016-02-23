/**
 * Script que controla la vista del resultado la búsqueda
 *
 * @module app/scripts/views/categories
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	require('bootstrap/modal');

	var SearchListTpl = require('text!tpl/searchList.html');

	return Marionette.ItemView.extend({

		tagName: 'div',

		className: 'modal-dialog',

		template: _.template(SearchListTpl),

		events: {
			'click .reportItemSearch': 'openReport'
		},

		openReport: function(e) {
			$('#search-region').modal('hide');
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
				title: this.data,
				data: this.collection.toJSON()
			}));

			$('#search-region').modal({
				keyboard: false
			});
		}

	});

});
