class RepositoriesController < ApplicationController
  load_and_authorize_resource :user, class: 'User'
  load_and_authorize_resource through: :user

  def list
    unless params[:enabled].nil?
      @repositories = @repositories.where(enabled: (params[:enabled] == 'true'))
    end
    render json: @repositories.to_json
  end

  def sync
    current_user.sync_repositories
    return_json(true, 'Repositories synced')
  end

  def enable
    if @repository.processing == 0
      job_id = RepositoryPreprocessorWorker.perform_async(@repository.id)
      @repository.processing = job_id
    end
    @repository.enabled = true
    @repository.save
    return_json(true, 'Repository enabled')
  end

  def disable
    @repository.enabled = false
    @repository.save
    return_json(true, 'Repository disabled')
  end

  private
  def reset
    @repository = Repository.new
    @repositories = Repository.none
  end
end
