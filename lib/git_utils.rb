class GitUtils
  def self.sync(repo)
    if File.directory?(File.join(repo.local_path, '.git'))
      g = Git.open(repo.local_path)
      g.pull
    else
      FileUtils.mkdir_p(repo.local_path)
      Git.clone(repo.url, repo.name, path: repo.user.local_path)
    end
  end
  def self.file_at_rev(file, rev)
    g = Git.open(rev.repository.local_path)
    g.object("#{rev.sha}:#{file}").contents
  end
end