require 'csv'
require 'iconv'
class Location < ActiveRecord::Base
  belongs_to :map
  belongs_to :user

  has_many :photos, as: :photoable, dependent: :destroy
  accepts_nested_attributes_for :photos

  validates :title, :presence => {:message => '是必填欄位'}

  scope :activity, -> {where("start_at > ?",Time.now).order('start_at desc')}
  scope :news, -> {where("start_at > ?", 6.hour.ago ).order('start_at asc')}

  before_save :check_if_url_exist_http_or_add_prefix

  def check_if_url_exist_http_or_add_prefix
    if (!self.link_url.blank?)
      temp_url = self.link_url
      added_http_url = (temp_url.start_with?("http://","https://")) ? temp_url : "http://"+temp_url

      self.link_url = url_is_valid?(added_http_url) ? added_http_url : ""
    end
  end

  def url_is_valid?(url)
    uri = URI.parse(url)
    uri.kind_of?(URI::HTTP)
  rescue URI::InvalidURIError
    false
  end

  @allowed_attributes = [ "title","content","address","lng","lat","link_url","outer_photo_url"]

  def self.import(map_id,file)
    spreadsheet = open_spreadsheet(file)
    header = spreadsheet.row(1)
    (2..spreadsheet.last_row).each do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      product = find_by_id(row["id"]) || new(map_id: map_id)
      product.attributes = row.to_hash.slice(*@allowed_attributes)
      product.save!
    end
  end

  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
    when ".csv" then Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Roo::Excelx.new(file.path, nil, :ignore)
    else raise "Unknown file type: #{file.original_filename}"
    end
  end

  def self.to_csv(options = {})
    CSV.generate(options) do |csv|
      csv << @allowed_attributes
      all.each do |location|
        csv << location.attributes.values_at(*@allowed_attributes)
      end
    end
  end

end


