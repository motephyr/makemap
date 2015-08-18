class WelcomeController < ApplicationController

  def search_location
    if params[:q].present?
      @result = Geocoder.coordinates("台灣 "+params[:q])
      respond_to do |format|
        format.json {render :json => @result }
      end
    end
  end

  def style_editor
  	
  end
end
