require 'doorkeeper/grape/helpers'
module API
  module V0
    class API < Grape::API
      format :json
      
      resource :precheckin_requests do
        desc "Get all prechecking requests."
        get do
          PrecheckinRequest.all
        end
        
        desc "View a single precheckin request."
        params do
          requires :id, type: Integer, desc: 'PrecheckinRequest id.'
        end
        route_param :id do
          get do
            PrecheckinRequest.find params[:id]
          end
        end
      end
      
      
      resource :users do
        
        segment '/:user_id' do
          resource :precheckin_requests do
            desc "Get a user's precheckin_resources"
            get do
              User.find(params[:user_id]).precheckin_requests
            end
          end
        end

      end
      
      
      
    end
  end
end