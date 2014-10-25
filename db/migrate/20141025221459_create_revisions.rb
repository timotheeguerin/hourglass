class CreateRevisions < ActiveRecord::Migration
  def change
    create_table :revisions do |t|
      t.references :repository, index: true
      t.string :hash
      t.integer :order
      t.string :message
      t.text :description

      t.timestamps
    end
  end
end
