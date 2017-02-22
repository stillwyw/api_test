class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
  has_many :precheckin_requests, dependent: :destroy
  
  
  def as_json(options={})
    super({ only: [:id, :name] }.merge(options))
  end
  
end
