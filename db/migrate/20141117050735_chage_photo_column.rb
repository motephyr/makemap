class ChagePhotoColumn < ActiveRecord::Migration
  def change
    rename_column :photos, :file, :photo
  end
end
