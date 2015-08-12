class Map < ActiveRecord::Base
  resourcify  #rolify setting
  has_many :locations, dependent: :destroy
  has_many :location_pins, dependent: :destroy
  belongs_to :user
end
