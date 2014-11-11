class CompareController < ApplicationController
  def index

  end

  def compare

    user = User.find(params[:user_id])
    repository = Repository.find(params[:repository_id])
    page = repository.pages.find_by_path(params[:page])
    left_revision = repository.revisions.find_by_id(params[:left])
    right_revision = repository.revisions.find_by_id(params[:right])
    authorize! :compare, repository
    @params = {user: user.as_json,
               repository: repository.as_json,
               page: page.as_json,
               left_revision: left_revision.as_json,
               right_revision: right_revision.as_json,
               type: params[:type],
               dual_type: params[:dual_type]}
  end
end
