class Location < ActiveRecord::Base
  belongs_to :map
  belongs_to :user

  has_many :photos, as: :photoable, dependent: :destroy
  accepts_nested_attributes_for :photos

end
