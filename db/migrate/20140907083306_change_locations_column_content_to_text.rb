class ChangeLocationsColumnContentToText < ActiveRecord::Migration
  def change
    change_column :locations, :content, :text
  end
end
