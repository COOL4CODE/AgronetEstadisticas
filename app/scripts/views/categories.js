/**
 * Script que controla la vista de las categorias módulo de Estadísticas
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

	var CategoriesTpl = require('text!tpl/categories.html');

	return Marionette.ItemView.extend({

		tagName: 'div',

		className: 'container-fluid',

		template: _.template(CategoriesTpl),

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));
			setTimeout(function() { $('#category' + AgronetEstadisticas.idCategory).addClass('activeItem'); }, 500);
		}

	});

});