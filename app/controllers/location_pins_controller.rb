class LocationPinsController < ApplicationController

  def create
    @photo = LocationPin.create!(:pin => params[:photo], :map_id => params[:map_id] )

    respond_to do |format|
      if @photo.save
        format.html { redirect_to @photo, notice: 'Photo was successfully created.' }
        format.json {
          data = {id: @photo.id, thumb: view_context.image_tag(@photo.pin.url)}
          render json: data, status: :created, map: @photo
        }
      else
        format.html { render action: "new" }
        format.json { render json: @photo.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @map = Map.find(params[:map_id])
    @photo = @map.location_pins.find(params[:id])

    @photo.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end

end
