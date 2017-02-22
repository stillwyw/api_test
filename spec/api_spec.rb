require 'rails_helper'
require 'oauth2'

RSpec.describe "API TESTS" do
  before(:each) do
    client = OAuth2::Client.new('5a6bafa96869321821b54c288b711aa3abcec6e4e3768134fc880af30b94cadc', 
                                '974071b85fbbe5f3f3a327981377a57f2a183340ac4ca9499bde5b1345a55e48', 
                                :site => "http://127.0.0.1:3000/")
    
    @token = client.password.get_token('yunwei2@pafoods.cn', 'password')
  end

  it 'should get data from /precheckin_requests api' do
    response = @token.get("/api/v0/precheckin_requests")
    parsed_body = JSON.parse(response.body)
    expect(parsed_body.first).not_to be_empty
  end
end
