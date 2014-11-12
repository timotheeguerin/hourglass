class PagesController < ApplicationController
  load_and_authorize_resource :user, class: 'User'
  load_and_authorize_resource :repository, class: 'Repository', through: :user
  load_and_authorize_resource through: :repository

  def show
    @page.revisions = @page.revisions.load #.where('page_revisions.revision_id = ?', revision_id)
    render json: @page.as_json(methods: :revisions)
  end

  def list
    @pages = @pages.where('path like ?', "%#{params[:q]}%") unless params[:q].nil?
    @pages = @pages.eager_load(:revisions).where('page_revisions.revision_id = ?', revision_id)
    render json: @pages.as_json(methods: :revisions)
  end

  def revision_id
    params[:revision_id] || @repository.master.id
  end
end
