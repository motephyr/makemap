class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :login_required, :only => [:new,:create]
  before_action :set_maps
  authorize_resource #cancan's setting


  # GET /maps/1/locations.json
  def index
    @map = Map.find(params[:map_id])
    @locations =  @map.locations
    respond_to do |format|
      format.json { render :json => @locations }
    end
  end

  # GET /maps/1/locations/1.js
  def show
    @map = Map.find(params[:map_id])
    @location = Location.find(params[:id])
    @photos = @location.photos.all

    respond_to do |format|
      format.html
      format.js
    end
  end

  def new
    @map = Map.find(params[:map_id])
    @location = @map.locations.new
    @location.lat = 23.974093
    @location.lng = 120.979903
    @location.photos.build
  end

  def edit
    @map = Map.find(params[:map_id])
    @location = Location.find(params[:id])
  end

  def create
    @map = Map.find(params[:map_id])
    @location = current_user.locations.build(location_params)
    @location.map_id = @map.id
    if @location.save

      redirect_to map_path(@map)
    else
      render :new
    end
  end

  def update

    @map = Map.find(params[:map_id])
    @location = Location.find(params[:id])
    if @location.update(location_params) 
      redirect_to map_path(@map)
    else
      render :edit
    end
  end

  def destroy
    @map = Map.find(params[:map_id])
    @location = Location.find(params[:id])

    @location.destroy

    redirect_to map_path(@map)
  end
  
  def upload_page
    @map = Map.find(params[:map_id])
    @locations = @map.locations
    respond_to do |format|
      format.html
      format.csv { send_data @locations.to_csv }
      format.xls { send_data @locations.to_csv(col_sep: "\t") }
    end
  end

  def import
    @map = Map.find(params[:map_id])
    Location.import(params[:map_id],params[:file])
    redirect_to map_path(@map), notice: "位置已匯入。"
  end

  private
  def location_params
    params.require(:location).permit(:title,:content,:link_url,:lat,:lng,photos_attributes: [:id, :photoable_id, :photoable_type, :photo])
  end

end
