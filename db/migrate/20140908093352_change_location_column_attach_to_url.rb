class ChangeLocationColumnAttachToUrl < ActiveRecord::Migration
  def change
    rename_column :locations, :attach , :link_url
  end
end
