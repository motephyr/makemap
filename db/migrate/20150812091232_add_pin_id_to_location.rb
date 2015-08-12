class AddPinIdToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :pin_id, :integer
  end
end
