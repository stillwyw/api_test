class AddHotelIdToPrecheckinRequest < ActiveRecord::Migration
  def change
    add_column :precheckin_requests, :hotel_id, :string
  end
end
