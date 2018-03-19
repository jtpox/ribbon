(function() {

    'use strict';

    var app = angular.module('flac_theme', ['ui.router', 'ui.bootstrap']);

    app.config(function($stateProvider, $urlRouterProvider) {

        /*
         * Routes
         */
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'themes/flac/views/home.html',
                controller: 'homeController'
            })
            .state('post', {
                url: '/post/:post',
                templateUrl: 'themes/flac/views/post.html',
                controller: 'postController'
            })
            .state('page', {
                url: '/:page',
                templateUrl: 'themes/flac/views/page.html',
                controller: 'pageController'
            });

    });

    /*
     * Getting the necessary details from the API.
     */
    app.run(function($rootScope, $state, $http, $sce, $transitions) {
        $rootScope.api = '/api';
        $rootScope.url = '/';

        /*
         * UI elements.
         * https://morgul.github.io/ui-bootstrap4/
         */
        $rootScope.bootstrap = {
            collapse: {
                main: false
            }
        };

        /*
         * Get all the pages from the API.
         */
        $http.get($rootScope.api + '/pages').then(function(res) {
            //console.log(res);
            $rootScope.pages = res.data;
        });
    });

    /*
     * Turn markdown into renderable HTML.
     */
    app.filter('markdown', ['$sce', function($sce) {
        return function(val) {
            var converter = new showdown.Converter({
                simpleLineBreaks: true
            });
            return $sce.trustAsHtml(converter.makeHtml(val));
        };
    }]);

    app.filter('markdown_limit', ['$sce', function($sce) {
        return function(val) {
            var converter = new showdown.Converter({
                simpleLineBreaks: true
            });
            val           =  val.split(' ').splice(0, 50).join(' ');
            //console.log(val);
            return $sce.trustAsHtml(converter.makeHtml(val));
        };
    }]);

    app.filter('format_date', function() {
        return function(val)
        {
            var date = new Date(val);

            var month_names = ['Jan', 'Fed', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'];

            //MM DD, YY
            return date.getDate() + ' ' + month_names[date.getMonth()] + ' ' + date.getFullYear();
        }
    });

})();