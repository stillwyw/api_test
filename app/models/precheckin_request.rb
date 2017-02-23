class PrecheckinRequest < ActiveRecord::Base
    
  belongs_to :user
  
  validates_presence_of :hotel
  validates_presence_of :user_id
  validates_presence_of :arrival_date

  validate :user_has_only_one_checkin_per_day
  
  def user_has_only_one_checkin_per_day
    self.errors.add :arrival_date, "You have already booked a checkin for #{self.arrival_date}" if (self.user.precheckin_requests.where(:arrival_date => self.arrival_date).count >= 1)
  end

  def as_json(options={})
    super({ only: [:id, :hotel, :hotel_id, :city, :arrival_date, :checkout_date], include: [:user => {only: [:id, :name]}] }.merge(options))
  end
end
