# Take the screenshot of all html page for each revision
class PagePreviewHandler


  # @param [Repository] repository: Repository to screenshot
  def initialize(repository)
    @repository = repository
    @webshot = WebShot.new
    @subscribers = {}
  end

  # Registers subscribers to event
  # @param event: event name, can be one of the following
  #                 * page_rendered: When a page has been rendered(Args: [Page])
  #                 * revision_rendered: When a revision has been rendered(Args: [Revision])
  # @param block: callback
  def on(event, &block)
    @subscribers[event] ||= []
    @subscribers[event] << block
  end

  def trigger(event, *args)
    return if @subscribers[event].nil?
    @subscribers[event].each do |block|
      block.call(*args)
    end
  end

  def compute_all(override=false)
    @repository.revisions.each do |revision|
      compute(revision, override)
    end
    self
  end

  # Take all the screenshot for all the page of the given revision
  # @param revision: revision to process
  # @param override: to override existing screenshot
  # @return self
  def compute(revision, override=false)
    pages = @repository.pages
    pages = pages.where.not(id: revision.pages.pluck(:page_id)) unless override
    Dir.chdir(@repository.local_path) do
      pages.each do |page|
        next unless File.file?(page.path)
        page_revision = PageRevision.new
        page_revision.revision = revision
        page_revision.page = page
        page_revision.thumbnails = @webshot.thumbnails(URI.join(ENV['processing_host'], page.url(revision)))
        page_revision.save
        trigger('page_rendered', page)
      end
    end
    trigger('revision_rendered', revision)
    self
  end

  def close
    @webshot.close
  end
end