class MapsController < ApplicationController

  before_action :login_required, :only => [:new,:create]
  before_action :set_maps
  authorize_resource #cancan's setting

  def index

  end

  def new
    @map = Map.new
  end

  def edit
    @map = Map.find(params[:id])

    @manager_users = User.with_role(:manager,@map)
    @invitee_users = User.with_role(:invitee,@map)
    @other_users = User.with_role(:other,@map)

  end

  def show
    @map = Map.find(params[:id])
  end

  def create
    @map = Map.new(map_params)
    if @map.save
      current_user.add_role :manager,@map.id

      redirect_to map_path(@map)
    else
      render :new
    end
  end


  def assign_manager_role
    assign_role("manager")
  end

  def assign_invitee_role
    assign_role("invitee")
  end

  def assign_other_role
    assign_role("other")
  end

  private

  def map_params
    params.require(:map).permit(:title, :description, :private)
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
