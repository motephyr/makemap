class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :title
      t.string :content
      t.string :photo
      t.string :attach
      t.integer :user_id
      t.string :lat
      t.string :lng

      t.timestamps
    end
  end
end
