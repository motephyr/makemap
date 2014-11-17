class RemoveLocationPhoto < ActiveRecord::Migration
  def change

      remove_column :locations, :photo
  end
end
