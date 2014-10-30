class ChangeRepositoryProcessingTypeToInteger < ActiveRecord::Migration
  def up
    change_column :repositories, :processing, :integer
  end

  def down
    change_column :repositories, :processing, :boolean
  end
end
