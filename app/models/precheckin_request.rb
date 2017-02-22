class PrecheckinRequest < ActiveRecord::Base
    
  belongs_to :user
  
  validates_presence_of :hotel
  validates_presence_of :user_id
  validates_presence_of :arrival_date
  validates_uniqueness_of :arrival_date

  def as_json(options={})
    super({ only: [:id, :hotel, :city, :arrival_date, :checkout_date], include: [:user => {only: [:id, :name]}] }.merge(options))
  end
end
