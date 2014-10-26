class RenameHashToShaInRevision < ActiveRecord::Migration
  def change
    rename_column :revisions, :hash, :sha
  end
end
