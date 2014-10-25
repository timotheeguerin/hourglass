class Repository < ActiveRecord::Base
  belongs_to :user, class_name: User

  validates_uniqueness_of :name, scope: :user_id
end
