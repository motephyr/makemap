class Photo < ActiveRecord::Base
  belongs_to :photoable, polymorphic: true

  validates_presence_of :photo

  mount_uploader :photo, LocationPhotoUploader

end
