class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def return_json(success=true, message='')
    render json: {success: success, message: message}.to_json
  end

  def octokit
    @octokit ||= Octokit::Client.new(client_id: ENV['github_client_id'],
                                     client_secret: ENV['github_client_secret'])
  end
end
