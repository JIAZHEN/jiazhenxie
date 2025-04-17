---
title: To initialise a Ruby on Rails app
description: Step-by-step guide to setting up a new Ruby on Rails application
date: 2013-11-17T00:00:00.000Z
tags:
  - ruby
  - rails
  - tutorial
image: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--jvDLhx0b--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/cpcr5w0kgl6j94tss7n9.png
draft: false
---

Today I'm going to summarise how to initialise a RoR. Many thanks to 
> Ruby on Rails Tutorial Learn Web Development with Rails by Michael Hartl

Here we are using `ruby 2.0` and `rails 4.0.0`

## Create RoR app
Firstly we create a new app
```
rails new sample_app --skip-test-unit
```

## Working with git
We would use github to manager our code. Create a new repository in github without README. Then do

```
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:USERNAME/APP_NAME.git
git push -u origin master
``` 

## Update Gemfile
```
source 'https://rubygems.org'
ruby '2.0.0'
#ruby-gemset=railstutorial_rails_4_0

gem 'sass-rails', '4.0.1'
gem 'bootstrap-sass', '2.3.2.2'
gem 'uglifier', '2.1.1'
gem 'coffee-rails', '4.0.1'
gem 'jquery-rails', '3.0.4'
gem 'turbolinks', '1.1.1'
gem 'jbuilder', '1.0.2'
gem 'haml', '~> 4.0.4'
gem 'will_paginate'
gem 'bootstrap-will_paginate', '~> 0.0.10'
gem 'friendly_id', '~> 5.0.0'
gem 'rails', '4.0.0'

group :development, :test do
  gem 'faker', '~> 1.2.0'
  gem 'rspec-rails', '2.13.1'
end

group :development do
  gem 'pg', '0.15.1'
end

group :test do
  gem 'selenium-webdriver', '2.35.1'
  gem 'capybara', '2.1.0'
  gem 'sqlite3', '1.3.8'
end

group :doc do
  gem 'sdoc', '0.3.20', require: false
end

group :production do
  gem 'pg', '0.15.1'
  gem 'rails_12factor', '0.0.2'
end
```

## Update secret token
Edit `config/initializers/secret_token.rb`

```
require 'securerandom'

def secure_token
  token_file = Rails.root.join('.secret')
  if File.exist?(token_file)
    # Use the existing token.
    File.read(token_file).chomp
  else
    # Generate a new token and store it in token_file.
    token = SecureRandom.hex(64)
    File.write(token_file, token)
    token
  end
end

SampleApp::Application.config.secret_key_base = secure_token
```

## Config the app
Edit `config/application.rb`

```
config.assets.precompile += %w(*.png *.jpg *.jpeg *.gif)
config.action_view.field_error_proc = Proc.new { |html_tag, instance| 
  "#{html_tag}".html_safe 
}
```

## Initialise Rspec
```
rails generate rspec:install
```

## Deploy to heroku
```
heroku create
rake assets:precompile
git add .
git commit -m "Add precompiled assets for Heroku"
git push heroku master
heroku rename XXXX
```

Then, we are done, wow~
