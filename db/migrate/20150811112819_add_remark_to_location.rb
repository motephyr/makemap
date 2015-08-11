class AddRemarkToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :remark,:json
  end
end
