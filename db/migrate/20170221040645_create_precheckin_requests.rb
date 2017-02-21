class CreatePrecheckinRequests < ActiveRecord::Migration
  def change
    create_table :precheckin_requests do |t|
      t.string :hotel
      t.string :city

      t.timestamps null: false
    end
  end
end
