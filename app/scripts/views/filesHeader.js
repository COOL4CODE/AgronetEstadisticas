/**
 * Script que controla la vista del encabezado de la lista de archivos
 *
 * @module app/scripts/views/filesHeader
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	var moment = require('moment');

	var FilesHeaderTpl = require('text!tpl/filesHeader.html');

	return Marionette.ItemView.extend({

		template: _.template(FilesHeaderTpl),

		events: {
			'click #sourceSpecsBtn': 'downloadSourceSpecsEvent'
		},

		downloadSourceSpecsEvent: function() {
			var report = this.report.toJSON();
			ga('send', 'event', {
				'eventCategory': report.idReporte + " " + report.titulo,
				'eventAction': 'descargar',
				'eventLabel': 'Ficha metodológica, ' + report.fuentesInformacion.titulo,
				'page': Backbone.history.location.hash
			});
		},

		render: function() {
			this.$el.html(this.template({
				report: this.report.toJSON()
			}));
		}

	});

});