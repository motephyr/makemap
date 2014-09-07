class ChangeMapDescriptionToText < ActiveRecord::Migration
  def change
    change_column :maps,:description,:text
  end
end
