namespace :get_kktix do
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
      start_at = Time.parse(result["published"])
      end_at = "#{result["content"].string_between_markers("時間：","\n地點").split('~').last}"
      if end_at.length <= 5
        end_at = Time.parse(result["published"]).change(hour: end_at.split(":").first,minute: end_at.split(":").last)
      else
        end_at = Time.parse(end_at)
      end
      link_url = result["url"]
      address = result["content"].split("地點：").last

      location = Location.find_or_create_by(link_url: link_url)
      location.update({ map_id: 10, title: title, content: content, address: address, start_at: start_at, end_at: end_at })


    end
      #1.送網址發request
      #2.request包含url method params
      #3.get response
      #4.組成欄位
      #5.塞進db


    end

  end