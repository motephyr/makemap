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

end
