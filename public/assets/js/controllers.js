/* eslint-disable */
(function () {

    'use strict';
    let api = 'http://localhost:8081/api';

    var app = angular.module('ribbonAdmin');

    app.controller('indexController', function ($scope, $state, $http, $rootScope) {
        $scope.signInError = false;
        $scope.signInErrorMsg = null;

        $scope.signIn = function () {
            $http.post($rootScope.api + '/auth', $scope.login).then(function (res) {
                //console.log(res);
                if (res.data.error == 1) {
                    $scope.signInError = true;
                    $scope.signInErrorMsg = 'Error logging in.';
                }
                else {
                    var session = {
                        session_id: res.data.session_id,
                        session_token: res.data.session_token,
                        username: res.data.username,
                        user_id: res.data.user_id
                    };
                    localStorage.setItem('user', JSON.stringify(session));

                    $rootScope.authenticated = true;
                    $rootScope.currentUser = session;

                    //Set headers for authentication with API.
                    $http.defaults.headers.common.session_id      = res.data.session_id;
                    $http.defaults.headers.common.session_token   = res.data.session_token;

                    $state.go('posts');
                }
            });
        };
    });

    app.controller('updateController', function($scope, $state, $http, $rootScope) {
        $http.get($rootScope.api + '/update').then(function(res) {
            if( res.data.error == 0 )
            {
                console.log('Update successful!');
            }
            else
            {
                console.log('Error updating.');
            }
        });
    });

    app.controller('logOutController', function ($scope, $state, $http, $rootScope) {
        $http.post($rootScope.api + '/auth/logout').then(function (res) {
            //console.log(res);
            //console.log($rootScope.currentUser);
            if (res.data.error == 0) {
                localStorage.removeItem('user');

                $rootScope.authenticated = false;
                $rootScope.currentUser = null;

                delete $http.defaults.headers.common.session_id;
                delete $http.defaults.headers.common.session_token;

                $state.go('index');
            }
        });
    });

    app.controller('aboutMeController', function ($scope, $state, $http, $rootScope) {
        $scope.alert = {
            about_me: {
                success: false,
                error: {
                    msg: null,
                    show: false
                }
            }
        };

        /*
         * Get user details from API.
         */
        $http.post($rootScope.api + '/auth/details').then(function(res) {
            //console.log(res.data[0].about);
            $scope.about_me = res.data[0].about;
        });

        $scope.edit_about = function() {
            //console.log('Test');
            $scope.alert.about_me.success = false;
            $scope.alert.about_me.error   = false;
            //console.log($rootScope.currentUser);
            $http.post($rootScope.api + '/auth/update/about', { about: $scope.about_me }).then(function(res) {
                if( res.data.error == 1 )
                {
                    $scope.alert.about_me.error = true;
                    $scope.alert.about_me.msg   = 'Error updating your information.';
                }
                else
                {
                    $scope.alert.about_me.success = true;
                }
            });
        };
    });

    app.controller('postsController', function ($scope, $state, $http, $rootScope) {
        //console.log('Test');
        /*
         * Get all posts.
         */
        $http.get($rootScope.api + '/blog').then(function (res) {
            //console.log(res.data);
            $scope.posts = res.data;
        });
    });

    app.controller('newPostController', function ($scope, $state, $http, $rootScope) {
        //Setup SimpleMDE markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('markdown_content'),
            placeholder: 'Post content.',
            status: false,
            autoDownloadFontAwesome: false
        });


        //Error Messages
        $scope.error = {
            show: false,
            msg: null
        };

        $scope.post = {
            date: new Date()
        };

        $scope.current_date = function() {
            //console.log('Here');
            $scope.post.date = new Date();
        };

        //Getting all the tags.
        $http.get($rootScope.api + '/tags').then(function (res) {
            //console.log(res.data);
            $scope.tags = res.data;
        });

        //Submit button.
        $scope.submit_post = function () {
            //console.log($scope.post.tag);
            var selected_image = ($rootScope.widgets.images.selected == null)? null : $rootScope.widgets.images.selected._id;
            //console.log($rootScope.widgets.images.selected);

            $http.post($rootScope.api + '/blog', { title: $scope.post.title, content: simplemde.value(), tag: $scope.post.tag, image: selected_image, schedule: $scope.post.date, hidden: $scope.post.hidden }).then(function (res) {
                //console.log(res);
                $rootScope.widgets.images.selected = null;//Remove image from selected.

                if (res.data.error == 1) {
                    $scope.error.show = true;
                    $scope.error.msg = 'An error has occured while posting.'
                }
                else {
                    //console.log(res.data);
                    $state.go('edit_post', { id: res.data.post_id });
                }
            });
        };
    });

    app.controller('editPostController', function ($scope, $state, $http, $rootScope) {
        //$rootScope.$broadcast();//Rebroadcast $rootScope as apparently, I am trying to read it before it is written. For use BEFORE an event is called.
        //$rootScope.$broadcast.apply($rootScope, null);
        //console.log($rootScope);
        //Setup SimpleMDE markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('markdown_content'),
            placeholder: 'Post content.',
            status: false,
            autoDownloadFontAwesome: false,
            autofocus: true
        });

        $scope.post = {};
        $scope.alert = {
            success: false,
            error: {
                show: false,
                msg: null
            }
        };

        //Getting all the tags.
        $http.get($rootScope.api + '/tags').then(function (res) {
            //console.log(res.data);
            $scope.tags = res.data;
        });

        //Retrieve post data from API.
        $http.get($rootScope.api + '/blog/' + $state.params.id).then(function (res) {
            //console.log($rootScope);
            $scope.post.title                  = res.data[0].title;
            simplemde.value(res.data[0].content);
            $scope.post.tag                    = res.data[0].tag._id;
            //$rootScope.widgets.images.selected = res.data[0].image;
            $scope.post.image      = res.data[0].image;
            $scope.post.hidden     = res.data[0].hidden;
            $scope.post.created_at = new Date(res.data[0].created_at);

            let original_date      = new Date(res.data[0].created_at);
            $scope.reset_date      = function() {
                $scope.post.created_at = original_date;
            };
        });

        /*
         * As we can't go through a $rootScope variable without being in an event as it has not been written yet, we use an event to modify a local scope instead.
         * And then, use logic to determine if a new image is selected or not.
         */
        $rootScope.$on('chosen_image', function(event, data) {
            $scope.post.image = null;
            //console.log('HAHA!');
        });

        $scope.edit_post = function () {
            //Close all alerts.
            $scope.alert.success    = false;
            $scope.alert.error.show = false;

            var selected_image      = null;
            if( $rootScope.widgets.images.selected !== null && $scope.post.image == null )
            {
                selected_image = $rootScope.widgets.images.selected._id;
            }
            else if( $rootScope.widgets.images.selected == null && $scope.post.image !== null )
            {
                selected_image = $scope.post.image._id;
            }

            $http.put($rootScope.api + '/blog/' + $state.params.id, { title: $scope.post.title, content: simplemde.value(), tag: $scope.post.tag, image: selected_image, schedule: $scope.post.created_at, hidden: $scope.post.hidden }).then(function (res) {
                //console.log(res);
                $scope.post.image                  = $rootScope.widgets.images.selected;
                $rootScope.widgets.images.selected = null;//Remove image from selected.

                if (res.data.error == 1) {
                    $scope.alert.error.show = true;
                    $scope.alert.error.msg = 'An error has occured while updating the post.'
                }
                else {
                    //console.log(res.data);
                    $scope.alert.success = true;
                }
            });
        };

        $scope.delete_post = function () {
            //console.log($rootScope.currentUser);
            //Close all alerts.
            $scope.alert.success = false;
            $scope.alert.error.show = false;

            $http.post($rootScope.api + '/blog/delete/' + $state.params.id).then(function (res) {
                //console.log(res);
                if (res.data.error == 1) {
                    $scope.alert.error.show = true;
                    $scope.alert.error.msg = 'An error has occured while deleting the post.'
                }
                else {
                    $state.go('posts');
                }
            });
        };
    });

    app.controller('tagsController', function ($scope, $state, $http, $rootScope) {
        //Alerts
        $scope.alert = {
            new_tag: {
                error: {
                    show: false,
                    msg: null
                },
                success: false
            },
            update_tag: {
                error: {
                    show: false,
                    msg: null
                },
                success: false
            }
        };

        //List all tags.
        $http.get($rootScope.api + '/tags').then(function (res) {
            $scope.tags = res.data;
            //console.log(res.data);
        });

        //Add a new tag.
        $scope.new_tag = function () {
            //Close all alert boxes.
            $scope.alert.new_tag.error.show = false;
            $scope.alert.new_tag.success = false;

            $http.post($rootScope.api + '/tags', { title: $scope.new_tag.title, content: $scope.new_tag.content }).then(function (res) {
                if (res.data.error == 1) {
                    $scope.alert.new_tag.error.show = true;
                    $scope.alert.new_tag.error.msg = 'Error adding new tag.';
                }
                else {
                    $scope.alert.new_tag.success = true;
                    $scope.tags.push(res.data.tag);
                }
            });
        };

        $scope.edit_tag = {
            index: null
        };
        //Show tag in "edit tag" section.
        $scope.show_tag = function (index) {
            //console.log(index);
            $scope.edit_tag.index = index;
            $scope.edit_tag.id = $scope.tags[index]._id;
            $scope.edit_tag.title = $scope.tags[index].title;
            $scope.edit_tag.content = $scope.tags[index].content;
        };

        //Update tag.
        $scope.edit_tag = function () {
            //Close all alert boxes.
            $scope.alert.update_tag.error.show = false;
            $scope.alert.update_tag.success = false;

            $http.put($rootScope.api + '/tags/' + $scope.edit_tag.id, { title: $scope.edit_tag.title, content: $scope.edit_tag.content }).then(function (res) {
                if (res.data.error == 1) {
                    $scope.alert.update_tag.error.show = true;
                    $scope.alert.update_tag.error.msg = 'Error updating tag.';
                }
                else {
                    $scope.alert.update_tag.success = true;
                    $scope.tags[$scope.edit_tag.index].title = $scope.edit_tag.title;
                    $scope.tags[$scope.edit_tag.index].content = $scope.edit_tag.content;

                    //Unassign all form elements.
                    $scope.edit_tag.title = null;
                    $scope.edit_tag.content = null;
                    $scope.edit_tag.id = null;
                    $scope.edit_tag.index = null;
                }
            });
        };

        //Delete tag.
        $scope.delete_tag = function () {
            $http.post($rootScope.api + '/tags/delete/' + $scope.edit_tag.id).then(function (res) {
                if (res.data.error == 0) {
                    //Remove the tag from the list.
                    //console.log($scope.tags);
                    $scope.tags.splice($scope.edit_tag.index, 1);
                    //console.log($scope.tags);

                    //Unassign all form elements.
                    $scope.edit_tag.title = null;
                    $scope.edit_tag.content = null;
                    $scope.edit_tag.id = null;
                    $scope.edit_tag.index = null;
                }
            });
        };
    });

    app.controller('usersController', function ($scope, $state, $http, $rootScope) {
        //Alerts
        $scope.alert = {
            new_user: {
                error: {
                    show: false,
                    msg: null
                },
                success: false
            },
            update_user: {
                error: {
                    show: false,
                    msg: null
                },
                success: false
            }
        };

        //Getting all users.
        $http.get($rootScope.api + '/users').then(function (res) {
            $scope.users = res.data;
        });

        $scope.edit_user = {
            index: null
        };
        //Show user in "edit user" section.
        $scope.show_user = function (index) {
            //console.log('Test');
            //console.log(index);
            $scope.edit_user.index    = index;
            $scope.edit_user.id       = $scope.users[index]._id;
            $scope.edit_user.username = $scope.users[index].username;
            $scope.edit_user.email    = $scope.users[index].email;
        };

        //Adding a new user.
        $scope.new_user = function() {
            //Close all alert boxes.
            $scope.alert.new_user.error.show = false;
            $scope.alert.new_user.success = false;

            $http.post($rootScope.api + '/users', { username: $scope.new_user.username, password: $scope.new_user.password, email: $scope.new_user.email }).then(function (res) {
                if (res.data.error == 1) {
                    $scope.alert.new_user.error.show = true;
                    $scope.alert.new_user.error.msg = 'Error adding new user.';
                }
                else {
                    $scope.alert.new_user.success = true;
                    $scope.users.push(res.data.user);
                }
            });
        };

        $scope.edit_user = function() {
             //Close all alert boxes.
             $scope.alert.new_user.error.show = false;
             $scope.alert.new_user.success = false;
 
             $http.put($rootScope.api + '/users/' + $scope.edit_user.id, { username: $scope.edit_user.username, password: $scope.edit_user.password, email: $scope.edit_user.email }).then(function (res) {
                 if (res.data.error == 1) {
                     $scope.alert.update_user.error.show = true;
                     $scope.alert.update_user.error.msg = 'Error updating tag.';
                 }
                 else {
                     $scope.alert.update_user.success = true;
                     $scope.users[$scope.edit_user.index].username = $scope.edit_user.username;
 
                     //Unassign all form elements.
                     $scope.edit_user.username = null;
                     $scope.edit_user.password = null;
                     $scope.edit_user.email    = null
                     $scope.edit_user.id       = null;
                     $scope.edit_user.index    = null;
                 }
             });
        };

        $scope.delete_user = function() {
            //console.log($rootScope.currentUser);
            $http.post($rootScope.api + '/users/delete/' + $scope.edit_user.id).then(function (res) {
                if (res.data.error == 0) {
                    //Remove the tag from the list.
                    //console.log($scope.tags);
                    $scope.users.splice($scope.edit_user.index, 1);
                    //console.log($scope.tags);

                    //Check if deleted user is the same as the one logged in.
                    if( $scope.edit_user.id == $rootScope.currentUser.user_id )
                    {
                        $state.go('logout');
                    }

                    //Unassign all form elements.
                    $scope.edit_user.title = null;
                    $scope.edit_user.content = null;
                    $scope.edit_user.id = null;
                    $scope.edit_user.index = null;
                }
            });
        };
    });
    
    app.controller('pagesController', function ($scope, $state, $http, $rootScope) {
        //Get all pages.
        $http.get($rootScope.api + '/pages/admin').then(function(res) {
            $scope.pages = res.data;
        });
    });

    app.controller('newPageController', function ($scope, $state, $http, $rootScope) {
        //Setup SimpleMDE markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('markdown_content'),
            placeholder: 'Page description.',
            status: false,
            autoDownloadFontAwesome: false
        });

        //Establish alerts.
        $scope.alerts = {
            error: {
                show: false,
                msg: null
            }
        };

        /*
         * Toggling rearrange.
         * Rearranging will never work with form elements as well as other interactive stuff.
         */
        $scope.rearrange = false;
        $scope.toggle_rearrange = function() {
            $scope.rearrange = !$scope.rearrange;
            //console.log($scope.rearrange);
        };

        //Content boxes.
        $scope.content_boxes = [
            {
                title: 'Example Title',
                content: 'Example content.',
                content_column: 3
            },
            {
                title: 'Example Title 2',
                content: 'Example content.',
                content_column: 3
            },
            {
                title: 'Example Title 3',
                content: 'Example content.',
                content_column: 3
            }
        ];

        $scope.add_content_box = function() {
            $scope.content_boxes.push({
                title: 'Example Title',
                content: 'Example Content',
                content_column: 3
            });
        };

        $scope.remove_content_box = function(index) {
            $scope.content_boxes.splice(index, 1);
        };

        $scope.on_drop_complete = function(index, obj, evt) {
            var other_obj   = $scope.content_boxes[index];
            var other_index = $scope.content_boxes.indexOf(obj);
            
            $scope.content_boxes[index]       = obj;
            $scope.content_boxes[other_index] = other_obj;
        };

        $scope.page = {
            hidden: false
        };

        $scope.new_page = function() {
            $scope.alerts.error.show = false;

            var selected_image = ($rootScope.widgets.images.selected == null)? null : $rootScope.widgets.images.selected._id;

            $http.post($rootScope.api + '/pages', { title: $scope.page.title, content: simplemde.value(), boxes: JSON.stringify($scope.content_boxes), image: selected_image, hidden: $scope.page.hidden }).then(function(res) {
                //console.log(res);
                $rootScope.widgets.images.selected = null;

                if( res.error == 1 )
                {
                    $scope.alerts.error.show = true;
                    $scope.alerts.error.msg  = 'Error adding new page.';
                }
                else
                {
                    $state.go('edit_page', { id: res.data.page_id });
                }
            });
        };
    });

    app.controller('editPageController', function ($scope, $state, $http, $rootScope) {
        //Setup SimpleMDE markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('markdown_content'),
            placeholder: 'Page description.',
            status: false,
            autoDownloadFontAwesome: false
        });

        //Establish alerts.
        $scope.alerts = {
            error: {
                show: false,
                msg: null
            },
            success: false
        };

        $scope.page = {};
        $scope.content_boxes = [];
        //Retrieve page information.
        $http.get($rootScope.api + '/pages/' + $state.params.id).then(function(res) {
            //console.log(res.data);
            //$scope.page = res.data.details;
            $scope.page.title    = res.data.details.title;
            simplemde.value(res.data.details.description);
            $scope.content_boxes = res.data.boxes;
            $scope.page.image    = res.data.details.image;
            $scope.page.hidden   = res.data.details.hidden;
            //console.log(res.data);
        });

        var chosen_image = false;
        $rootScope.$on('chosen_image', function(event, data) {
            $scope.page.image = null;
            chosen_image      = true;
            //console.log('HAHA!');
        });

        $scope.on_drop_complete = function(index, obj, evt) {
            var other_obj   = $scope.content_boxes[index];
            var other_index = $scope.content_boxes.indexOf(obj);
            
            $scope.content_boxes[index]       = obj;
            $scope.content_boxes[other_index] = other_obj;
        };

        /*
         * Toggling rearrange.
         * Rearranging will never work with form elements as well as other interactive stuff.
         */
        $scope.rearrange = false;
        $scope.toggle_rearrange = function() {
            $scope.rearrange = !$scope.rearrange;
            //console.log($scope.rearrange);
        };

        $scope.add_content_box = function() {
            $scope.content_boxes.push({
                title: 'Example Title',
                content: 'Example Content',
                content_column: 3
            });
        };

        $scope.remove_content_box = function(index) {
            $scope.content_boxes.splice(index, 1);
        };

        $scope.edit_page = function() {
            $scope.alerts.error.show = false;
            $scope.alerts.success    = false;

            var selected_image      = null;
            if( $rootScope.widgets.images.selected !== null && $scope.page.image == null )
            {
                selected_image = $rootScope.widgets.images.selected._id;
            }
            else if( $rootScope.widgets.images.selected == null && $scope.page.image !== null )
            {
                selected_image = $scope.page.image._id;
            }

            //console.log(selected_image);
            //console.log($scope.content_boxes);

            $http.put($rootScope.api + '/pages/' + $state.params.id, { title: $scope.page.title, content: simplemde.value(), boxes: JSON.stringify($scope.content_boxes), image: selected_image, hidden: $scope.page.hidden }).then(function(res) {
                //console.log(res);
                $scope.page.image                  =  (chosen_image)? $rootScope.widgets.images.selected : $scope.page.image;
                $rootScope.widgets.images.selected = null;

                if( res.error == 1 )
                {
                    $scope.alerts.error.show = true;
                    $scope.alerts.error.msg  = 'Error updating page.';
                }
                else
                {
                    $scope.alerts.success = true;
                }
            });
        };

        $scope.delete_page = function() {
            $http.post($rootScope.api + '/pages/delete/' + $state.params.id).then(function(res) {
                $state.go('pages');
            });
        };
    });

    app.controller('imagesController', function ($scope, $state, $http, $rootScope, FileUploader) {
        //var form_data = { session_id: $rootScope.currentUser.session_id, session_token: $rootScope.currentUser.session_token }

        /*
         * As $rootScope is not working, use localStorage natively.
         */
        var user      = JSON.parse(localStorage.getItem('user'));
        // var form_data = { session_id: user.session_id, session_token: user.session_token };
        //console.log(form_data);

        /*
         * Retrieve all images from the API.
         */
        //console.log(form_data);
        $scope.images = [];
        //console.log($http.defaults.headers.common);
        $http.get($rootScope.api + '/images').then(function(res) {
            //console.log(res);
            $scope.images = res.data;
        });

        var uploader = $scope.uploader = new FileUploader({
            url: $rootScope.api + '/images',
            /* formData: form_data, */
            removeAfterUpload: true
        });

        //Uploader filter.
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|gmp|gif|'.indexOf(type) !== -1;
            }
        });

        /*uploader.onBeforeUploadItem = function(item) {
            item.formData.push(form_data);
        };*/

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //fileItem.remove();
            //console.log(response);
            $scope.images.push(response.image);
        };

        //Delete image.
        $scope.delete_image = function(index) {
            //console.log(index);
            $http.post($rootScope.api + '/images/delete/' + $scope.images[index]._id).then(function(res) {
                $scope.images.splice(index, 1);
            });
        };
    });

})();