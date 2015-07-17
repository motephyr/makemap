namespace :get_kktix do
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
    p content
    link_url = result["url"]
    address = result["content"].split("地點：").last

    location =  Location.create({ map_id: 6, title: title, content: content, link_url:link_url,address: address })


  end
      #1.送網址發request
      #2.request包含url method params
      #3.get response
      #4.組成欄位
      #5.塞進db


    end

  end