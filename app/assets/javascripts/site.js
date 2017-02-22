// TODO: turn on production mode.
var map;
var service;
var infowindow;
var baseUrl = 'http://127.0.0.1:3000';

//for alert
vex.defaultOptions.className = 'vex-theme-wireframe';

var ready = function () {
  
  var OauthRequest = function (option) {
        var self = this;
        data = option.data ? option.data : {}
        data.access_token = window.localStorage.access_token;
        return $.ajax({
          url: option.url,
          type: option.type,
          headers: { 'access_token' : window.localStorage.access_token },
          data: data
        }).error(function (error) {
          console.log(error);
          vex.dialog.alert(error.responseJSON.error)
        });
      }
      
  // global login status.
  window.loggedIn = function () {
    return localStorage.getItem("access_token") !== null
  }
    
  var UserPage = Vue.component('user-page', {
    template: '#user-page',
    data: function () {
      return {
        checkins: [],
        user_id: window.localStorage.user_id
      }
    },
    created: function () {
      this.loadCheckins();
    },
    methods: {
      loadCheckins: function () {
        var self = this;
        OauthRequest({
          url: '/api/v0/users/'+ self.user_id + '/precheckin_requests.json',
        }).done(function (data) {
            console.log(data);
            self.checkins = data;
        });
      }
    }
  })
  
  var HomePage = Vue.component('home-page', {
    template: '#home-page',
    created: function () {
      this.initializeMap();
    },
    data: function () {
      return {hotels: []}
    },
    methods: {
      initializeMap: function () {
        var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

        map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 15
          });

        var request = {
          location: pyrmont,
          radius: '500',
          query: 'hotel'
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, this.hotelSearchCallBack);
      },
      hotelSearchCallBack: function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.hotels = results;
        }
      }
    }
  })
  
  var LoginPage = Vue.component('login-page', {
    template: '#login-page',
    props: ['username', 'password'],
    methods: {
      fetchUserProfile: function () {
        var self = this;
        return OauthRequest({
          url: baseUrl+'/api/v0/user.json'
        }).done(function (data) {
          window.localStorage.user_id = data.id
        })
      },
      login: function () {
        var self = this;
        Oauth.getToken(baseUrl+'/oauth/token', this.username, this.password).done(function (data) {
          window.localStorage.access_token = data.access_token;
          // fetch user profile:id for loading user resources.
          self.fetchUserProfile()
          .done(function () {
            self.$router.go("/user");
          });
        }).error(function (err) {
          vex.dialog.alert(err.responseText)
        })
      }
    }
  })
  
  //defining routers...........................................
  const routes = [
    { path: '/', component: HomePage },
    { 
      path: '/login', 
      component: LoginPage,
      beforeEnter: function (from, to, next) {
        if (loggedIn()) {
          next("/")
        }else{
          next()
        }
      }
    },
    { 
      path: '/user', 
      component: UserPage,
      beforeEnter: function (from, to, next) {
        if (!loggedIn()) {
          next("/login")
        }else{
          next()
        }
      }
    }
  ]
  
  const router = new VueRouter({
    routes
  })

  
  // Hotel popup page for sending precheckin requests .........
  var HotelPopup = Vue.component('hotel-popup', {
    props: {
      hotel: Object,
      arrival_date: Number,
      checkout_date: Number
    },
    template: '#modal-template',
    mounted: function () {
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
      precheckin: function () {
        var self = this;
        OauthRequest({
          url: 'http://127.0.0.1:3000/api/v0/users/'+ window.localStorage.user_id +'/precheckin_requests.json',
          type: 'POST',
          data: {
            precheckin_request: {
              arrival_date: self.arrival_date,
              checkout_date: self.checkout_date,
              hotel: self.hotel.name
            }
          }
        }).done(function () {
          vex.dialog.alert("Pre-Checking Request has been successfully sent. :)");
        })
      }
    }
  });

  var HotelItem = Vue.component('hotel-item', {
    props: ['hotel'],
    template: '<div class="hotel-item" v-on:click="clicked">\
                  <img v-bind:src="this.photo()" class="img-responsive"/>\
                  <h4>{{hotel.name}}</h4>\
               </div>',
    methods: {
      photo: function () {
        return ''
      },
      clicked: function () {
        App.displayHotelModal = true;
        App.currentHotel = this.hotel
      }
    }
  });
  
  var PrecheckinItem = Vue.component('precheckin-item', {
    props: ['checkin'],
    template: '<div class="checkin-item" >\
                  <h4>{{checkin.hotel}}</h4>\
                  <p>\
                    <b>Arrival: {{checkin.arrival_date}}</b>\
                    <b>Departure: {{checkin.checkout_date}}</b>\
                  </p>\
              </div>'
  });
  
  
  var App = new Vue({
    el: '#app',
    router,
    data: {
      authorization_code: undefined,
      hotels: [],
      displayHotelModal: false,
      currentHotel: undefined
    },
    methods: {
      loggedIn: loggedIn,
      logout: function () {
        window.localStorage.removeItem('access_token');
        App.$router.go("/");
      }
    }
  }); // end of App
  window.App = App;
}; // end of ready

document.addEventListener("turbolinks:load", ready );