(function () {

    'use strict';

    var app = angular.module('flac_theme');

    app.controller('homeController', function ($scope, $state, $http, $rootScope) {
        $rootScope.loader  = true;

        $scope.page        = 1;
        $scope.total_pages = 0;
        $scope.posts = [];
        /*
         * Get blog posts.
         */
        $http.get($rootScope.api + '/blog/page/' + $scope.page).then(function(res) {
            $rootScope.loader  = false;

            //console.log(res.data.docs);
            $scope.total_pages = res.data.pages;
            $scope.posts       = res.data.docs;
            //console.log($scope.posts);
        });

        /*
         * Load older posts.
         */
        $scope.load_more = function() {
            $scope.page = $scope.page + 1;

            $http.get($rootScope.api + '/blog/page/' + $scope.page).then(function(res) {
                //console.log(res.data.docs);
                for( var i = 0; i < res.data.docs.length; i++ )
                {
                    $scope.posts.push(res.data.docs[i]);
                }
            });
        };
    });

    app.controller('postController', function($scope, $state, $http, $rootScope) {
        /*
         * Get blog post by ID.
         */
        $http.get($rootScope.api + '/blog/url/' + $state.params.post).then(function(res) {
            if( res.data.length > 0 )
            {
                $scope.post = res.data;
            }
            else
            {
                state.go('home');
            }
           //console.log(res.data); 
        });
    });

    app.controller('pageController', function($scope, $state, $http, $rootScope) {
        /*
         * Get page by ID.
         */
        $http.get($rootScope.api + '/pages/url/' + $state.params.page).then(function(res) {
            if( res.data.error !== 1 )
            {
                $scope.page = {
                    details: res.data.details,
                    boxes: res.data.boxes
                };
            }
            else
            {
                $state.go('index');
            }
            //console.log(res.data);
        });
    });

    app.controller('tagController', function($scope, $state, $http, $rootScope) {
        $rootScope.loader  = true;
        /*
         * Get posts by tags.
         */
        $scope.page        = 1;
        $scope.total_pages = 0;
        $scope.posts = [];
        /*
         * Get blog posts.
         */
        $http.get($rootScope.api + '/tags/' + $state.params.tag + '/page/' + $scope.page).then(function(res) {
            $rootScope.loader  = false;

            //console.log(res.data.docs);
            $scope.list        = res.data.tag;
            $scope.total_pages = res.data.posts.pages;
            $scope.posts       = res.data.posts.docs;
            //console.log($scope.posts);
        });

        /*
         * Load older posts.
         */
        $scope.load_more = function() {
            $scope.page = $scope.page + 1;

            $http.get($rootScope.api + '/tags/' + $state.params.tag + '/page/' + $scope.page).then(function(res) {
                //console.log(res.data.docs);
                for( var i = 0; i < res.data.posts.docs.length; i++ )
                {
                    $scope.posts.push(res.data.posts.docs[i]);
                }
            });
        };
    });

    app.controller('authorController', function($scope, $state, $http, $rootScope) {
        $rootScope.loader  = true;
        /*
         * Get posts by author.
         */
        $scope.page        = 1;
        $scope.total_pages = 0;
        $scope.posts = [];
        /*
         * Get blog posts.
         */
        $http.get($rootScope.api + '/users/' + $state.params.author + '/page/' + $scope.page).then(function(res) {
            $rootScope.loader  = false;

            //console.log(res.data.docs);
            $scope.list        = {
                title: res.data.user.username,
                content: res.data.user.about
            };
            $scope.total_pages = res.data.posts.pages;
            $scope.posts       = res.data.posts.docs;
            //console.log($scope.posts);
        });

        /*
         * Load older posts.
         */
        $scope.load_more = function() {
            $scope.page = $scope.page + 1;

            $http.get($rootScope.api + '/users/' + $state.params.author + '/page/' + $scope.page).then(function(res) {
                //console.log(res.data.docs);
                for( var i = 0; i < res.data.posts.docs.length; i++ )
                {
                    $scope.posts.push(res.data.posts.docs[i]);
                }
            });
        };
    });

})();