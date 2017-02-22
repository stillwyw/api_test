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
// Oauth.getToken('http://127.0.0.1:3000/oauth/token', 'yunwei2@pafoods.cn', 'password', function (data) {
//   console.log(data);
// })
//
