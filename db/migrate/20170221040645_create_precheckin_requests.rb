class CreatePrecheckinRequests < ActiveRecord::Migration
  def change
    create_table :precheckin_requests do |t|
      t.string :hotel
      t.string :city
      t.date   :arrival_date
      t.date   :checkout_date
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
