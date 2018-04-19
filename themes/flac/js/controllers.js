/* eslint-disable */
(function () {

    'use strict';

    var format_date = function(val) {
        var date = new Date(val);

            var month_names = ['Jan', 'Fed', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'];

            //MM DD, YY
            return date.getDate() + ' ' + month_names[date.getMonth()] + ' ' + date.getFullYear();
    };

    var app = angular.module('flac_theme');

    app.controller('homeController', function ($scope, $state, $http, $rootScope) {
        $rootScope.loader           = true;
        $rootScope.page_title       = '';
        $rootScope.meta_description = $rootScope.site.name  + ', powered by ribbon.';
        $rootScope.meta_image       = '/assets/img/represent.png';

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
                $rootScope.page_title       = res.data[0].title;
                $scope.post                 = res.data;
                $rootScope.meta_description = res.data[0].title + ' by ' + res.data[0].created_by.username + ' on ' + format_date(res.data[0].created_at);
                // console.log(res.data[0].image);
                $rootScope.meta_image       = (res.data[0].image)? '/uploads/images/' + res.data[0].image.file_name : '/assets/img/represent.png';
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
                $rootScope.page_title       = res.data.details.title;
                $rootScope.meta_description = res.data.details.title + ' - ' + res.data.details.description.split(' ').splice(0, 50).join(' ');
                $rootScope.meta_image       = (res.data.details.image)? '/uploads/images/' + res.data.details.image.file_name : '/assets/img/represent.png';
                $scope.page           = {
                    details: res.data.details,
                    boxes: res.data.boxes
                };
            }
            else
            {
                $state.go('index');
            }
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
            $rootScope.loader     = false;

            $rootScope.page_title       = res.data.tag.title;
            $rootScope.meta_description = res.data.tag.title + ' - ' + res.data.tag.content;
            $rootScope.meta_image       = '/assets/img/represent.png';

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
            $rootScope.loader     = false;

            $rootScope.page_title       = res.data.user.username;
            $rootScope.meta_description = res.data.user.username + ' - ' + res.data.user.about;
            $rootScope.meta_image       = '/uploads/profile/' + res.data.user.avatar;

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