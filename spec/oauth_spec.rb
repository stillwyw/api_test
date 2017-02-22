require 'rails_helper'
require 'oauth2'

RSpec.describe "OAUTH authentication flow tests" do
  
  it "should allow password authentication flow" do
    
    client = OAuth2::Client.new('5a6bafa96869321821b54c288b711aa3abcec6e4e3768134fc880af30b94cadc', 
                                '974071b85fbbe5f3f3a327981377a57f2a183340ac4ca9499bde5b1345a55e48', 
                                :site => "http://127.0.0.1:3000/")
    token = client.password.get_token('yunwei2@pafoods.cn', 'password')
    response = token.get("/api/v0/user")
    
    puts response.body
  end
  
  it "should allow authorization flow" do
    
    client = OAuth2::Client.new('5a6bafa96869321821b54c288b711aa3abcec6e4e3768134fc880af30b94cadc', 
                                '974071b85fbbe5f3f3a327981377a57f2a183340ac4ca9499bde5b1345a55e48', 
                                :site => "http://127.0.0.1:3000/")
                                
    auth_code = client.auth_code.authorize_url(:redirect_uri => 'http://127.0.0.1:3000/callback')
    
    token = client.auth_code.get_token('272108172eead31d499779ee958294ad94b65d1b520305cb046c21bb493e3a19', :redirect_uri => 'http://127.0.0.1:3000/callback')
    
    
    response = token.get('/api/v0/precheckin_requests.json')
    
    puts response.body
    
    
  end
end
