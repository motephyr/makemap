class AddUserIdToMaps < ActiveRecord::Migration
  def change
    add_column :maps,:user_id,:integer
  end
end
