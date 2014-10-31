class WelcomeController < ApplicationController
  def index

  end

  def test
    # Thread.new do
    #   repository = Repository.find_by_name('wunderlabs')
    #   GitUtils.sync(repository)
    #   repository.sync_revisions
    #   repository.sync_pages
    #   handler = PagePreviewHandler.new(repository)
    #   handler.compute_all
    #   handler.close
    # end
    # return_json
  end
end