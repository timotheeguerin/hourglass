class GitUtils
  def self.sync(repo)
    if File.directory?(dirname)
      g = Git.open(repo.local_path)
      g.pull
    else
      Git.clone(repo.url, repo.name, repo.local_path)
    end
  end
  def self.file_at_rev(file, rev)
    g.object(rev.hash << ':' << file).contents
  end
end