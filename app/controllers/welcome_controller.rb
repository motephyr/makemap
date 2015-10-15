class WelcomeController < ApplicationController

  def search_location
    if params[:q].present?
      @result = Geocoder.coordinates("台灣 "+params[:q])
      respond_to do |format|
        format.json {render :json => @result }
      end
    end
  end

  def getjson
    url = URI.parse(params[:url])
    req = Net::HTTP::Get.new(url.to_s)
    @result = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    respond_to do |format|
      format.json {render :json => JSON.parse(@result.body) }
    end
  end
end
