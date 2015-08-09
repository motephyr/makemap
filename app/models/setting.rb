class Setting < Settingslogic
  source "#{Rails.root}/config/config.yml"
  namespace Rails.env
end

class NewsWebsite < Settingslogic
  source "#{Rails.root}/config/news_website.yml"
  namespace Rails.env
end