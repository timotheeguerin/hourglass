class Revision < ActiveRecord::Base
  belongs_to :repository, class_name: Repository
  has_many :pages, class_name: PageRevision


  def local_path
    self.hash
    self.message
    self.
    File.join(repository.local_path, hash)
  end
end
