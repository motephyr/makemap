class Map < ActiveRecord::Base
  resourcify  #rolify setting
  has_many :locations
  belongs_to :user
end
