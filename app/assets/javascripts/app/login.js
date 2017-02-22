// login page
var LoginPage = Vue.component('login-page', {
  template: '#login-page',
  props: ['username', 'password'],
  methods: {
    fetchUserProfile: function() {
      var self = this;
      return Oauth.request({
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

// login popup
Vue.component('login-popup', {
  template: '#login-popup',
  props: ['username', 'password', 'displayLoginPopup'],
  methods: {
    fetchUserProfile: function() {
      var self = this;
      return Oauth.request({
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