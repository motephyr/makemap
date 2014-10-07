class Factories
  include Mongoid::Document

  field :lat, type: Float
  field :lng, type: Float
  field :title, type: String
  field :content, type: String
  field :"主要產品", type: String
  field :"工廠名稱", type: String
  field :"工廠地址", type: String
  field :"工廠市鎮鄉村里", type: String
  field :"工廠登記核准日期", type: String
  field :"工廠登記狀態", type: String
  field :"工廠登記編號", type: String
  field :"工廠組織型態", type: String
  field :"工廠設立核准日期", type: String
  field :"工廠設立許可案號", type: String
  field :"工廠負責人姓名", type: String
  field :"營利事業統一編號", type: String
  field :"產業類別", type: String
  field :link_url
  field :photo
  field :user
end
