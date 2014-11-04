class AddSyncAtToRepositories < ActiveRecord::Migration
  def change
    add_column :repositories, :sync_at, :datetime
  end
end
