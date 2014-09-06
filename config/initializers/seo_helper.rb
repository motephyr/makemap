SeoHelper.configure do |config|
  config.skip_blank               = false
  config.site_name = Setting.app_name
  config.default_page_description = "您家裡的小朋友長大了，有些物品用不到又捨不得？
          我們希望大家用合理的價格取得可愛的衣服、日常用品和玩具。
          將您曾經用心挑選的物品陳列出來，讓我們為您找到更需要它的人。"
  config.default_page_keywords    = "媽媽用品 哺育用品 清潔保養 清潔保養 衛生保健 嬰幼兒玩具 嬰兒衣物 哺乳衣 嬰兒推車 汽車座椅 餐椅搖椅 寢具用品 嬰兒食品"
  config.default_page_image = Setting.domain + Setting.default_logo_url
  config.site_name_formatter  = lambda { |title, site_name|   "#{title} « #{site_name}".html_safe }
  config.pagination_formatter = lambda { |title, page_number| "#{title} - Page No.#{page_number}" }

end