var app = angular.module('itunes');

app.service('itunesService', function($http, $q) {

	    /*
      AlbumArt: "http://a3.mzstatic.com/us/r30/Features4/v4/22/be/30/22be305b-d988-4525-453c-7203af1dc5a3/dj.srlprmuo.100x100-75.jpg"
      Artist: "Nelly"
      Collection: "Nellyville"
      CollectionPrice: 11.99
      Play: "http://a423.phobos.apple.com/us/r1000/013/Music4/v4/4a/ab/7c/4aab7ce2-9a72-aa07-ac6b-2011b86b0042/mzaf_6553745548541009508.plus.aac.p.m4a"
      Type: "song"
  */

  	var createSongData = function(fromServer) {
  		var result = [];
  		for (var i = 0; i < fromServer.length; i++) {
  			var newSong = {
  				AlbumArt: fromServer[i].artworkUrl60,
      			Artist: fromServer[i].artistName,
      			TrackName: fromServer[i].trackName,
      			Collection: fromServer[i].collectionName,
      			SinglePrice: fromServer[i].trackPrice,
      			CollectionPrice: fromServer[i].collectionPrice,
      			Play: fromServer[i].previewUrl,
      			Type: fromServer[i].kind,
      // Collection: "Nellyville"
      // CollectionPrice: 11.99
      // Play: "http://a423.phobos.apple.com/us/r1000/013/Music4/v4/4a/ab/7c/4aab7ce2-9a72-aa07-ac6b-2011b86b0042/mzaf_6553745548541009508.plus.aac.p.m4a"
      // Type: "song"
  			}
  			result.push(newSong);

  		}
  		// console.log('parsed result', result);
  		return result;
  	}

    //This service is what will do the 'heavy lifting' and get our data from the iTunes API.
    //Also not that we're using a 'service' and not a 'factory' so all your method you want to call in your controller need to be on 'this'.

    //Write a method that accepts an artist's name as the parameter, then makes a 'JSONP' http request to a url that looks like this
    //https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK'
    //Note that in the above line, artist is the parameter being passed in. 
    //You can return the http request or you can make your own promise in order to manipulate the data before you resolve it.

    //Code here

    var createUrl = function(artist, kind, search, sort) {
        var searchStr = search ? "+" + search: "";
        var kindStr = kind !== "all" ? "&entity=" + kind : "";
        var sortStr = sort ? "&sort=" + sort: "";
    	var url = "https://itunes.apple.com/search?term=" + artist + 
    		searchStr + kindStr + sortStr + '&callback=JSON_CALLBACK';
    	// console.log('url', url);
    	return url;
    }


    this.getData = function(artist, kind, search, sort, init) {
        var deferred = $q.defer();
        // console.log('service', artist, kind, search, sort, init);
		var url = createUrl(artist, kind, search, sort);        

        // $http.get('https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK')
        $http({
                method: 'JSONP',
                url: url,
                // dataType: 'jsonp'
            })
            .then(function(response) {
            	if(init) {
            		console.log('response', response);
            	}
                deferred.resolve(createSongData(response.data.results));
            });

        return deferred.promise;
    }
    // this.getData('katy perry', 'musicVideo', "", "", true).then(function(data) {
    //     console.log('parsed data', data);
    // });

});
