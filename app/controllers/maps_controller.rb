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

  def show

    @map = params[:id].present? ? Map.find(params[:id]) : Map.find_by_kind!(request.subdomain)
    @style = @map.style.to_json
  
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
    # binding.pry
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


  def style_editor
    @map = Map.find(params[:map_id])
    @style = @map.style.to_json
  end

  def style_img
    # binding.pry
    res = {}
    # file = params[:se_img]
    # url = params[:se_img_url]
    file = params[:_im_upload]
    ac = params[:_im_action]
    url_path = "uploads/style_image/map_#{params[:map_id]}"
    if file and ac == 'create'
      # new file
      base_path = File.expand_path(Rails.public_path)
      file_path = FileUtils.mkdir_p("#{base_path}/#{url_path}")
      
      file_name = file.original_filename
      file_path = file_path[0]
      
      File.open("#{file_path}/#{file_name}", 'wb') { |f| f.write(file.read)}
      res['_im_res_url'] = "/#{url_path}/#{file_name}"
      res['success'] = true
    # elsif ac == 'remove'
    #   # remove file
    #   # File.delete(path_to_file) if File.exist?(path_to_file)
    #   path = params[:_im_source]
    #   name = path.split(url_path)[1]
    #   if name
    #     # binding.pry
    #     File.delete(Rails.root + "/#{url_path}#{name}")
    #     res['success'] = true
    #   end
    end
    respond_to do |format|
      format.json { render :json => res }
    end
  end

  def assign_manager_role
    assign_role("manager")
  end

  def assign_other_role
    assign_role("other")
  end

  private

  def map_params
    params.require(:map).permit(:title, :description, :private, :style, :location_pins_attributes => [:id, :pin])
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
