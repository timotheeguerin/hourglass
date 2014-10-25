class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: [:github]

  has_many :repositories, class_name: Repository

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.username = auth.info.nickname
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if (data = session['devise.github_data']) && session['devise.github_data']['extra']['raw_info']
        user.email = data['email'] if user.email.blank?
      end
    end
  end

  # Sync the user project with github
  def sync_repositories(octokit)
    octokit.repos(username).each do |github_repo|
      if Repository.find_by_id(github_repo.name).nil?
        repository = Repository.new
        repository.name = github_repo.name
        repository.url = github_repo.html_url
        repository.description = github_repo.description
        repository.user = self
        repository.save
      end
    end
  end
end
