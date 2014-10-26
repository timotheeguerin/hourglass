class PagePreviewHandler

  # @param [Repository] repository: Repository to screenshot
  def initialize(repository)
    @repository = repository
    @webshot = WebShot.new
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
        puts "Rendering page: #{page}"
        next unless File.file?(page.path)
        page_revision = PageRevision.new
        page_revision.revision = revision
        page_revision.page = page
        page_revision.thumbnails = @webshot.thumbnails(URI.join(ENV['processing_host'],page.url(revision)))
        page_revision.save
      end
    end
    self
  end

  def close
    @webshot.close
  end
end