class ChangeMapPrivacyToPrivate < ActiveRecord::Migration
  def change
    rename_column :maps, :privacy, :private
  end
end
