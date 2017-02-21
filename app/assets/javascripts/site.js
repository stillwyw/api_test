// TODO: turn on production mode.
var map;
var service;
var infowindow;

var jso = new JSO({
        providerID: "google",
        client_id: "69f950ca5c8b5c9d72a2c0005a1a16a47ef0a4682f61b18967531e8c9c0a0109",
        redirect_uri: "http://bridge.uninett.no/jso/index.html",
        authorization: "https://accounts.google.com/o/oauth2/auth",
        scopes: { request: ["https://www.googleapis.com/auth/userinfo.profile"]}
    });


var ready = function () {
  
  Vue.component('hotel-popup', {
    props: ['hotel'],
    template: '#modal-template',
    methods: {
      sendPrecheckinRequest: function () {
        $.ajax({
          url: 'http://127.0.0.1:3000/api/v0/users/',
        })
      }
    }
  });

  Vue.component('hotel-item', {
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
        app.display = true;
        app.currentHotel = this.hotel
      }
    },
  });
  
  var app = new Vue({
    el: '#app',
    data: {
      authorization_code: undefined,
      hotels: [],
      display: false,
      currentHotel: undefined
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
    },
    created: function () {
      this.initializeMap();
    },
  }); // end of app
}; // end of ready

document.addEventListener("turbolinks:load", ready );