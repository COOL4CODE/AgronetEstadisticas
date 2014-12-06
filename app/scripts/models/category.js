/**
 * Script de estructura para el modelo Categoría, funciona para consultar las categorias.
 *
 * @module app/scripts/models/category
 * @author COOL FOR CODE SAS, <info@cool4code.com>
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
			if (method === 'read') {
				options.success(Adapter.findAll());
			}
		}

	});

	return {
		Model: Model,
		Collection: Collection
	};

});