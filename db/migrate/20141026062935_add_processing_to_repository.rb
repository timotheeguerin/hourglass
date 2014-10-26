class AddProcessingToRepository < ActiveRecord::Migration
  def change
    add_column :repositories, :processing, :boolean, default: false
  end
end
