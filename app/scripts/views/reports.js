/**
 * Script que controla la vista del reportes del módulo de Estadísticas
 *
 * @module app/scripts/views/report
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Marionette = require('backbone.marionette');
	var _ = require('underscore');
	var $ = require('jquery');
	var ReportsTpl = require('text!tpl/reports.html');

	return Marionette.LayoutView.extend({

		id: 'main',

		tagName: 'div',

		className: 'container-fluid',

		template: _.template(ReportsTpl),

		regions: {
			categoriesRegion: '#category',
			reportsRegion: '#reports',
			chartsRegion: '#charts',
			filtersRegion: '#filters'
		}
	});

});