class AddColumnLocationMapId < ActiveRecord::Migration
  def change
    add_column :locations , :map_id , :integer
  end
end
