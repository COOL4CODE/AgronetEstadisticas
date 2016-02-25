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
		return $.getJSON('scripts/data/' + idCategory + '/' + idReport + '.json');
	}

	function getNewsletters() {
		return $.getJSON(AgronetEstadisticasData.apiBoletines.url);
	}

	return {

		findNewslettersBySubcategoryId: function(idSubcategory) {
			var deferred = $.Deferred();
			var defs = [];
			var newsletters = [];

			defs.push(getNewsletters().done(function(d) {
				$.each(d, function(k1, v1) {
					if (v1[AgronetEstadisticasData.apiBoletines.mapSubCategorias.idReporte] === parseInt(idSubcategory, 0)) {
						var obj = $.extend(true, {}, AgronetEstadisticasData.apiBoletines.mapBoletines);
						$.map(obj, function(v2, k2) {
							obj[k2] = v1[v2];
						});

						obj["ordenamiento"] = (typeof obj["ordenamiento"] == 'undefined') ? 0 : parseInt(obj["ordenamiento"], 0);
						obj["descripcion"] = (typeof obj["descripcion"] == 'undefined') ? '' : obj["descripcion"];
						newsletters.push(obj);
					}
				});
			}));

			$.when.apply(null, defs).done(function() {
				deferred.resolve(newsletters);
			});
			return deferred.promise();
		},

		mapNewslettersSubcategoriesByCategoryId: function(idCategory) {
			var deferred = $.Deferred();
			var defs = [];
			var subcategories = [];
			var currentObj = {};

			defs.push(getNewsletters().done(function(d) {
				$.each(d, function(k1, v1) {
					if (v1[AgronetEstadisticasData.apiBoletines.mapSubCategorias.idCategoria] === parseInt(idCategory, 0)) {
						var obj = $.extend(true, {}, AgronetEstadisticasData.apiBoletines.mapSubCategorias);
						$.map(obj, function(v2, k2) {
							obj[k2] = v1[v2];
						});

						obj["tipo"] = "boletin";
						obj["ordenamiento"] = (typeof obj["ordenamiento"] == 'undefined') ? 0 : parseInt(obj["ordenamiento"], 0);
						obj["fuentesInformacion"] = (typeof obj["fuentesInformacion"] == 'undefined') ? { 'titulo' : 'No definida', 'url' : '#' } : obj["fuentesInformacion"];
						obj["etiquetas"] = (typeof obj["etiquetas"] == 'undefined') ? [] : obj["etiquetas"];
						obj["descripcion"] = (typeof obj["descripcion"] == 'undefined') ? '' : obj["descripcion"];

						if (obj.idReporte !== currentObj.idReporte) {
								subcategories.push(obj);
						}
						currentObj = $.extend(true, {}, obj);;
					}
				});
			}));

			$.when.apply(null, defs).done(function() {
				deferred.resolve(subcategories);
			});
			return deferred.promise();
		},

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
			var defs = [];
			var reports = [];

			$.each(AgronetEstadisticasData.categorias, function(kobj1, obj1) {
				if (obj1.idCategoria === parseInt(id, 0)) {

					$.each(obj1.reportes, function(k, v) {
						var def1 = $.Deferred();
						defs.push(def1);

						getReport(obj1.idCategoria, v).done(function(d) {
							reports.push(d);
							def1.resolve();
						});
					});
				}
			});

			defs.push(this.mapNewslettersSubcategoriesByCategoryId(parseInt(id, 0)).done(function(subcategories) {
				$.each(subcategories, function(k1, v2) {
					reports.push(v2);
				});
			}));

			$.when.apply(null, defs).done(function() {
				deferred.resolve(reports);
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
			var defs = [];
			var result = [];
			$.each(AgronetEstadisticasData.categorias, function(k1, v1) {
				$.each(v1.reportes, function(k2, v2) {
					var def1 = $.Deferred();
					defs.push(getReport(v1.idCategoria, v2).done(function(reporte) {
						if (reporte.titulo.search(new RegExp(tagName, "i")) >= 0 || reporte.descripcion.search(new RegExp(tagName, "i")) >= 0) {
							result.push(reporte);
						} else {
							$.map(reporte.etiquetas, function(tag) {
								if (tag.search(new RegExp(tagName, "i")) >= 0) {
									result.push(reporte);
								}
							});
						}
					}));
				});
			});

			$.when.apply(null, defs).done(function() {
				deferred.resolve(result);
			});
			return deferred.promise();
		},

		findAll: function() {
			var deferred = $.Deferred();
			deferred.resolve(AgronetEstadisticasData.categorias);
			return deferred.promise();
		}

	};

});
