class Permission < ActiveRecord::Base
  belongs_to :map
  belongs_to :user
end
