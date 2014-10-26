class PagesController < ApplicationController
  load_and_authorize_resource :user, class: 'User'
  load_and_authorize_resource :repository, class: 'Repository', through: :user
  load_and_authorize_resource through: :repository

  def show
    unless params[:revision_id].nil?
      @page.revisions = @page.revisions.load.where('page_revisions.revision_id = ?', params[:revision_id])
    end
    render json: @page.as_json(methods: :revisions)
  end

  def list
    unless params[:revision_id].nil?
      @pages = @pages.eager_load(:revisions).where('page_revisions.revision_id = ?', params[:revision_id])
    end
    render json: @pages.as_json(methods: :revisions)
  end
end
