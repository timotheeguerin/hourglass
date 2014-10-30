WebsocketRails::EventMap.describe do
  namespace :tasks do
    # using the same syntax as routes.rb
    subscribe :update, 'task#update'
  end
end