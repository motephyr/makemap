class MapsController < ApplicationController

  before_action :login_required, :only => [:new, :create, :update, :destroy]
  before_action :set_maps
  authorize_resource #cancan's setting

  def index
  end

  def new
    @map = Map.new
  end

  def edit
    @map = Map.find(params[:id])
  end

  def style_editor
    
  end

  def show
    @map = params[:id].present? ? Map.find(params[:id]) : Map.find_by_kind!(request.subdomain)

    if @map.kind == "activity"
      #GetLocationsWorker.perform_async
      render :show_activity
    elsif @map.kind == "google"
      render :show_google
    elsif @map.kind == "sheethub"
      @data_url = params[:data_url]
      render :show_sheethub
    elsif @map.kind == "news"
      #GetNewsWorker.perform_async
      render :show_news
    end
  end

  def create
    @map = current_user.maps.build(map_params)
    if @map.save
      current_user.add_role :admin,@map

      redirect_to map_path(@map)
    else
      render :new
    end
  end

  def update
    @map = Map.find(params[:id])
    if @map.update(map_params)
      redirect_to map_path(@map)
    else
      render :edit
    end
  end

  def destroy
    @map = Map.find(params[:id])
    @map.destroy
    redirect_to maps_path, notice: "成功刪除了地圖"
  end



  def assign_manager_role
    assign_role("manager")
  end

  def assign_other_role
    assign_role("other")
  end

  private

  def map_params
    params.require(:map).permit(:title, :description, :private, :location_pins_attributes => [:id, :pin])
  end

  def assign_role(role_name)
    @user = User.find_by(email: params[:email])

    if @user.present?
      @map = Map.find(params[:id])
      @user.add_role role_name, @map
      respond_to do |format|
        format.json { render json: "success", status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: "no_user", status: :unprocessable_entity }
      end
    end
  end
end
