hourglass
=========

Hourglass


# How to Install

On Ubuntu 14.04:

```
sudo apt-get install imagemagick libmagickwand-dev
```

Once repo has been cloned:

```
$ bundle install
$ figaro install
$ cat config/application.yml

db_username: hourglass
db_password: "This is no password."

github_client_id: "Not a client ID"
github_client_secret: "Not a client secret"

repositories_base: "~/.tmp/hourglass/"
$ rake db:create # Make the schema manually if fails
$ rake db:migrate
$ rails s
```