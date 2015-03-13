define(function(require) {

    'use strict';
    require('highstock');
    require('highcharts.exporting');

    // Dummy object so we can reuse our canvas-tools.js without errors
    //Highcharts.CanVGRenderer = {};

    /**
     * Downloads a script and executes a callback when done.
     * @param {String} scriptLocation
     * @param {Function} callback
     */
    function getScript(scriptLocation, callback) {
        var head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = scriptLocation;
        script.onload = callback;

        head.appendChild(script);
    }

    /**
     * Add a new method to the Chart object to invoice a local download
     */
    Highcharts.Chart.prototype.exportChartLocal = function(options) {

        var chart = this,
            svg = this.getSVG(), // Get the SVG
            canvas,
            a,
            href,
            extension,
            download = function() {

                var blob;

                // IE specific
                if (navigator.msSaveOrOpenBlob) {

                    // Get JPEG blob
                    if (extension === 'jpeg') {
                        blob = canvas.msToBlob();

                        // Get SVG blob
                    } else {
                        blob = new MSBlobBuilder;
                        blob.append(svg);
                        blob = blob.getBlob('image/svg+xml');
                    }

                    navigator.msSaveOrOpenBlob(blob, options.name);

                    // HTML5 download attribute
                } else {
                    a = document.createElement('a');
                    a.href = href;
                    a.download = options.name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            },
            prepareCanvas = function() {
                canvas = document.createElement('canvas'); // Create an empty canvas
                window.canvg(canvas, svg); // Render the SVG on the canvas

                href = canvas.toDataURL('image/jpeg');
                extension = 'jpeg';
            };

        // Add an anchor and apply the download to the button
        if (options && options.type === 'image/svg+xml') {
            href = 'data:' + options.type + ',' + svg;
            extension = 'svg';
            download();

        } else {

            // It's included in the page or preloaded, go ahead
            if (window.canvg) {
                prepareCanvas();
                download();

                // We need to load canvg before continuing
            } else {
                this.showLoading();
                getScript(Highcharts.getOptions().global.canvasToolsURL, function() {
                    chart.hideLoading();
                    prepareCanvas();
                    download();
                });
            }
        }
    };

});