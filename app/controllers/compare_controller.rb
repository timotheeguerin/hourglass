class CompareController < ApplicationController
  def index
    authorize! :compare, Repository
  end
end
