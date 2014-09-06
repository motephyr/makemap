class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.integer :map_id
      t.integer :user_id
      t.string :state

      t.timestamps
    end
  end
end
