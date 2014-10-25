class CreatePageRevisions < ActiveRecord::Migration
  def change
    create_table :page_revisions do |t|
      t.references :revision, index: true
      t.timestamps
    end

    add_attachment :page_revisions, :thumbnails
  end
end
