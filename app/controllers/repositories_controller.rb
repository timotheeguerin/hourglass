class RepositoriesController < ApplicationController
  load_and_authorize_resource :user, class: 'User'
  load_and_authorize_resource through: :user

  def list
    render json: @repositories.to_json
  end

  def sync
    current_user.sync_repositories
    return_json(true, 'Repositories synced')
  end

  def enable
    RepositoryPreprocessorWorker.sync(@repository) unless @repository.processing
    @repository.enabled = true
    @repository.processing = true
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
