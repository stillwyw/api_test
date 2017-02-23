var map;
var service;
var infowindow;
//for alert
vex.defaultOptions.className = 'vex-theme-wireframe';

var ready = function() {

  // global login status.
  window.loggedIn = function() {
    return localStorage.getItem("access_token") !== null
  }

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
        Oauth.request({
          url: window.base_url + '/api/v0/users/' + window.localStorage.user_id + '/precheckin_requests.json',
          type: 'POST',
          data: {
            precheckin_request: {
              arrival_date: self.arrival_date,
              checkout_date: self.checkout_date,
              hotel: self.hotel.name,
              hotel_id: self.hotel.id
            }
          }
        }).done(function() {
          vex.dialog.alert("Pre-Checking Request has been successfully sent. :)");
          App.displayHotelModal = false;
        })
      }
    }
  });

  var HotelItem = Vue.component('hotel-item', {
    props: ['hotel'],
    template: '<div class="col-md-4">\
                  <div class="hotel-item" :style="bgImage()" :name="hotel.id" v-on:click="clicked">\
                    <div class="img-overlay"></div>\
                    <h4>{{hotel.name}}</h4>\
                  </div>\
               </div>',
    methods: {
      bgImage: function () {
        return 'background-image: url("'+ this.photo() +'");}'
      },
      photo: function() {
        if (this.hotel.photos) {
          return this.hotel.photos[0].getUrl({ 'maxWidth': 600, 'maxHeight': 800 });
        }else{
          return 'http://doubletree3.hilton.com/resources/media/dt/TERHIDT/en_US/img/shared/full_page_image_gallery/main/DT_hotelspa2_14_677x380_FitToBoxSmallDimension_Center.jpg'
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
