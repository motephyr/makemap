class Ability
  include CanCan::Ability



  def initialize(user,resource)
    # cannot :manage, :all  #default設置無法管理任何資源
    can :manage, :all

    alias_action :create,:read, :to => :starter
    alias_action :create,:update,:read, :to => :change_location
    if !resource.respond_to?(:private) || !resource.private
      if user.blank? 
        # not logged in 如果user沒登入
        basic_read_only #呼叫基本權限設定 Medthod 
      elsif user.has_role?(:admin,resource) #如果role 為 admin'
        # admin
        can :manage, :all #管理所有資源
      elsif user.has_role?(:manager,resource) #如果role 為 manager
        map_manager_only(user)
      elsif user.has_role?(:invitee,resource)
        map_invitee_only(user)
      else
        basic_read_only #呼叫基本權限設定 Medthod 
      end
    else
      if user.blank? 
        # not logged in 如果user沒登入
      elsif user.has_role?(:admin,resource) #如果role 為 admin'
        # admin
        can :manage, :all #管理所有資源
      elsif user.has_role?(:manager,resource) #如果role 為 manager
        map_manager_only(user)
      elsif user.has_role?(:invitee,resource)
        map_invitee_only(user)
      else
      end
    end


  end



  protected


  def basic_read_only
    can :starter,   Map
    can :read,    Location
  end

  def map_manager_only(user)
    can :manage, Map, :id => Map.with_role(:manager, user).pluck(:id)
    can :manage, Location, :map_id => Map.with_role(:manager, user).pluck(:id)
  end

  def map_invitee_only(user)
    can :read, Map, :id => Map.with_role(:invitee, user).pluck(:id)
    can :change_location, Location, :map_id => Map.with_role(:invitee, user).pluck(:id)
  end



end