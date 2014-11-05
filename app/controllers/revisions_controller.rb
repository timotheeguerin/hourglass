class RevisionsController < ApplicationController
  load_and_authorize_resource :user, class: 'User'
  load_and_authorize_resource :repository, class: 'Repository', through: :user
  load_and_authorize_resource through: :repository

  def show
    @revision.pages = @revision.pages.load.where('page_revisions.page_id = ?', page_id)
    render json: @page.as_json(methods: :revisions)
  end

  def list
    @revisions = @revisions.eager_load(:pages).where('page_revisions.page_id = ?', page_id)
    render json: @revisions.as_json(methods: :pages)
  end

  def page_id
    params[:page_id] || @repository.pages.first.id
  end
end
