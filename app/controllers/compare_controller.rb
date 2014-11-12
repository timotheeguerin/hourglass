class CompareController < ApplicationController
  def index

  end

  def compare
    @params = {}
    @params[:type] = params[:type] if params.has_key?(:type)
    @params[:dual_type] = params[:dual_type] if params.has_key?(:dual_type)

    @params[:user] = User.find_by_id(params[:user_id]) if params.has_key?(:user_id)
    @params[:repository] = @params[:user].repositories.find_by_id(params[:repository_id]) if @params.has_key?(:user)
    @params[:page] = @params[:repository].pages.find_by_path(params[:page]) if @params.has_key?(:repository)
    @params[:left_revision] = @params[:repository].revisions.find_by_id(params[:left]) if @params.has_key?(:repository)
    @params[:right_revision] = @params[:repository].revisions.find_by_id(params[:right]) if @params.has_key?(:repository)
    authorize! :compare, @params[:repository] if @params.has_key?(:repository)

  end
end
