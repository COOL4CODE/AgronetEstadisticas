/**
 * Script con funciones que calculan datos para tablas y gráficos módulo de Estadísticas
 *
 * @module app/helpers/report
 * @author COOL FOR CODE SAS, <info@cool4code.com>
 * @copyright Ministerio de Agricultura y Desarrollo Rural (MADR - Agronet) 2014
 * @version 1.0.0
 */

define(function() {

	'use strict';

	var toThemeProperty = function(className) {
		return className + ' ' + className + '-' + 'bootstrap';
	};

	return {

		groups401: function(text, group, expanded, data) {
			if (data.groupcolumn.datafield === 'data2' || data.groupcolumn.datafield === 'data4' || data.groupcolumn.datafield === 'data5' || data.groupcolumn.datafield === 'data6') {
				//var number = dataAdapter.formatNumber(group, data.groupcolumn.cellsformat);
				console.log(group);
				var number = group;
				var text = data.groupcolumn.text + ': ' + number;
				if (data.subItems.length > 0) {
					//var aggregate = this.getcolumnaggregateddata(data.groupcolumn.datafield, ['sum'], true, data.subItems);
					var aggregate = this.getcolumnaggregateddata('data0', ['sum'], true, data.subItems);
				} else {
					var rows = new Array();
					var getRows = function(group, rows) {
						if (group.subGroups.length > 0) {
							for (var i = 0; i < group.subGroups.length; i++) {
								getRows(group.subGroups[i], rows);
							}
						} else {
							for (var i = 0; i < group.subItems.length; i++) {
								rows.push(group.subItems[i]);
							}
						}
					}
					getRows(data, rows);
					//var aggregate = this.getcolumnaggregateddata(data.groupcolumn.datafield, ['sum'], true, rows);
					var aggregate = this.getcolumnaggregateddata('data0', ['sum'], true, rows);
				}

				return '<div class="' + toThemeProperty('jqx-grid-groups-row') + '" style="position: absolute;"><span>' + text + ', </span>' + '<span class="' + toThemeProperty('jqx-grid-groups-row-details') + '">' + "Total" + ' (' + aggregate.sum + ')' + '</span></div>';
			} else {
				return '<div class="' + toThemeProperty('jqx-grid-groups-row') + '" style="position: absolute;"><span>' + text + '</span>';
			}
		},

		calc401: function(index, datafield, value, defaultvalue, column, rowdata) {
			var total = parseFloat(rowdata.data1) / parseFloat(rowdata.data0);
			return "<div style='margin: 4px;' class='jqx-right-align'>" + total + "</div>";
		}

	};

});