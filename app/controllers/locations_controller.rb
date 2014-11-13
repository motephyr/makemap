class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :login_required, :only => [:new,:create]
  before_action :set_maps
  authorize_resource #cancan's setting


  # GET /maps/1/locations.json
  def index
    @map = Map.find(params[:map_id])
    @locations =  @map.locations.select(:id,:title,:lat,:lng)

    respond_to do |format|
      format.json { render :json => @locations }
    end
  end

  # GET /maps/1/locations/1.js
  def show
    @map = Map.find(params[:map_id])
    @location = Location.find(params[:id])

    respond_to do |format|
      format.js
    end
  end

  def new
    @map = Map.find(params[:map_id])
    @location = @map.locations.new
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
  
  def upload_page
    @map = Map.find(params[:map_id])
    @location = @map.locations.new
  end

  def upload
    csv_file = CSV.read(params[:file].tempfile)

    redirect_to map_path(@map)
  end

  private
  def location_params
    params.require(:location).permit(:title,:content,:photo,:link_url,:lat,:lng)
  end

end
