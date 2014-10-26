class RepositoryPreprocessorWorker
  include Sidekiq::Worker

  # @param [int] repository_id:
  def perform(repository_id)
    repository = Repository.find(repository_id)
    GitUtils.sync(repository)
    repository.sync_revisions
    repository.sync_pages
    handler = PagePreviewHandler.new(repository)
    handler.compute_all
    handler.close

    repository.processing=false
    repository.save
  end
end

