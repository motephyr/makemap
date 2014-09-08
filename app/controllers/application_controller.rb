class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :configure_permitted_parameters, if: :devise_controller?

  def login_required
    if current_user.blank?
      respond_to do |format|
        format.html {
          authenticate_user!
        }
        format.js {
          render :partial => "common/not_logined"
        }
        format.all {
          head(:unauthorized)
        }
      end
    end
  end

  def set_maps
    if current_user
      @permissions = Permission.where(user_id: current_user.id)
      ids = @permissions.map {|x| x.map_id}
      @maps = Map.where(id: ids)
    else
      @maps = Map.where(private: false) 
    end
  end

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:name,:fb_id,:token]
    devise_parameter_sanitizer.for(:account_update) << [:name]
  end
end
