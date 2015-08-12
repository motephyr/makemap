class LocationPins < ActiveRecord::Base
	belongs_to :locations
	belongs_to :map

	mount_uploader :location_pins, LocationPinUploader
end
