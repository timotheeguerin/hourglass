class PagePreviewHandler
  def initialize(repository)
    @repository = repository
    @webshot = WebShot.new
  end

  def compute_all(override=false)
    @repository.revision.each do |revision|
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
    pages = pages.not.where(id: revision.pages.pluck(:page_id)) unless override

    pages.each do |page|
      next unless File.file?(page)
      page_revision = PageRevision.new
      page_revision.revision = revision
      page_revision.page = page
      page_revision.thumbnails = @webshot.thumbnails(page.url(revision))
      page_revision.save
    end
    self
  end

  def close
    @webshot.close
  end
end