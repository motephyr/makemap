class Location < ActiveRecord::Base
  belongs_to :map
  belongs_to :user

end
