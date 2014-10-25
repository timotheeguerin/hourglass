class PageRevision < ActiveRecord::Base
  belongs_to :revision
  has_attached_file :thumbnails
  validates_attachment_content_type :thumbnails, content_type: /\Aimage\/.*\Z/
end
