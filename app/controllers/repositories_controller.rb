class RepositoriesController < ApplicationController
  load_and_authorize_resource :user, class: 'User'
  load_and_authorize_resource through: :user

  def list
    render json: @repositories.to_json
  end

  def enable
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
