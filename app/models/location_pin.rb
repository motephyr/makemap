class LocationPin < ActiveRecord::Base
	has_many :locations
	belongs_to :map

	mount_uploader :pin, LocationPinUploader
end
