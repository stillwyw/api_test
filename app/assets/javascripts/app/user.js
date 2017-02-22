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
      Oauth.request({
          url: '/api/v0/users/' + self.user_id + '/precheckin_requests.json'
        })
        .done(function(data) {
          console.log(data);
          self.checkins = data;
        });
    }
  }
})
