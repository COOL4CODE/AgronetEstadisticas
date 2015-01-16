/**
 * Script que controla la vista de carga
 *
 * @module app/scripts/views/loading
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');

	var LoadingTpl = require('text!tpl/loading.html');

	return Marionette.ItemView.extend({

		tagName: 'div',

		className: 'container-fluid loading-state',

		template: _.template(LoadingTpl),

		onShow: function() {
			this.$el.height(this.height);
		},	

		render: function() {
			this.$el.html(this.template({ message : this.message }));			
		}

	});

});