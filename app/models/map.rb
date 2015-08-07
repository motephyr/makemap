class Map < ActiveRecord::Base
  resourcify  #rolify setting
  has_many :locations, dependent: :destroy
  belongs_to :user
end
