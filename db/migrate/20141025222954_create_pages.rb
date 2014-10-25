class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :name
      t.string :path
      t.references :repository, index: true

      t.timestamps
    end
  end
end
