class AddStartAtEndtAtToLocations < ActiveRecord::Migration
  def change

    add_column :locations, :start_at, :datetime
    add_column :locations, :end_at, :datetime
  end
end
