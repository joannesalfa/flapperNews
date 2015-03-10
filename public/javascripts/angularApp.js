//var url = $location.url();
var angular;
var location;





angular.module('flapperNews', ['ui.router'])

.run(function($location, $rootElement) {
  $rootElement.off('click');
})


// ui.router config


.config([           							
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
			// This is what causes the problem, because it hijacks urlchange, how did it work if https or http is prepended	
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'templates/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['posts', function(posts) {
						return posts.getAll();
					}]
				}
			})
			
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: 'templates/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams,posts) {
						return posts.get($stateParams.id);
					}]
				}
			});

		$urlRouterProvider.otherwise('home');
	}
])

// Main controller
.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
    
	$scope.prueba = location.host;
	$scope.posts = posts.posts;
	/*
	$scope.posts = [
	  {title: 'post 1', upvotes: 5},
	  {title: 'post 2', upvotes: 2},
	  {title: 'post 3', upvotes: 15},
	  {title: 'post 4', upvotes: 9},
	  {title: 'post 5', upvotes: 4},
	];
	*/
    //NO MORE DAMN RELATIVE LINKS
	$scope.addPost = function() {
          if (!/^https?:\/\//i.test($scope.link)) {
    $scope.link = 'http://' + $scope.link;
  }   
        
        
		if(!$scope.title || $scope.title === '' || $scope.link === '') { return; }
		posts.create({
			title: $scope.title,
            //Temp fix
//            link: $scope.link.replace(/^[http:\/\/|https:\/\/]+[www.|]+localhost:3000/g,'')
			link: $scope.link
		});
		$scope.title = '';
		$scope.link = '';
	};
	
	$scope.deletePost = function(post) {
		posts.delete(post);
	};
	
	$scope.incrementUpvotes = function(post) {
		posts.upvote(post);
	};
}])

// Post controller
.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post) {
	$scope.post = post;
	$scope.addComment = function() {
		if ($scope.body === '') { return; }
		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user',
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};
    $scope.incrementUpvotes = function (comment) {
        comment.upvotes += 1;
    };
    $scope.incrementUpvotes = function (comment) {
        posts.upvoteComment(post, comment);
    };
}])

// Angular service
.factory('posts', ['$http', function($http){
	// service body
	var o = {
		posts: []
	};
	// get all posts
	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};
	// create new posts
	o.create = function(post) {
		return $http.post('/posts', post).success(function(data) {
			o.posts.push(data);
		});
	};
	// upvote
	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
			post.upvotes += 1;
		});
	};
	// get single post
	o.get = function(id) {
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};
	// delete single post
	o.delete = function(post) {
		return $http.delete('/posts/' + post._id).success(function(data) {
			angular.copy(data, o.posts);
		});
	};
	// add comment
	o.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};
	// upvote comment
	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
			.success(function(data) {
				comment.upvotes += 1;
			});
	};
	return o;
}]);