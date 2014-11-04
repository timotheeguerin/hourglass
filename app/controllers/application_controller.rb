class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def return_json(success=true, message: '', data: {})
    render json: {success: success, message: message, data: data}.to_json
  end
end
