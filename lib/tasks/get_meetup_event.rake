namespace :get_meetup do
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
  def json_schema(json)
    JSON::SchemaGenerator.generate nil , json,  {:schema_version => 'draft4'}
  end

  desc "make API document raml mode"

  task insert: :environment do

    conn = Connection.new('https://api.meetup.com')

    parent_url = "/2/open_events"
    method = :get
    url = ''
    params = {:"photo-host" => "public",
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
    p "#{title}_#{lng}_#{lat}"

    location =  Location.create({ map_id: 6, title: title, content: content, link_url:link_url,address: address, lng: lng, lat: lat })


  end
      #1.送網址發request
      #2.request包含url method params
      #3.get response
      #4.組成欄位
      #5.塞進db


    end

  end