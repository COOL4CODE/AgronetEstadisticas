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
	var SearchListView = require('views/searchList');
	var Report = require('models/report');

	return Marionette.LayoutView.extend({

		id: 'main',

		tagName: 'div',

		className: 'container-fluid',

		template: _.template(ReportsTpl),

		events: {
			'click #searchBtn': 'searchEvent'
		},

		searchEvent: function(e) {
			var reports = new Report.Collection();
			var searchText = $('#searchText').val();

			var searchListView = new SearchListView();
			searchListView.data = searchText;
			reports.searchText = searchText;
			reports.fetch({
				'success': function(reportsCollection) {
					searchListView.collection = reportsCollection;
					AgronetEstadisticas.searchRegion.show(searchListView);
				}
			});

			ga('send', 'event', {
				'eventCategory': 'General',
				'eventAction': 'buscar',
				'eventLabel': searchText,
				'page': Backbone.history.location.hash
			});
		},

		regions: {
			categoriesRegion: '#category',
			reportsRegion: '#reports',
			chartsRegion: '#charts',
			filtersRegion: '#filters'
		}
	});

});