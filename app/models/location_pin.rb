class LocationPin < ActiveRecord::Base
	belongs_to :location
	belongs_to :map

	mount_uploader :pin, LocationPinUploader
end
