class ChangeProcessingToString < ActiveRecord::Migration
  def up
    change_column :repositories, :processing, :string
  end

  def down
    change_column :repositories, :processing, :integer, limit: 8
  end
end
