class PermissionsController < ApplicationController

  before_action :login_required, :only => [:create]

  def create
    @user = User.find_by(email: params[:email])
    if @user.present? && Permission.find_by(user: @user).blank?
      @permission = Permission.new
      @permission.map_id = params[:map_id]
      @permission.state = "invitee"
      @permission.user_id = @user.id
      @permission.save

      respond_to do |format|
        format.json { render json: @permission, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: "no_user", status: :unprocessable_entity }
      end

    end
  end
end
