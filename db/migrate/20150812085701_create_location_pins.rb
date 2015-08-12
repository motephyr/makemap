class CreateLocationPins < ActiveRecord::Migration
  def change
    create_table :location_pins do |t|
      t.string :pin
      t.integer :map_id

      t.timestamps
    end
  end
end
