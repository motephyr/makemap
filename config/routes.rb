Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  get '', to: 'maps#show', constraints: lambda { |r| r.subdomain.present? && r.subdomain != 'www' }
  root 'maps#index'

  require 'sidekiq/web'
  authenticate :user, lambda { |u| u.id == 1 } do
    mount Sidekiq::Web => '/sidekiq'
  end

  arrayMap = (1..6).map { |x| %Q(get 'index#{x}'\n)}
  arrayMapReduce = arrayMap.reduce { |x,y| x+y }

  resources :welcome do
    collection do
      get 'demo'
      get 'search_location'
      get 'getjson'
      eval(arrayMapReduce)
    end
  end

  resources :maps do
    resources :location_pins
    resources :locations do
      collection do
        get 'invite_page'
        get 'upload_page'
        post 'import'
      end
    end


    member do
      get 'edit_js_str_page'
      post 'invite_member'
      post 'assign_manager_role'
    end
  end

  resources :locations do
    resources :photos
  end

  resources :photos

  resources :factories  do
    collection do
      get 'demo1'
      get 'demo2'
    end
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
