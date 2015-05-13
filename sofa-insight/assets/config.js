seajs.config({
    plugins: ['debug', /*'nocache', */'text', 'style'],
    alias: {
        '$': 'jquery/jquery/1.10.1/jquery',
        'bootstrap': 'gallery/bootstrap/2.3.2/bootstrap',
        'underscore': 'gallery/underscore/1.4.4/underscore',
        'handlebars': 'gallery/handlebars/1.0.2/handlebars',
        'bootstrap-datetimepicker': 'gallery/bootstrap-datetimepicker/bootstrap-datetimepicker',
        'list': 'gallery/list/0.2.1/list',
        'highcharts': 'jquery/highcharts/3.0.2/highcharts',
        'highstock': 'jquery/highstock/1.3.2/highstock',
        'highslide': 'gallery/highslide/4.1.13/highslide',
        'treetable': 'jquery/treetable/3.0.1/treetable-debug',
        'sparkline': 'jquery/sparkline/2.1.2/sparkline'
    }
});

seajs.use("/assets/main");
