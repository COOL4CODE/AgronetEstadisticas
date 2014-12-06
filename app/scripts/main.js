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
        'backbone.analytics': {
            deps: ['backbone'],
            exports: 'backbone.analytics'
        }
    },
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'backbone': '../bower_components/backbone/backbone',
        'backbone.marionette': '../bower_components/marionette/lib/backbone.marionette',
        'backbone.analytics': '../bower_components/backbone.analytics/backbone.analytics',
        'backbone.query.parameters': '../bower_components/backbone-query-parameters/backbone.queryparams',
        'backbone.localstorage': '../bower_components/backbone.localstorage/backbone.localStorage',
        'underscore': '../bower_components/lodash/dist/lodash',
        'bootstrap': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
        'highcharts': '../bower_components/highcharts/highcharts',
        'highstock': '../bower_components/highstock-release',
        'highmaps': '../bower_components/highmaps-release',
        'jqwidgets': '../app/vendor/jqwidgets',
        'text': '../bower_components/requirejs-plugins/lib/text',
        'json': '../bower_components/requirejs-plugins/src/json',
    }
});

require(['backbone',
    'backbone.marionette',
    'routers/main',
    'backbone.query.parameters',
    'backbone.analytics',
    'bootstrap'], function(Backbone, Marionette, MainRouter) {
    AgronetEstadisticas = new Marionette.Application();
    AgronetEstadisticas.addRegions({
        mainRegion: "#main-region"
    });
    AgronetEstadisticas.addInitializer(function(){
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

});