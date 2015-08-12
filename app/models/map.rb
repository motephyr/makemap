class Map < ActiveRecord::Base
  resourcify  #rolify setting
  has_many :locations, dependent: :destroy
  has_many :location_pins, dependent: :destroy
  accepts_nested_attributes_for :location_pins
  belongs_to :user
end
