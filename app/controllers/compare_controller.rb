class CompareController < ApplicationController
  def index

  end

  def compare

    user = User.find(params[:user_id])
    repository = Repository.find(params[:repository_id])
    authorize! :compare, repository
    @params = {user_id: user.id,
               repository_id: repository.id,
               page: params[:page],
               left_revision_id: params[:left],
               right_revision_id: params[:right],
               type: params[:type],
               dual_type: params[:dual_type]}
  end
end
