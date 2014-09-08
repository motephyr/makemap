module MapsHelper

  def render_user_role_for_map(map)
    if map.present?
      permission = map.permissions.find_by(user_id: current_user.id )
    end

    role = if permission.present?
      case permission.state
      when "admin"
        "你是地圖管理者"
      when "invitee"
        "你是共同編輯者"
      when "other"
        "你是一般使用者"
      end
    else
      "你是一般使用者"
    end

    if map.present? 
      "地圖名稱：#{@map.title} (#{role})"            
    else  
      "地圖列表"
    end
  end
end
