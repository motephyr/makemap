class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.integer :location_id
      t.string :title
      t.string :description
      t.boolean :privacy

      t.timestamps
    end
  end
end
