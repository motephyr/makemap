class UpdateLocationPinIdColumnToLocationPinId < ActiveRecord::Migration
  def change
    rename_column :locations, :pin_id, :location_pin_id
  end
end
