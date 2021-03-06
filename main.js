//Colin Bartels
//INFO 343 C 
// This file contains the javascript code for the spotify challenge

//Set up angular app, uses angular-spotify github repo
var app = angular.module('app', ['spotify']);

//Configures spotifiy authorization
app.config(function(SpotifyProvider) {
	SpotifyProvider.setClientId('5b1236cf83ea44d59b856d51b4502b8d');
	SpotifyProvider.setRedirectUri('http://students.washington.edu/bartelsc/info343/spotify-challenge/callback.html');
	SpotifyProvider.setScope('playlist-read-private playlist-read-collaborative');
});

//Sets up controller
var MainCtrl = app.controller('MainCtrl', function($scope, Spotify) {
	$scope.search = {};
	var userToken = "";

	//Logs into spotify when button is clicked
 	$scope.login = function() {
 	 	Spotify.login().then(function() {
	 	 	userToken = localStorage.getItem('spotify-token');
	 	 	if (userToken === "" || userToken == null) {
	 	 	}else{
	 	 		app.config(function(SpotifyProvider) {
	 	 			SpotifyProvider.setAuthToken(userToken);
	 	 		});
	 			createPlaylists();
	 	 	}
 	 	});
 	 	
 	};

 	//Checks if you are logged in
 	$scope.loggedIn = function() {
 		if (userToken === "" || userToken == null) {
 			return false;
 		}else{
 			return true;
 		}
 	};

 	//Displays the featured and user's playlists
 	var userId = "";
 	var createPlaylists = function() {
 		Spotify.getCurrentUser().then(function(data) {
	 	 	userId = data.id;
 		
	 		Spotify.getFeaturedPlaylists().then(function(featPlaylists) {
	  			$scope.featPlaylists = featPlaylists.playlists.items;
			});
			Spotify.getUserPlaylists(userId).then(function(userPlaylists) {
				if (userPlaylists.items != null) {
					$scope.userPlaylists = userPlaylists.items;
				}	
			});
		});
	};

	//Gets the playlist that is clicked on
	var clicked = 0;
	$scope.getPlaylist = function(playlist) {
		clicked++;
		if (clicked > 1) {
			return false;
		}
		var id = playlist.id;
		var owner = playlist.owner.id;
		var image = playlist.images[0].url

		Spotify.getPlaylistTracks(owner, id).then(function(data) {
			$('#playlists').empty();
			createInterface(data, image);
		});
	}

	//Sets up interface to start the game
	var createInterface = function(data, image) {
		var div = $('#gameArea');
		var imgDiv = $('<div class="playlist" id="playlistImg"></div>')
		var img = $('<img></img>');
		img.attr('src', image);
		img.appendTo(imgDiv);
		imgDiv.appendTo(div);
		var button = $('<div><button class="btn btn-primary" id="startButton">Start Quiz</button></div>');
		button.click(function() {
			startQuiz(data);
		});
		button.appendTo(div);
		var score = $('<div id="score">Score: ' + correctGuesses + '&#47;' + totalGuesses + '</div>')
		score.appendTo(div);
	}

	//Starts game when start button is clicked
	var startQuiz = function(data) {
		$('#startButton').remove();
		$('#playlistImg').addClass("start");
		var questions = $('<div id="questions"></div>');
		questions.appendTo($('#gameArea'));
		var form = $('<form></form>');
		form.appendTo(questions);
		nextSong(data, form);
	}

	//Advances to the next question and song when answer is submitted
	var audio;
	var nextSong = function(data, form) {
		form.empty();
		$('#pause').remove();
		var tracks = data.items;
		var correctSong = tracks[Math.floor(Math.random() * tracks.length)].track;
		var wrongSong1 = tracks[Math.floor(Math.random() * tracks.length)].track;
		var wrongSong2 = tracks[Math.floor(Math.random() * tracks.length)].track;
		var wrongSong3 = tracks[Math.floor(Math.random() * tracks.length)].track;

		var position = Math.floor(Math.random() * 4);

		var correctAnswer = correctSong.name + " by " + correctSong.artists[0].name;
		var wrong1 = wrongSong1.name + " by " + wrongSong1.artists[0].name;
		var wrong2 = wrongSong2.name + " by " + wrongSong2.artists[0].name;
		var wrong3 = wrongSong3.name + " by " + wrongSong3.artists[0].name;

		var q0;
		var q1;
		var q2;
		var q3;

		//Sets up new answer choices
		if (position == 0) {
			q0 = $('<input type="radio" name="answer" value="' + correctAnswer + '">' + " " + correctAnswer + '</input></br>');
			q1 = $('<input type="radio" name="answer" value="' + wrong1 + '">' + " " + wrong1 + '</input></br>');
			q2 = $('<input type="radio" name="answer" value="' + wrong2 + '">' + " " + wrong2 + '</input></br>');
			q3 = $('<input type="radio" name="answer" value="' + wrong3 + '">' + " " + wrong3 + '</input></br>');

		}else if (position == 1) {
			q1 = $('<input type="radio" name="answer" value="' + correctAnswer + '">' + " " + correctAnswer + '</input></br>');
			q0 = $('<input type="radio" name="answer" value="' + wrong1 + '">' + " " + wrong1 + '</input></br>');
			q2 = $('<input type="radio" name="answer" value="' + wrong2 + '">' + " " + wrong2 + '</input></br>');
			q3 = $('<input type="radio" name="answer" value="' + wrong3 + '">' + " " + wrong3 + '</input></br>');
		}else if (position == 2) {
			q2 = $('<input type="radio" name="answer" value="' + correctAnswer + '">' + " " + correctAnswer + '</input></br>');
			q1 = $('<input type="radio" name="answer" value="' + wrong1 + '">' + " " + wrong1 + '</input></br>');
			q0 = $('<input type="radio" name="answer" value="' + wrong2 + '">' + " " + wrong2 + '</input></br>');
			q3 = $('<input type="radio" name="answer" value="' + wrong3 + '">' + " " + wrong3 + '</input></br>');
		}else {
			q3 = $('<input type="radio" name="answer" value="' + correctAnswer + '">' + " " + correctAnswer + '</input></br>');
			q1 = $('<input type="radio" name="answer" value="' + wrong1 + '">' + " " + wrong1 + '</input></br>');
			q2 = $('<input type="radio" name="answer" value="' + wrong2 + '">' + " " + wrong2 + '</input></br>');
			q0 = $('<input type="radio" name="answer" value="' + wrong3 + '">' + " " + wrong3 + '</input></br>');
		}
		q0.appendTo(form);
		q1.appendTo(form);
		q2.appendTo(form);
		q3.appendTo(form);

		var submitButton = $('<button id="submitButton" class="btn btn-primary">Check Your Answer</button>');
		submitButton.click(function() {
			checkAnswer($("form input[type='radio']:checked").val(), correctAnswer, form, data);
			return false;
		});
		submitButton.appendTo(form);

		//Sets up pause button for current song
		var pauseButton = $('<button id="pause" class="btn btn-primary">Play&#47;Pause</button>');
		pauseButton.click(function() {
			pause(correctSong.preview_url);
			return false;
		});
		pauseButton.appendTo(form);

		audio = new Audio(correctSong.preview_url);
		audio.play();
		$scope.currentSong = correctSong.preview_url;
	}

	//Pauses/Plays Current song
	var pause = function(song) {
		if ($scope.currentSong == song) {
			audio.pause();
			$scope.currentSong = false;
		}else{
			audio.play();
			$scope.currentSong = song;
		}
	}

	//Checks answer on submit and increments guess counters
	var totalGuesses = 0;
	var correctGuesses = 0;
	var checkAnswer = function(answer, correctAnswer, form, data) {
		if (answer == correctAnswer) {
			totalGuesses++;
			correctGuesses++;
		}else{
			totalGuesses++;
		}
		$('#score').text('Score: ' + correctGuesses + '/' + totalGuesses);
		audio.pause();
		nextSong(data, form);
	}

	//Searches spotify for desired song
	$scope.search = function() {
		var text = $('#songSearch input').val();
		Spotify.search(text, 'track').then(function(data) {
			$scope.results = data.tracks.items;
		});
	}

	//Plays/Pauses song when clicked on
	$scope.play = function(song) {
		if ($scope.currentSong == song) {
			audio.pause();
			$scope.currentSong = false;
		}else{
		    audio = new Audio(song);
		    audio.play();
		    $scope.currentSong = song;
		}
	}
});