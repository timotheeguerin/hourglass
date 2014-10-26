class PageRevision < ActiveRecord::Base
  belongs_to :revision
  belongs_to :page
  has_attached_file :thumbnails
  validates_attachment_content_type :thumbnails, content_type: /\Aimage\/.*\Z/

  validates_uniqueness_of :revision_id, scope: :page_id

  def as_json(options = nil)
    {thumbnails: thumbnails.url}
  end
end
