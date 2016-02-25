/**
 * Script de estructura para el modelo Boletín, funciona para consultar los archivos descargables del API Boletines
 *
 * @module app/scripts/models/newsletter
 * @author David Alméciga, <wdavid@dagrinchi.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function(require) {

	'use strict';

	var Backbone = require('backbone');
	var Adapter = require('adapters/adapter');

	var Model = Backbone.Model.extend({

	});

	var Collection = Backbone.Collection.extend({

		Model: Model,

		sync: function(method, model, options) {
			var self = this;
			if (method === 'read') {
				if (typeof this.idReport !== 'undefined') {
					Adapter.findNewslettersBySubcategoryId(self.idReport).done(function(data) {
						options.success(data);
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
