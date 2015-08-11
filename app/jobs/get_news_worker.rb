class GetNewsWorker
  include Sidekiq::Worker
  sidekiq_options ({
    unique: true,
    expiration: 4 * 60 # 5 minute
    })

  def perform(*args)
    p "start GetNewsWorker"
    get_news
    p "end GetNewsWorker"
    sleep 300
  end

  def get_news
    urls = NewsWebsite.news.map do |x|
      each_news_url(x.website, x.realtime_news_url, x.css_location, x.has_link_website_url, x.name)
    end

    #data = []
    urls.flatten.map do |url|
      p url
      begin
        parser =  TaiwaneseNewsParser.parse(url[:url])
      rescue
        next
      end
      re = /(?<city>(台北|新北|台中|台南|高雄|基隆|新竹|嘉義|桃園|新竹|苗栗|彰化|南投|雲林|嘉義|屏東|宜蘭|花蓮|台東|澎湖|金門|連江)([縣市])?)(?<district>\D{2,3}(市區|鎮區|鎮市|[鄉鎮市區]))?(?<street>\D{2,3}([路街]))?/
      if !parser[:content].scan(re)[0].nil?
        p parser[:content]
        address = parser[:content].scan(re)[0].join
        location = Location.find_by(link_url: parser[:url])
        if location.nil?
          p address
          location = Location.create(link_url: parser[:url])
          map = Map.find_by(kind: "news")
          location.update({ map_id: map.id, title: parser[:title], content: parser[:content], address: address, start_at: parser[:published_at], remark: {name: url[:name]} })
        end
        #data << {title:parser[:title], content:parser[:content], link_url: parser[:url], address: address,start_at:parser[:published_at]}
      end
    end
  end

  def each_news_url(website, realtime_news_url,css_location, has_link_website_url, name)
    doc = Nokogiri::HTML(open(website + realtime_news_url))
    urls = doc.css(css_location).map do |link|
      if has_link_website_url
        {url: URI.escape(link.attr('href')), name: name}
      else
        {url: URI.escape(website+link.attr('href')), name:name}
      end

    end
    return urls
  end
end