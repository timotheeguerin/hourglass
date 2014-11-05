class AddDateToRevisions < ActiveRecord::Migration
  def change
    add_column :revisions, :date, :datetime
  end
end
