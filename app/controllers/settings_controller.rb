class SettingsController < ApplicationController
  def index
    user = User.find(params[:user_id])
    @params = {user_id: user.id, page: params[:page], type: params[:type]}
  end
end
