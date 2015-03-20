/**
 * Script que controla la vista de los archivos descargables, módulo de Estadísticas
 *
 * @module app/scripts/views/filesList
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	var moment = require('moment');

	var FilesListTpl = require('text!tpl/filesList.html');

	return Marionette.ItemView.extend({

		template: _.template(FilesListTpl),

		render: function() {
			this.$el.html(this.template({
				data: this.collection.toJSON()
			}));
		}

	});

});