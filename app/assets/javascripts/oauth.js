// A short piece of code for javascript Oauth Password Flow.
// Author: Yunwei 
// **********************

var Oauth = {grant_type: 'password'}

Oauth.client_id = window.client_id;

Oauth.state = function () {
  return Date.now() + "" + Math.random()
}

Oauth.requestToken = function (url, username, password) {
  var self = this;
  return $.post(url, {
    client_id: self.client_id,
    client_secret: self.client_secret,
    grant_type: self.grant_type,
    username: username,
    password: password,
    state: self.state
  }, null, 'json');
}

Oauth.getToken = function (url, username, password) {
  return this.requestToken(url, username, password)
}

Oauth.request = function(option) {
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