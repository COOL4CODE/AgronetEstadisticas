/**
 * Adaptador para consulta de datos con parámetros para el Modelo.
 *
 * @module app/scripts/adapters/adapter
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var $ = require('jquery');
	var AgronetEstadisticasData = require('json!data/data.json');

	return {

		findReportsByIds: function(ids) {
			var deferred = $.Deferred();
			var reports = [];

			$.map(AgronetEstadisticasData.categorias, function(obj1) {
				$.map(obj1.reportes, function(obj2) {
					for (var i = 0; i < ids.length; i++) {
						if (obj2.id === parseInt(ids[i], 0)) {
							reports.push(obj2);
						}
					}
				});
			});

			deferred.resolve(reports);
			return deferred.promise();
		},

		findReportsByCategoryId: function(id) {
			var deferred = $.Deferred();
			deferred.resolve(AgronetEstadisticasData.categorias[id].reportes);
			return deferred.promise();
		},

		findAll: function() {
			return AgronetEstadisticasData.categorias;
		}

	};

});