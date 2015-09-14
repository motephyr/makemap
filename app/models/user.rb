class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  extend OmniauthCallbacks

  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :invitable

  has_many :locations
  has_many :maps

  def skip_confirmation!
  end

  def assign_role(map_id, role_name)
    if self.present?
      @map = Map.find(map_id)
      self.add_role role_name, @map
      return true
    end

    return false
  end

end
