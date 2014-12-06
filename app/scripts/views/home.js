/**
 * Script que controla la vista del inicio del módulo de Estadísticas
 *
 * @module app/scripts/views/home
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var _ = require('underscore');
	var homeTpl = require('text!tpl/home.html');

	var Marionette = require('backbone.marionette');

	return Marionette.LayoutView.extend({

		id: 'main',

		tagName: 'div',

		className: 'container-fluid',

		template: _.template(homeTpl),

		regions: {
			categoriesRegion: '#category',
			homeReportsRegion: '#homeReports'
		}
	});

});