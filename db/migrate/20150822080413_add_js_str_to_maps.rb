class AddJsStrToMaps < ActiveRecord::Migration
  def change
    add_column(:maps, :js_str, :text)
  end
end
