SeoHelper.configure do |config|
  config.skip_blank               = false
  config.site_name = Setting.app_name
  config.default_page_description = "團隊運用創新的網路前、後端技術，使用開源電腦程式語言，打造出全新視覺體驗的「台灣文創地圖」。我們的提案構想是：將文創相關內容所衍生出的藝文活動、文創商品以及文創業者（例如布袋戲、挽臉、打陀螺、踩高蹺、打鐵、胡琴、三味弦、古早麵、手工風箏…等等活動、商品內容或者業者所在地），依據其所在位置及對應時間，以空間及時間排序數據處理方式，儲存於雲端資料庫中，並在網站/手機應用程式(Web/App)的地圖界面上，對應於使用者點擊或者GPS位置發送而動態呈現"
  config.default_page_keywords    = "地圖 地方資訊 活動 藝文 都市 更新 即時 串流 在地 人文"
  config.default_page_image = Setting.domain + Setting.default_logo_url
  config.site_name_formatter  = lambda { |title, site_name|   "#{title} « #{site_name}".html_safe }
  config.pagination_formatter = lambda { |title, page_number| "#{title} - Page No.#{page_number}" }

end