module MapsHelper

  def render_user_role_for_map(map)
    if current_user && is_existed_map(map)      
      role = if Map.with_role(:manager, current_user).pluck(:id).include?(map.id)
        "你是地圖管理者"
      elsif Map.with_role(:invitee, current_user).pluck(:id).include?(map.id)
        "你是共同編輯者"
      else
        "你是一般使用者"
      end
    else
      "你是一般使用者"
    end
  end

  def render_map_title_for_map(map)

    if current_user && is_existed_map(map)
      "地圖名稱：#{@map.title}"            
    else  
      "地圖列表"
    end
  end

  def is_existed_map(map)
    map.present? && map.id?
  end
end
