class PreviewController < ApplicationController
  def show
    user = User.find(params[:user_id])
    repository = user.repositories.find(params[:repository_id])
    revision = repository.revisions.find(params[:revision_id])
    content = GitUtils.file_at_rev(params[:path], revision)
    if  File.extname(params[:path]) == '.html'
      render html: content.html_safe
    else
      type = MIME::Types.type_for(File.basename(params[:path])).first
      if type.nil?
        send_data(content)
      else
        send_data(content, type: type.content_type)
      end
    end
  end
end
