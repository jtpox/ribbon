/* eslint-disable */
(function() {
    'use strict';

    var app = angular.module('ribbonAdmin', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ui.router.middleware', 'ngDraggable', 'angularFileUpload']);

    app.config(function($stateProvider, $urlRouterProvider) {

        /*
        * Routes
        */
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/assets/views/default.html',
                controller: 'indexController'
            })
            .state('logout', {
                url: '/logout',
                controller: 'logOutController'
            })
            .state('about_me', {
                url: '/user/about',
                templateUrl: '/assets/views/about_me.html',
                controller: 'aboutMeController'
            })
            .state('posts', {
                url: '/posts',
                templateUrl: '/assets/views/posts.html',
                controller: 'postsController'
            })
            .state('edit_post', {
                url: '/posts/edit/:id',
                templateUrl: '/assets/views/edit_post.html',
                controller: 'editPostController'
            })
            .state('new_post', {
                url: '/posts/new',
                templateUrl: '/assets/views/new_post.html',
                controller: 'newPostController'
            })
            .state('tags', {
                url: '/tags',
                templateUrl: '/assets/views/tags.html',
                controller: 'tagsController'
            })
            .state('users', {
                url: '/users',
                templateUrl: '/assets/views/users.html',
                controller: 'usersController'
            })
            .state('images', {
                url: '/images',
                templateUrl: '/assets/views/images.html',
                controller: 'imagesController'
            })
            .state('pages', {
                url: '/pages',
                templateUrl: '/assets/views/pages.html',
                controller: 'pagesController'
            })
            .state('new_page', {
                url: '/pages/new',
                templateUrl: '/assets/views/new_page.html',
                controller: 'newPageController'
            })
            .state('edit_page', {
                url: '/pages/edit/:id',
                templateUrl: '/assets/views/edit_page.html',
                controller: 'editPageController'
            });

    });

    /*
     * A compile directive to allow widgets to work.
     * As ng-bind-html filters out ng-click and other attributes, this should make them work.
     */
    app.directive('compile', ['$compile', function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            )};
    }]);

    /*
     * Session checking.
     * using localStorage
     */
    app.run(function($rootScope, $state, $http, $sce, $uibModal, $transitions) {
        //Assign API url to rootscope.
        $rootScope.api     = '/api';
        $rootScope.url     = '';//Used for dev purposes. Removed.

        $rootScope.widgets = {};

        let user                 = JSON.parse((localStorage.user === undefined)? '{}' : localStorage.getItem('user'));
        $rootScope.authenticated = false;
        $rootScope.currentUser   = user;
        //console.log(user);
        //Set headers for authentication with API.
        if( user.session_id && user.session_token )
        {
            //console.log('Here');
            $http.defaults.headers.common.session_id    = user.session_id;
            $http.defaults.headers.common.session_token = user.session_token;
        }

        /*
         * UI elements.
         * https://morgul.github.io/ui-bootstrap4/
         */
        $rootScope.bootstrap = {
            /*dropdown: {
                settings: false
            },*/
            collapse: {
                main: false
            }
        };

        //console.log(user);
        if( user && user.session_id && user.session_token )
        {
            //User is logged in.
            $http.post($rootScope.api + '/auth/check', { session_id: user.session_id, session_token: user.session_token }).then(function(res) {
                if( res.data.error == 1 )
                {
                    //Remove the token entirely as it doesn't exist.
                    localStorage.removeItem('user');
                    $state.go('index');
                }
                else
                {
                    $rootScope.authenticated = true;
                    $rootScope.currentUser   = user;
                    //Set headers for authentication with API.
                    //$http.defaults.headers.common.session_id    = user.session_id;
                    //$http.defaults.headers.common.session_token = user.session_id;
                    
                    if( $state.current.name == "index" )
                    {
                        $state.go('posts');
                    }
                }
            });
        }
        else
        {
            //User is not logged in.
            $rootScope.authenticated = false;
            $rootScope.currentUser   = null;

            $state.go('index');
        }

        /*
         * Images Widget
         */
        $rootScope.load_images_widget = function() {
            /*
             * Images Widget
             */
            $rootScope.widgets.images = {
                button_html: $sce.trustAsHtml('<button class="btn btn-primary" ng-click="widgets.images.show_modal()">Select Image</button'),
                selected: null
            };
            //console.log($rootScope.widgets);
            //$rootScope.$broadcast('widgets', $rootScope.widgets);

            $rootScope.widgets.images.show_modal = function() {
                $uibModal.open({
                    size: 'lg',
                    animation: true,
                    templateUrl: '/assets/views/widgets/images.html',
                    controller: function($scope, $uibModalInstance) {
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('close_images_widget');
                        };

                        /*
                        * Get all images.
                        */
                        $scope.images = [];
                        $http.put($rootScope.api + '/images').then(function(res) {
                            $scope.images = res.data;
                        });

                        /*
                         * Choose Image.
                         */
                        $scope.choose_image = function(index) {
                            if( index == null )
                            {
                                $rootScope.widgets.images.selected = null;
                            }
                            else
                            {
                                $rootScope.widgets.images.selected = $scope.images[index];
                            }

                            $rootScope.$broadcast('chosen_image', true);
                            $scope.cancel();
                        };
                    }
                });
            };
        };

        /*
         * Run widgets whenever there is a transition change.
         */
        $transitions.onSuccess({}, function(transition) {
            var user = JSON.parse(localStorage.getItem('user'));
            if( user && user.session_id && user.session_token )
            {
                $rootScope.load_images_widget();
            }
        });
    });

    /*
     * Filter dates that comes from the database into a readable format.
     */
    app.filter('format_date', function() {
        return function(val)
        {
            var date = new Date(val);

            var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            //MM DD, YY
            return month_names[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
    });

})();
