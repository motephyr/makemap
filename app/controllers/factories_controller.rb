class FactoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :login_required, :only => [:new,:create]
  authorize_resource #cancan's setting

  # GET /maps/1/locations.json
  def index
    factories_has_lat = nil;
    if !params[:catagory].nil? 
      factories_has_lat = Factories.where(:lat.exists => true, :產業類別 => params[:catagory] )
    else
      factories_has_lat = Factories.where(:lat.exists => true)
    end
    factories = factories_has_lat.map do |i| 
      if(rand > 0.99) 
        i 
      end
    end.compact.to_a

    @locations = factories.map do |factory|
      mapping_attribute(factory)
    end

    respond_to do |format|
      format.json { render :json => @locations }
    end
  end

  # GET /maps/1/locations/1.js
  def show
    #@location = Location.find(params[:id])
    factory = Factories.find(params[:id])
    
    @location = mapping_attribute(factory)
    @location.link_url = ""
    respond_to do |format|
      format.js 
    end
  end

  def new
    @location = @map.locations.new
  end

  def edit
    @location = Location.find(params[:id])
  end

  def create
    @location = current_user.locations.build(location_params)
    @location.map_id = @map.id
    if @location.save
      redirect_to map_path(@map)
    else
      render :new
    end
  end

  def update
    @location = Location.find(params[:id])
    if @location.update(location_params)
      redirect_to map_path(@map)
    else
      render :edit
    end
  end
  
  def upload_page
    @location = @map.locations.new
  end

  def upload
    csv_file = CSV.read(params[:file].tempfile)

    redirect_to map_path(@map)
  end

  def demo1
  end

  private
  def location_params
    params.require(:location).permit(:title,:content,:photo,:link_url,:lat,:lng)
  end

  def mapping_attribute(factory)
    mapping = { :title => "工廠名稱",:content => "產業類別" }.to_a
    factory[mapping[0][0]] = factory[mapping[0][1]]
    factory[mapping[1][0]] = factory[mapping[1][1]]
    factory
  end
end
