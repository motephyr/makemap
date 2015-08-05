class AddMapsData < ActiveRecord::Migration
  def change
    change_column(:maps, :private, :boolean, default: false)
  end
end
