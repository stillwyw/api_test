var HomePage = Vue.component('home-page', {
  template: '#home-page',
  created: function() {
    this.initializeMap();
  },
  data: function() {
    return {
      hotels: []
    }
  },
  methods: {
    initializeMap: function() {
      // picked shanghai as the point.
      var userLocation = new google.maps.LatLng(35.6895, 139.6917);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        }, function (error) {
        	switch(error.code) {
        		case error.PERMISSION_DENIED:
        			console.log("User denied the request for Geolocation.");
        			break;
        		case error.POSITION_UNAVAILABLE:
        			console.log("Location information is unavailable.");
        			break;
        		case error.TIMEOUT:
        			console.log("The request to get user location timed out.");
        			break;
        		case error.UNKNOWN_ERROR:
        			console.log("An unknown error occurred.");
        			break;
        	}
        }, {
      		enableHighAccuracy : true,
      		timeout : Infinity,
      		maximumAge : 0
      	});
      }

      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 13
      });

      var request = {
        location: userLocation,
        radius: '1000',
        query: 'hotel'
      };

      service = new google.maps.places.PlacesService(map);
      service.textSearch(request, this.hotelSearchCallBack);
    },
    hotelSearchCallBack: function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarker(results[i]);
        }
        this.hotels = results;
      }
    },
    createMarker: function(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        placeId: place.id
      });
    }
  }
})