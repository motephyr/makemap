class String
  def string_between_markers marker1, marker2
    self[/#{Regexp.escape(marker1)}(.*?)#{Regexp.escape(marker2)}/m, 1]
  end
end
module JSON
  def self.parse_nil(json)
    JSON.parse(json) if json && json.length >= 2
  end
end
class Connection
  def initialize(url)
    @conn = Faraday.new(:url => url) do |faraday|
      faraday.request  :url_encoded
      faraday.response :logger
      faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end
  end

  def use_method_url_parsms_get_response(options)
    url = options[:parent_url]+options[:url]
    params = options[:params]
    response = @conn.send(options[:method]) do |req|
      req.url url, params
      req.headers['Content-Type'] = 'application/json'          # form-encode POST params
    end
    body = JSON.parse_nil(response.body)
    result_schema = JSON.parse_nil(body.to_json)

  end
end

class GetLocationsWorker
  include Sidekiq::Worker
  sidekiq_options ({
    unique: true,
    expiration: 4 * 60 # 5 minute
    })

  def perform(*args)
    p "start GetLocationsWorker"
    get_meetup
    p "meetup end"
    get_kktix
    p "kktix end"
    get_address
    p "address end"
    p "end GetLocationsWorker"
    sleep 300
  end




  def get_meetup
    conn = Connection.new('https://api.meetup.com')

    parent_url = "/2/open_events"
    method = :get
    url = ''
    params = {
      :"photo-host" => "public",
      zip: 886, country: "Taiwan", city: "Taipei", state: "Taiwan",
      lon:121.0, lat: 25.0, radius: 100,
      key: "28362d3b637902f40b782142501e78"
    }
    option = {method: method, parent_url: parent_url, url: url,params: params }
    results = conn.use_method_url_parsms_get_response option
    results["results"].each do |result|

      if result["venue"].nil?
        next
      end
      title = "MEETUP #{result["name"]}"
      content = result["description"]
      link_url = result["event_url"]
      address = result["venue"]["address_1"] + result["venue"]["name"]
      lng = result["venue"]["lon"]
      lat = result["venue"]["lat"]

      start_at = Time.at(result["time"]/1000)
      end_at = result["duration"].present? ? Time.at((result["time"]+result["duration"])/1000) : nil


      location = Location.find_by(link_url: link_url)
      if location.nil?
        location = Location.create(link_url: link_url)
        map = Map.find_by(kind: "activity")
        location.update({ map_id: map.id, title: title, content: content, address: address, lng: lng, lat: lat, start_at: start_at, end_at: end_at })
      end
    end
  end

  def get_kktix
    conn = Connection.new('https://kktix.com')

    parent_url = "events.json"
    method = :get
    url = ''
    params = {
    }
    option = {method: method, parent_url: parent_url, url: url,params: params }
    results = conn.use_method_url_parsms_get_response option
    results["entry"].each do |result|

      title = "KKTIX #{result["name"]} #{result["title"]}"
      content = "#{result["summary"]}_#{result["content"].split("地點：").first}"
      start_at = Time.parse(result["published"])
      end_at = "#{result["content"].string_between_markers("時間：","\n地點").split('~').last}"
      if end_at.length <= 5
        end_at = Time.parse(result["published"]).change(hour: end_at.split(":").first,minute: end_at.split(":").last)
      else
        end_at = Time.parse(end_at)
      end
      link_url = result["url"]
      address = result["content"].split("地點：").last

      location = Location.find_by(link_url: link_url)
      if location.nil?
        location = Location.create(link_url: link_url)
        map = Map.find_by(kind: "activity")
        location.update({ map_id: map.id, title: title, content: content, address: address, start_at: start_at, end_at: end_at })
      end

    end
  end

  def get_address
    locations = Location.where(lat: nil, lng: nil);

    locations.each do |location|


      query = {address: location.address.split('/').last, region:'tw' }

      address_q = URI.encode(query.map{|k,v| "#{k}=#{v}"}.join("&"))

      uri = URI('http://maps.googleapis.com/maps/api/geocode/json?'+address_q)
      response = Net::HTTP.get(uri)

      lat_lng = (JSON.parse(response)["results"].empty?) ? nil : JSON.parse(response)["results"][0]["geometry"]["location"]

      lat = !lat_lng.nil? ? lat_lng["lat"] : nil
      lng = !lat_lng.nil? ? lat_lng["lng"] : nil
      location.update_attributes(lat: lat, lng:lng)
      sleep(0.5)
    end
  end

end
