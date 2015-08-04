class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :configure_permitted_parameters, if: :devise_controller?

  def current_ability
    mapid = params[:map_id] || params[:id]
    #map = (mapid.class != String && !mapid.nil?) ? Map.find(mapid) : nil
    map = (!mapid.nil?) ? Map.find(mapid) : nil
    @current_ability = Ability.new(current_user, map)
  end

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
      self_maps =  Map.with_role([:admin, :manager,:invitee],current_user)
      other_maps = Map.where(private: false)

      @maps = (self_maps + other_maps).uniq.sort
    else
      @maps = Map.where(private: false).sort
    end
  end

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:name,:fb_id,:token]
    devise_parameter_sanitizer.for(:account_update) << [:name]
  end
end
