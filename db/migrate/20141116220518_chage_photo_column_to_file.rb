class ChagePhotoColumnToFile < ActiveRecord::Migration
  def change
    rename_column :photos,:photo,:file
  end
end
