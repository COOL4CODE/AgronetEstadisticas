/* global require */

'use strict';

window.AgronetEstadisticas = {};

require.config({
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'backbone.marionette': {
            deps: ['backbone'],
            exports: 'backbone.marionette'
        },
        'globalize.culture.es-CO': {
            deps: ['globalize'],
            exports: 'globalize'
        },
        'highstock': {
            deps: ['jquery'],
            exports: 'Highcharts'
        },
        'highcharts.exporting': {
            deps: ['highstock']
        }
    },
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'backbone': '../bower_components/backbone/backbone',
        'backbone.marionette': '../bower_components/marionette/lib/backbone.marionette',
        'backbone.query.parameters': '../bower_components/backbone-query-parameters/backbone.queryparams',
        'backbone.localstorage': '../bower_components/backbone.localstorage/backbone.localStorage',
        'underscore': '../bower_components/lodash/dist/lodash',
        'bootstrap': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
        'highcharts': '../bower_components/highcharts/highcharts',
        'highcharts.exporting': '../bower_components/highcharts/modules/exporting',
        'highstock': '../bower_components/highstock-release/highstock',
        'highmaps': '../bower_components/highmaps-release',
        'jqx': '../vendor/jqwidgets',
        'globalize': '../vendor/jqwidgets/globalization/globalize',
        'globalize.culture.es-CO': '../vendor/jqwidgets/globalization/globalize.culture.es-CO',
        'text': '../bower_components/requirejs-plugins/lib/text',
        'json': '../bower_components/requirejs-plugins/src/json',
        'jQuery.print': '../bower_components/jQuery.print/jQuery.print',
        'moment': '../bower_components/momentjs/moment'
    }
});

require(['backbone',
    'backbone.marionette',
    'routers/main',
    'backbone.query.parameters',
    'bootstrap',
    'highstock'
], function(Backbone, Marionette, MainRouter) {
    AgronetEstadisticas = new Marionette.Application();
    AgronetEstadisticas.addRegions({
        mainRegion: "#main-region",
        searchRegion: "#search-region"
    });
    AgronetEstadisticas.params = [];
    AgronetEstadisticas.xhrPool = [];
    AgronetEstadisticas.scrolls = {
        reportsList: 0,
        chartsList: 0
    };

    AgronetEstadisticas.addInitializer(function() {
        AgronetEstadisticas.Router = new MainRouter();
    });

    AgronetEstadisticas.navigate = function(route, options) {
        options || (options = {});
        Backbone.history.navigate(route, options);
    };

    AgronetEstadisticas.getCurrentRoute = function() {
        return Backbone.history.fragment;
    };

    AgronetEstadisticas.on("start", function() {
        if (Backbone.history) {
            Backbone.history.start();
        }
    });
    AgronetEstadisticas.start();

    ga('create', 'UA-57237839-1', 'auto');
    ga('set', {
        'appName': 'AgronetEstadisticas',
        'appVersion': '1.0',
        'appInstallerId': 'com.cool4code'
    });

});