/* eslint-disable */
(function() {

    'use strict';

    var app = angular.module('flac_theme', ['ui.router', 'ui.bootstrap', 'ngAnimate']);

    app.config(function($stateProvider, $urlRouterProvider) {

        /*
         * Routes
         */
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'theme/views/home.html',
                controller: 'homeController'
            })
            .state('post', {
                url: '/post/:post',
                templateUrl: 'theme/views/post.html',
                controller: 'postController'
            })
            .state('page', {
                url: '/:page',
                templateUrl: 'theme/views/page.html',
                controller: 'pageController'
            })
            .state('tag', {
                url: '/tag/:tag',
                templateUrl: 'theme/views/list_posts.html',
                controller: 'tagController'
            })
            .state('author', {
                url: '/author/:author',
                templateUrl: 'theme/views/list_posts.html',
                controller: 'authorController'
            });

    });

    /*
     * Getting the necessary details from the API.
     */
    app.run(function($rootScope, $state, $http, $sce, $transitions) {
        $rootScope.api = '/api';
        $rootScope.url = '/';

        $rootScope.loader           = false;
        $rootScope.page_title       = '';
        $rootScope.meta_description = '';
        $rootScope.meta_image       = '';

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

        /*
         * Get website details from API.
         */
        $http.get($rootScope.api).then(function(res) {
            $rootScope.site = res.data;
            //console.log(res.data);
        })

        $transitions.onStart({}, function(transition) {
            $rootScope.loader = true;
            //console.log('start');
        });

        $transitions.onFinish({}, function(transition) {
            $rootScope.loader = false;
            //console.log('finish');
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

    app.filter('trust_html', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }]);

})();