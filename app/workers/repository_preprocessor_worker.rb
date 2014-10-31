class RepositoryPreprocessorWorker
  include Sidekiq::Worker

  # @param [int] repository_id:
  def perform(repository_id)
    repository = Repository.find(repository_id)
    channel = WebsocketChannel.find(:repository_processing, repository_id)

    tracker = ProgressTracker.new
    tracker.on_update do
      channel.trigger(:updated,
                      progress: tracker.ratio)
    end

    tracker.run 1 do
      # Clone or pull the repo
      GitUtils.sync(repository)
    end

    tracker.run 1 do
      # Sync the revision
      repository.sync_revisions
    end
    tracker.run 1 do
      #Sync the pages
      repository.sync_pages
    end

    tracker.sub 97 do |sub_tracker|
      handler = PagePreviewHandler.new(repository)
      #Take the screenshots
      page_to_render = handler.page_to_render
      handler.on :page_rendered do |page|
        sub_tracker.update(100.to_f/page_to_render)
      end
      handler.compute_all
      handler.close
    end

    repository.processing = 0
    repository.save
  end
end

