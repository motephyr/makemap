SeoHelper.configure do |config|
  config.skip_blank               = false
  config.site_name = Setting.app_name
  config.default_page_description = "參加附近有趣的活動，分享家鄉的風景，和朋友討論旅遊去處，規畫心目中的建築藍圖"
  config.default_page_keywords    = "地圖 地方資訊 活動 藝文 都市 更新 即時 串流 在地 人文"
  config.default_page_image = Setting.domain + Setting.default_logo_url
  config.site_name_formatter  = lambda { |title, site_name|   sanitize "#{title} « #{site_name}" }
  config.pagination_formatter = lambda { |title, page_number| "#{title} - Page No.#{page_number}" }

end