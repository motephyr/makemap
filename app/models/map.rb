class Map < ActiveRecord::Base
  has_many :permissions
  has_many :users, through: :permissions
  has_many :locations
end
