class Repository < ActiveRecord::Base
  belongs_to :user, class_name: User

  has_many :revisions, class_name: Revision
  has_many :pages, class_name: Page

  validates_uniqueness_of :name, scope: :user_id

  def master
    revision.order(:order).last
  end

  def sync_revision(octokit)
    commits = octokit.commits("#{user.username}/#{name}")
    commits.each_with_index do |commit, i|
      if revisions.find_by_hash(commit.sha).nil?
        revision = Revision.new
        revision.order = commits.size - i
        revision.hash = commit.sha
        revision.message = commit.commit.message
        revision.repository = self
        revision.save
      end
    end
  end

  def sync_pages
    Dir.chdir(master.local_path) do
      Dir['**/*.html'].each do |html_page|
        if pages.find_by_path(html_page).nil?
          page = Page.new
          page.name = html.basename
          page.path = html_page
          page.repository = self
          page.save
        end
      end
    end
  end

  def local_path
    File.join(ENV['repositories_base'], user.username, name)
  end
end
