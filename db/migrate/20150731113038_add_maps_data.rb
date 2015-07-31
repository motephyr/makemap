class AddMapsData < ActiveRecord::Migration
  def change
    change_column(:maps, :private, :boolean, default: false)
    Map.create(title: "臺灣Maker空間", kind: "google")
  end
end
