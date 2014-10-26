class PreviewController < ApplicationController
  def show
    user = User.find(params[:user_id])
    repository = user.repositories.find(params[:repository_id])
    revision = repository.revision.find(params[:revision])
    path = params[:path]

  end
end
