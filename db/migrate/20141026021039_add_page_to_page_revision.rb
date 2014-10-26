class AddPageToPageRevision < ActiveRecord::Migration
  def change
    add_reference :page_revisions, :page, index: true
  end
end
