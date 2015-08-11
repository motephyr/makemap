source 'https://rubygems.org'
source 'https://rails-assets.org' do
  %w(
    leaflet-plugins leaflet-sidebar leaflet.locatecontrol
    leaflet-slider trumbowyg dropzone d3 lodash jquery-icheck
    moment
    ).each do |asset_source|
  gem "rails-assets-#{asset_source}"
end
end

gem "settingslogic"
gem 'bootstrap-sass', '~> 3.3.5'
gem "bootstrap_helper", ">= 4.2.2.1"
gem "autoprefixer-rails"
gem 'seo_helper', '~> 1.0'

gem "simple_form"
gem 'devise'
gem 'devise-i18n'
gem "omniauth"
gem "omniauth-facebook"
gem "auto-facebook", git: 'https://github.com/motephyr/auto-facebook.git'

gem 'carrierwave'
gem "mini_magick", '~> 4.0.1'

#permission
gem 'cancancan'
gem 'rolify'

gem 'geocoder'
gem 'roo'
gem 'iconv'
gem 'rainbows'

gem 'sidekiq'
gem 'activejob'
gem 'sidekiq-middleware'
gem 'nokogiri'
gem 'taiwanese_news_parser'
gem 'sinatra', require: false

group :production do
  #gem 'rails_12factor'
  gem "non-stupid-digest-assets"
  gem "pg"
  gem "fog"
end

group :development do
  gem 'capistrano-bundler', '~> 1.1.2'
  gem "capistrano", '~> 3.2.1'
  gem "capistrano-rails"
  gem "capistrano-rvm"
  gem 'capistrano-bower'
  gem "binding_of_caller"
  gem "better_errors", "~> 0.9.0"

  #gem "pry-stack_explorer"
  gem "pry-byebug"
  gem "pry-rescue"
  gem "pry-doc"
  gem "pry-docmore"
  gem "pry-rails"

  gem "letter_opener"
  gem 'meta_request'
  gem 'xray-rails'
  gem 'capistrano3-rainbows', git: 'https://github.com/motephyr/capistrano3-rainbows'
  gem 'sqlite3'
end

#mongodb

gem 'bson_ext'
gem 'bson'
gem 'mongoid', github: 'mongoid/mongoid'

group :test do
  gem 'guard-rspec', require: false
  gem 'rspec-rails', '~> 2.14.1'
  gem 'rails_best_practices'
  gem 'capybara'
  gem 'poltergeist'
end



# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.1.6'

gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'

gem 'jquery-ui-rails'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer',  platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
#gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0',          group: :doc

# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
gem 'spring',        group: :development

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]

ruby "2.2.1"
