class AddOuterPhotoUrlToLocation < ActiveRecord::Migration
  def change
    add_column :locations,:outer_photo_url,:string
  end
end
