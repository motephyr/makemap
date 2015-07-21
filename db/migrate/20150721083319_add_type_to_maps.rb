class AddTypeToMaps < ActiveRecord::Migration
  def change
    add_column :maps, :kind ,:string
  end
end
