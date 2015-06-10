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

	var moment = require('moment');

	var toThemeProperty = function(className) {
		return className + ' ' + className + '-' + 'bootstrap';
	};

	String.prototype.wordWrap = function(m, b, c) {
		var i, j, l, s, r;
		if (m < 1)
			return this;
		for (i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
			for (s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(
					j)).length ? b : ""))
				j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input
				.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m)
					.match(/^\S*/)).input.length;
		return r.join("\n");
	};

	return {

		longTextFormatter: function() {
			return this.point.name.wordWrap(75, '<br/>', 0) +
				'<br/><span style="font-size:14px;"><strong>Volumen: ' +
				Highcharts.numberFormat(
					this.point.y, 2, ",", ".") +
				'</strong></span>';
		},

		groups401: function(text, group, expanded, data) {
			if (data.groupcolumn.datafield === 'pais' || data.groupcolumn.datafield ===
				'partida' || data.groupcolumn.datafield === 'anio') {
				//var number = dataAdapter.formatNumber(group, data.groupcolumn.cellsformat);
				console.log(group);
				var number = group;
				var text = data.groupcolumn.text + ': ' + number;
				if (data.subItems.length > 0) {
					//var aggregate = this.getcolumnaggregateddata(data.groupcolumn.datafield, ['sum'], true, data.subItems);
					var aggregate = this.getcolumnaggregateddata('volumen', ['sum'], true,
						data.subItems);
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
					var aggregate = this.getcolumnaggregateddata('volumen', ['sum'], true,
						rows);
				}

				return '<div class="' + toThemeProperty('jqx-grid-groups-row') +
					'" style="position: absolute;"><span>' + text + ', </span>' +
					'<span class="' + toThemeProperty('jqx-grid-groups-row-details') + '">' +
					"Total" + ' (' + aggregate.sum + ')' + '</span></div>';
			} else {
				return '<div class="' + toThemeProperty('jqx-grid-groups-row') +
					'" style="position: absolute;"><span>' + text + '</span>';
			}
		},

		calc401: function(index, datafield, value, defaultvalue, column, rowdata) {
			var total = parseFloat(rowdata.volumen) / parseFloat(rowdata.valor);
			return "<div style='margin: 4px;' class='jqx-right-align'>" + total.toFixed(
				2) + "</div>";
		},

		formatDate: function(index, datafield, value, defaultvalue, column,
			rowdata) {
			return "<div style='margin: 4px;' class='jqx-left-align'>" + moment(
				rowdata[datafield.replace("@", "")]).format("D MMMM/YYYY") + "</div>";
		}

	};

});
