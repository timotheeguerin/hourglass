class Page < ActiveRecord::Base
  belongs_to :repository, class_name: Repository

  has_many :revisions, class_name: PageRevision

  validates_presence_of :repository_id

  def url(revision = nil)
    revision ||= repository.master
    Rails.application.routes.url_helpers.preview_path(repository.user, repository, revision, path)
  end

  def local_path(revision = nil)
    revision ||= repository.master
    File.join(revision.local_path, path)
  end
end
