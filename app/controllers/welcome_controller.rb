class WelcomeController < ApplicationController
  def index

  end

  def test
    RepositoryPreprocessorWorker.perform_async(61)
    return_json
  end
end