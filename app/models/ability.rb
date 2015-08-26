class Ability
  include CanCan::Ability

  def initialize(user,resource)
    # cannot :manage, :all  #default設置無法管理任何資源

    alias_action :create,:read, :to => :starter
    alias_action :update,:read,:assign_manager_role,:style_editor, :to => :change_map
    alias_action :create,:update,:read, :to => :change_location
    if resource.nil?
      basic_read_only
    elsif !resource.respond_to?(:private) || !resource.private
      #地圖是公開的
      #只有開地圖的人可以設定是否公開
      #被邀請的人可以修改地圖簡介、檢視、編輯
      #登入的人都可以檢視、編輯
      #沒登入的人只能檢視
      if user.blank?
        # not logged in 如果user沒登入
        basic_read_only #呼叫基本權限設定 Medthod
      elsif user.has_role?(:admin,resource) #如果role 為 admin'
        # admin
        can :manage, :all #管理所有資源
      elsif user.has_role?(:manager,resource) #如果role 為 manager
        map_manager_only(user,resource.id)
      # elsif user.has_role?(:invitee,resource)
      #   map_invitee_only(user)
      else
        map_manager_only(user,resource.id) #呼叫基本權限設定 Medthod
      end
    else
      #地圖是私人的
      #只有開地圖的人可以設定是否公開
      #被邀請的人可以修改地圖簡介、檢視、編輯
      #其他人只能檢視
      if user.blank?
        # not logged in 如果user沒登入
        basic_read_only
      elsif user.has_role?(:admin,resource) #如果role 為 admin'
        # admin
        can :manage, :all #管理所有資源
      elsif user.has_role?(:manager,resource) #如果role 為 manager
        map_manager_only(user,resource.id)
      # elsif user.has_role?(:invitee,resource)
      #   map_invitee_only(user)
      else
        basic_read_only
      end
    end


  end



  protected


  def basic_read_only
    can :starter,   Map
    can :read,    Location
  end

  def map_manager_only(user,id)
    can :change_map, Map, :id => id
    can :manage, Location, :map_id => id
  end

  def map_invitee_only(user,id)
    can :read, Map, :id => id
    can :change_location, Location, :map_id => id
  end



end