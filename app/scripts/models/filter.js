/**
 * Script de estructura para el modelo de parámetros del Reportes.
 *
 * @module app/scripts/models/filter
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Backbone = require('backbone');
	var Adapter = require('adapters/adapter');
	var LoadingView = require('views/loading');

	var Model = Backbone.Model.extend({

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			var self = this;
			if (method === 'read') {
				if (typeof this.idCategory !== 'undefined' && typeof this.idReport !== 'undefined') {
					require(['adapters/adapter', 'jqx/jqx-all'], function(Adapter) {
						Adapter.findFiltersByReportId(self.idCategory, self.idReport).done(function(data) {
							var filters = [];
							$.each(data, function(k, v) {
								var source = v['jqx.dataAdapter'].source;
								if (self.params !== 'undefined') {
									source.data = $.extend(source.data, self.params);
								}

								var dataAdapter = new $.jqx.dataAdapter(v['jqx.dataAdapter'].source, {
									loadComplete: function(records) {
										if (typeof records.data !== 'undefined') {
											v.opciones.source = records.data;
										}

										filters.push(v);
										if (filters.length === data.length) {
											filters.sort(function(a, b) {
												return a.idParametro - b.idParametro;
											});
											options.success(filters);
										}
									},
									loadError: function(jqXHR, status, error) {
										var message = '';
										switch (jqXHR.status) {
											case 0:
												message = 'Error de conexión, verifica tu conexión ó intétalo más tarde.';
												break;
											case 404:
												message = 'Error 404, no encontramos resultados con tu búsqueda.';
												break;
											case 500:
												message = 'Error 500, hay problemas con el servidor de datos.';
												break;
										}
										options.error(message);
									},
									beforeSend: function(xhr) {
										AgronetEstadisticas.xhrPool.push(xhr);

										var loadingView = new LoadingView();
										loadingView.message = "parámetros";
										loadingView.height = 132;
										AgronetEstadisticas.mainRegion.currentView.filtersRegion.show(loadingView);
									}
								});
								dataAdapter.dataBind();
							});
						});
					});
				}
			}
		}

	});

	return {
		Model: Model,
		Collection: Collection
	};

});
