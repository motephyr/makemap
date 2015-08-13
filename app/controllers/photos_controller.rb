class PhotosController < ApplicationController

  def create
    @photo = Photo.create!(:photo => params[:photo], :photoable_id => params[:photoable_id], photoable_type: params[:photoable_type] )

    respond_to do |format|
      if @photo.save
        format.html { redirect_to @photo, notice: 'Photo was successfully created.' }
        format.json {
          data = {id: @photo.id, thumb: view_context.image_tag(@photo.photo.url(:thumb))}
          render json: data, status: :created, location: @photo
        }
      else
        format.html { render action: "new" }
        format.json { render json: @photo.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @location = Location.find(params[:location_id])
    @photo = @location.photos.find(params[:id])

    @photo.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
