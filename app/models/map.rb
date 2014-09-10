class Map < ActiveRecord::Base
  resourcify  #rolify setting 
  has_many :locations
end
