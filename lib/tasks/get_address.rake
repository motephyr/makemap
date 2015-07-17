namespace :get_address do


  task insert: :environment do
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
