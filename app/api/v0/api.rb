require 'doorkeeper/grape/helpers'
require 'action_controller/metal/strong_parameters'

module API
  module V0
    class API < Grape::API
      format :json
      rescue_from :all
      
      helpers Doorkeeper::Grape::Helpers
      
      helpers do
        
        def precheckin_request_params
          ActionController::Parameters.new(params).require(:precheckin_request).permit(:hotel, :city, :arrival_date, :checkout_date)
        end
        
        def authorize!
          doorkeeper_authorize!
        end
        
        def current_token
          doorkeeper_token
        end

        def current_user
          User.find_by_id current_token.resource_owner_id
        end

        def current_scopes
          current_token.scopes
        end
      end
      
      resource :precheckin_requests do
        desc "Get all prechecking requests (for a user)."
        get do
          if current_user
            current_user.precheckin_requests
          else
            PrecheckinRequest.all
          end
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
      
      resource :user do
        desc "Get current resource owner profile"
        get do
          authorize!
          
          current_user
        end
      end
      
      resource :users do
        
        segment '/:user_id' do
          resource :precheckin_requests do
            desc "Get a user's all precheckin_requests"
            get do
              User.find(params[:user_id]).precheckin_requests.includes(:user)
            end
            
            desc "Create a precheckin_request for user"
            post do
              pr = User.find(params[:user_id]).precheckin_requests.build(precheckin_request_params)
              if pr.save!
                pr
              end
            end
          end
        end
      end
    end
  end
end