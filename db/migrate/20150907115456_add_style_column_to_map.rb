class AddStyleColumnToMap < ActiveRecord::Migration
  def change
  	add_column :maps, :style, :json
  end
end
