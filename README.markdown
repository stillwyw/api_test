##INTRO

####Key components:
1. Grape: the api generator
2. Doorkeeper: the oauth2 provider, and protector.
3. Vue.js: is used to build a client side one page javascript application which imitates a client requesting resources.
4. ActiveAdmin: quick admin panel builder.

####Local Installation 
`bundle install`
`rake db:migrate`
`rake db:seed` this is for generating the initial admin account: `admin@example.com`and `password`.

####Local setup
1. goto http://127.0.0.1:3000/oauth/application to create a application following the instruction. This will prompt you to login as admin.
2. copy the `client_id` to application.html.erb to replace the current existing one.
3. go to http://127.0.0.1:3000/users/sign_up to create a user. Note, you can login with `/users/sign_in` URI, but it won't give you access to the api. you still have to use this account to login on the javascript App to get access from there.
4. visi http://127.0.0.1:3000/ to start exploring the app and resources.

####API 
Enabled authentication grant types:
1. **password**: which is used by this JS application, and also can be used for iOS or android applications developed by trusted entities (only).
2. **authorization_code**
3. **client_credentials**

**APIs**:

Current API base url: `http://conichiwa.herokuapp.com/api/v0`

**Public APIs:**

GET:`/precheckin_requests`: returns all precheckin_requests as a public open api, **when logged in with a resource_owner, it returns checkins of this resource owner**.

GET:`/precheckin_requests/:id`: single precheckin with it's `:id`. Publicly available.

**Need authorization:**

GET`/user`: returns resource owner basic profile.

GET: `/users/:user_id/precheckin_requests`: returns a specific user's precheckin_requests

POST:`/users/:user_id/precheckin_requests`: Creates a precheckin_request for specific user.


