class MapsController < ApplicationController

  before_action :login_required, :only => [:new,:create]
  before_action :set_maps

  def index

  end

  def new
    @map = Map.new
  end

  def edit
    @map = Map.find(params[:id])
  end

  def show
    @map = Map.find(params[:id])
  end

  def create
    @map = Map.new(map_params)
    if @map.save
      @permission = current_user.permissions.build
      @permission.map_id = @map.id
      @permissson.state = "admin"
      @permissson.save

      redirect_to map_path(@map)
    else
      render :new
    end
  end

  private

  def map_params
    params.require(:map).permit(:title, :description, :private)
  end
end
