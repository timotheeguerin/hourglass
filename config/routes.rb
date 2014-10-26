Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}

  root 'welcome#index'

  # get 'preview/:user_id/:repository/:revision/:path'

  get 'test' => 'welcome#test'
  resources :users do
    resources :repositories do
      member do
        post 'enable'
        post 'disable'
      end

      collection do
        get 'list'
      end
    end
  end
end
