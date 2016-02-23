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
		$.getJSON('scripts/data/' + idCategory + '/' + idReport + '.json', function(report) {
			repDeferred.resolve(report);
		});
		return repDeferred.promise();
	}

	return {

		findReport: function(idCategory, idReport) {
			var deferred = $.Deferred();
			getReport(idCategory, idReport).done(function(report) {
				deferred.resolve(report);
			});
			return deferred.promise();
		},

		findReportsByIds: function(ids) {
			var deferred = $.Deferred();
			var reports = [];
			$.each(AgronetEstadisticasData.categorias, function(kobj1, obj1) {
				$.each(ids, function(ix, id) {
					$.each(obj1.reportes, function(kobj2, obj2) {
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

			$.each(AgronetEstadisticasData.categorias, function(kobj1, obj1) {
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

		findFilesByReportId: function(idCategory, idReport) {
			var deferred = $.Deferred();
			getReport(idCategory, idReport).done(function(report) {
				deferred.resolve(report.archivos);
			});
			return deferred.promise();
		},

		findReportsByTagName: function(tagName) {
			var deferred = $.Deferred();
			var result = [];
			$.each(AgronetEstadisticasData.categorias, function(k1, v1) {
				$.each(v1.reportes, function(k2, v2) {
					getReport(v1.idCategoria, v2).done(function(reporte) {
						if (reporte.titulo.search(new RegExp(tagName, "i")) >= 0 || reporte.descripcion.search(new RegExp(tagName, "i")) >= 0) {
							result.push(reporte);
						} else {
							$.map(reporte.etiquetas, function(tag) {
								if (tag.search(new RegExp(tagName, "i")) >= 0) {
									result.push(reporte);
								}
							});
						}
					});
				});
			});
			setTimeout(function() {
				deferred.resolve(result);
			}, 1000);
			return deferred.promise();
		},

		findAll: function() {
			var deferred = $.Deferred();
			deferred.resolve(AgronetEstadisticasData.categorias);
			return deferred.promise();
		}

	};

});
