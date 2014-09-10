module MapsHelper

  def render_user_role_for_map(map)

    if current_user
      role = if Map.with_role(:manager, current_user).present?
        "你是地圖管理者"
      elsif Map.with_role(:invitee, current_user).present?
        "你是共同編輯者"
      else
        "你是一般使用者"
      end
    else
      "你是一般使用者"
    end

    if current_user && map.present? 
      "地圖名稱：#{@map.title} (#{role})"            
    else  
      "地圖列表"
    end
  end
end
