class Location < ActiveRecord::Base
  belongs_to :map
  belongs_to :user

  has_many :photos, as: :photoable, dependent: :destroy
  accepts_nested_attributes_for :photos

  before_save :check_if_url_exist_http_or_add_prefix

  def check_if_url_exist_http_or_add_prefix
    temp_url = self.link_url
    added_http_url = (temp_url.start_with?("http://","https://")) ? temp_url : "http://"+temp_url

    self.link_url = url_is_valid?(added_http_url) ? added_http_url : ""

  end

  def url_is_valid?(url)
    uri = URI.parse(url)
    uri.kind_of?(URI::HTTP)
  rescue URI::InvalidURIError
    false
  end

end


