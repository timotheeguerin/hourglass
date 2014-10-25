class Repository < ActiveRecord::Base
  belongs_to :user, class_name: User

  has_many :revisions, class_name: Revision
  has_many :pages, class_name: Page

  validates_uniqueness_of :name, scope: :user_id
end
