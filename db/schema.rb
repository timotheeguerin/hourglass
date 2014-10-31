# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141028145441) do

  create_table "page_revisions", force: true do |t|
    t.integer  "revision_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "thumbnails_file_name"
    t.string   "thumbnails_content_type"
    t.integer  "thumbnails_file_size"
    t.datetime "thumbnails_updated_at"
    t.integer  "page_id"
  end

  add_index "page_revisions", ["page_id"], name: "index_page_revisions_on_page_id", using: :btree
  add_index "page_revisions", ["revision_id"], name: "index_page_revisions_on_revision_id", using: :btree

  create_table "pages", force: true do |t|
    t.string   "name"
    t.string   "path"
    t.integer  "repository_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pages", ["repository_id"], name: "index_pages_on_repository_id", using: :btree

  create_table "repositories", force: true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.text     "description"
    t.string   "url"
    t.boolean  "enabled",               default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "processing",  limit: 8, default: 0
  end

  add_index "repositories", ["user_id"], name: "index_repositories_on_user_id", using: :btree

  create_table "revisions", force: true do |t|
    t.integer  "repository_id"
    t.string   "sha"
    t.integer  "order"
    t.string   "message"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "revisions", ["repository_id"], name: "index_revisions_on_repository_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "uid"
    t.string   "provider"
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
