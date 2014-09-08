class Location < ActiveRecord::Base
  belongs_to :map
  belongs_to :user

  mount_uploader :photo, LocationPhotoUploader

end
