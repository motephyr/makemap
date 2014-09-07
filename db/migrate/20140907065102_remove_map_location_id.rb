class RemoveMapLocationId < ActiveRecord::Migration
  def change
    remove_column :maps, :location_id
  end
end
