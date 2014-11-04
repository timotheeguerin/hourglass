class CompareController < ApplicationController
  def index

  end

  def compare
    authorize! :compare, Repository

    user = User.find(params[:user_id])
    repository = Repository.find(params[:repository_id])
    @params = {user_id: user.id,
               repository_id: repository.id,
               page: params[:page],
               left_revision_id: params[:left_revision_id],
               right_revision_id: params[:right_revision_id],
               type: params[:type],
               dual_type: params[:dual_type]}
  end
end
