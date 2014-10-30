class RepositoryPreprocessorWorker
  include Sidekiq::Worker

  # @param [int] repository_id:
  def perform(repository_id)
    repository = Repository.find(repository_id)

    # Clone or pull the repo
    GitUtils.sync(repository)

    # Sync the revision
    repository.sync_revisions

    #Sync the pages
    repository.sync_pages

    #Take the screenshots
    handler = PagePreviewHandler.new(repository)
    handler.on 'page_rendered' do |page|

    end
    handler.on 'revision_rendered' do |page|

    end
    handler.compute_all
    handler.close

    repository.processing = 0
    repository.save
  end
end

