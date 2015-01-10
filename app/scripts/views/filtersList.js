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
			'click #specsBtn': 'downloadSpecsEvent',
			'click #printBtn': 'printPageEvent',
			'click #calcBtn': 'calcBtnEvent'
		},

		closeEvent: function(e) {
			var params = {};
			var bind = $(e.currentTarget).data('bind');

			var widget = $(e.currentTarget).data('widget');
			if (widget === 'jqxDateTimeInput') {
				params[bind] = e.args.date.toJSON();
			} else if (widget === 'jqxComboBox') {
				var items = $(this).jqxComboBox('getCheckedItems');
				if (items) {
					params[bind] = [];
					$.each(items, function(k, v) {
						params[bind].push(v.label);
					});
				} else {
					var item = $(this).jqxComboBox('getSelectedItem');
					params[bind] = item.label;
				}
			}

			if (params !== 'undefined') {
				AgronetEstadisticas.params = $.extend(AgronetEstadisticas.params, params);
				setTimeout(function() {
					var route = AgronetEstadisticas.Router.toFragment('reporte/' + AgronetEstadisticas.idCategory + "/" + AgronetEstadisticas.idReport, AgronetEstadisticas.params);
					AgronetEstadisticas.Router.navigate(route, {
						trigger: true
					});
				}, 1000);
			}
		},

		downloadSpecsEvent: function() {
			console.log('Go specs!!');
		},

		reloadURL: function() {
			var route = AgronetEstadisticas.Router.toFragment('reporte/' + AgronetEstadisticas.idCategory + "/" + AgronetEstadisticas.idReport, AgronetEstadisticas.params);
			AgronetEstadisticas.Router.navigate(route, {
				trigger: true
			});
		},

		onShow: function() {
			var self = this;
			setTimeout(function() {
				_.each(self.collection.models, function(model) {
					var filter = model.toJSON();
					$.each(AgronetEstadisticas.params, function(k1, v1) {
						if (filter.bind === k1) {
							if (filter.widget === "jqxComboBox") {
								$('#inputfilter' + filter.idParametro).jqxComboBox('selectItem', v1);
							}
						}
					});
				});
			}, 500);
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
					$('#inputfilter' + filter.idParametro).on("close", self.closeEvent);
				});
			});
		}

	});

});