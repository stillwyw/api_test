var map;
var service;
var infowindow;
//for alert
vex.defaultOptions.className = 'vex-theme-wireframe';

var ready = function() {

  var OauthRequest = function(option) {
    var self = this;
    data = option.data ? option.data : {};
    data.access_token = window.localStorage.access_token;
    return $.ajax({
      url: option.url,
      type: option['type'],
      headers: {
        'access_token': window.localStorage.access_token
      },
      data: data
    }).error(function(error) {
      console.log(error);
      vex.dialog.alert(error.responseJSON.error)
    });
  }

  // global login status.
  window.loggedIn = function() {
    return localStorage.getItem("access_token") !== null
  }

  var UserPage = Vue.component('user-page', {
    template: '#user-page',
    data: function() {
      return {
        checkins: [],
        user_id: window.localStorage.user_id
      }
    },
    created: function() {
      this.loadCheckins();
    },
    methods: {
      loadCheckins: function() {
        var self = this;
        OauthRequest({
            url: '/api/v0/users/' + self.user_id + '/precheckin_requests.json'
          })
          .done(function(data) {
            console.log(data);
            self.checkins = data;
          });
      }
    }
  })

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

  var LoginPage = Vue.component('login-page', {
    template: '#login-page',
    props: ['username', 'password'],
    methods: {
      fetchUserProfile: function() {
        var self = this;
        return OauthRequest({
          url: window.base_url + '/api/v0/user.json'
        }).done(function(data) {
          window.localStorage.user_id = data.id
        })
      },
      login: function() {
        var self = this;
        Oauth.getToken(window.base_url + '/oauth/token', this.username, this.password)
          .done(function(data) {
            window.localStorage.access_token = data.access_token;
            // fetch user profile:id for loading user resources.
            self.fetchUserProfile()
              .done(function() {
                self.$router.push("/user");
              });
          }).error(function(err) {
            vex.dialog.alert(err.responseText)
          })
      }
    }
  })

  //defining routers...........................................
  const routes = [{
    path: '/',
    component: HomePage
  }, {
    path: '/login',
    component: LoginPage,
    beforeEnter: function(from, to, next) {
      if (loggedIn()) {
        next("/")
      } else {
        next()
      }
    }
  }, {
    path: '/user',
    component: UserPage,
    beforeEnter: function(from, to, next) {
      if (!loggedIn()) {
        next("/login")
      } else {
        next()
      }
    }
  }]


  const router = new VueRouter({
    routes: routes
  })


  // Hotel popup page for sending precheckin requests .........
  var HotelPopup = Vue.component('hotel-popup', {
    props: {
      hotel: Object,
      arrival_date: Number,
      checkout_date: Number
    },
    template: '#modal-template',
    mounted: function() {
      var self = this;
      $(".date-input").datepicker({
        dateFormat: 'yymmdd',
        onSelect: function(date) {
          var key = $(this).attr("name");
          Vue.set(self, key, date)
        },
      })
    },
    methods: {
      precheckin: function() {
        var self = this;
        OauthRequest({
          url: window.base_url + '/api/v0/users/' + window.localStorage.user_id + '/precheckin_requests.json',
          type: 'POST',
          data: {
            precheckin_request: {
              arrival_date: self.arrival_date,
              checkout_date: self.checkout_date,
              hotel: self.hotel.name
            }
          }
        }).done(function() {
          vex.dialog.alert("Pre-Checking Request has been successfully sent. :)");
          App.displayHotelModal = false;
        })
      }
    }
  });
  
  Vue.component('login-popup', {
    template: '#login-popup',
    props: ['username', 'password', 'displayLoginPopup'],
    methods: {
      fetchUserProfile: function() {
        var self = this;
        return OauthRequest({
          url: window.base_url + '/api/v0/user.json'
        }).done(function(data) {
          window.localStorage.user_id = data.id
        })
      },
      login: function () {
        var self = this;
        Oauth.getToken(window.base_url + '/oauth/token', this.username, this.password)
          .done(function(data) {
            window.localStorage.access_token = data.access_token;
            // fetch user profile:id for loading user resources.
            self.fetchUserProfile()
              .done(function() {
                self.$emit('close');
              });
          }).error(function(err) {
            vex.dialog.alert(err.responseText)
          })
      }
    }
  })

  var HotelItem = Vue.component('hotel-item', {
    props: ['hotel'],
    template: '<div class="hotel-item" name={{hotel.id}} v-on:click="clicked">\
                  <div class="img-wrapper">\
                    <img v-bind:src="this.photo()" class="img-responsive"/>\
                  </div>\
                  <h4>{{hotel.name}}</h4>\
               </div>',
    methods: {
      photo: function() {
        if (this.hotel.photos) {
          return this.hotel.photos[0].getUrl({ 'maxWidth': 600, 'maxHeight': 800 });
        }else{
          return ''
        }
      },
      clicked: function() {
        if (loggedIn()) {
          App.displayHotelModal = true;
          App.currentHotel = this.hotel
        }else{
          App.displayLoginPopup = true;
        }

      }
    }
  });

  var PrecheckinItem = Vue.component('precheckin-item', {
    props: ['checkin'],
    template: '<div class="checkin-item" >\
                  <h4>{{checkin.hotel}}</h4>\
                  <hr/>\
                  <p class="mute">\
                    <span>Arrival: {{checkin.arrival_date}}</span>\
                     / <span>Departure: {{checkin.checkout_date}}</span>\
                  </p>\
              </div>'
  });


  var App = new Vue({
    el: '#app',
    router: router,
    data: {
      authorization_code: undefined,
      hotels: [],
      displayHotelModal: false,
      displayLoginPopup: false,
      currentHotel: undefined
    },
    methods: {
      loggedIn: loggedIn,
      logout: function() {
        window.localStorage.removeItem('access_token');
        App.$router.push("/");
      }
    }
  }); // end of App
}; // end of ready

document.addEventListener("turbolinks:load", ready);
