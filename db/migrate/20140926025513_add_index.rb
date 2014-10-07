class AddIndex < ActiveRecord::Migration
  def change
    add_index :locations,:user_id
    add_index :locations,:map_id
  end
end
