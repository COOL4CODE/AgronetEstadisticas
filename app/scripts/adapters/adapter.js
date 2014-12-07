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

	function getReport(idCategory, idReport) {
		var repDeferred = $.Deferred();
		require(['json!data/' + idCategory + '/' + idReport + '.json'], function(report) {
			repDeferred.resolve(report);
		});
		return repDeferred.promise();
	}

	return {

		findReportsByIds: function(ids) {
			var deferred = $.Deferred();
			var reports = [];
			$.map(AgronetEstadisticasData.categorias, function(obj1) {
				$.each(ids, function(ix, id) {
					$.map(obj1.reportes, function(obj2) {
						if (obj2 === parseInt(id, 0)) {
							getReport(obj1.idCategoria, obj2).done(function(d) {
								reports.push(d);
								if (reports.length === ids.length) {
									deferred.resolve(reports);
								}
							});
						}
					});
				});
			});

			return deferred.promise();
		},

		findReportsByCategoryId: function(id) {
			var deferred = $.Deferred();
			var reports = [];

			$.map(AgronetEstadisticasData.categorias, function(obj1) {
				if (obj1.idCategoria === parseInt(id, 0)) {
					$.each(obj1.reportes, function(k, v) {
						getReport(obj1.idCategoria, v).done(function(d) {
							reports.push(d);
							if (reports.length === obj1.reportes.length) {
								deferred.resolve(reports);
							}
						});
					});
				}
			});
			return deferred.promise();
		},

		findChartsByReportId: function(idCategory, idReport) {
			var deferred = $.Deferred();
			getReport(idCategory, idReport).done(function(report) {
				deferred.resolve(report.graficas);
			});
			return deferred.promise();
		},

		findFiltersByReportId: function(idCategory, idReport) {
			var deferred = $.Deferred();
			getReport(idCategory, idReport).done(function(report) {
				deferred.resolve(report.parametros);
			});
			return deferred.promise();
		},

		findAll: function() {
			return AgronetEstadisticasData.categorias;
		}

	};

});