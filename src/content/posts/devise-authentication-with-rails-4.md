---
title: Devise (authentication) with Rails 4
description: Implementing authentication with Devise in Rails 4
date: 2014-04-21T00:00:00.000Z
tags:
  - ruby
  - rails
  - authentication
  - security
image: 'https://miro.medium.com/v2/resize:fit:300/1*dsK3Tnu8MZZcFKEKgz0QCg.png'
draft: false
---

As a Ruby developer, I always want to improve my skills and keep up the pace of the technical trend. Recently I've updated this site to use Ruby 2.0 and Rails 4 (I will write another blog for the upgrade). A couple days ago I started thinking it's the time to use `proper` authentication system for this site. 

#### Situation
My current authentication system was created from scratch, which I learned from [Michael Hartl](https://www.railstutorial.org/book). It's nice, help to understand the system as for the beginner (alternatively [Zane's RoR resources](http://www.whoishostingthis.com/resources/ruby-on-rails/)). However, it's not nice for experienced rubyist, when we require agile development.

After a few researches from [Ruby Toolbox](https://www.ruby-toolbox.com/categories/rails_authentication), I decided to use devise as it's the famous authentication system.

#### Process
Here is the gem [devise](https://github.com/plataformatec/devise). I'm not gonna to repeat the *Getting started* section in their README, below will focus on my *own* experiences.

#### Initial
- Installing the gem is easy, just add `gem 'devise'` to Gemfile. 
- Then user rails generator to initialise devise modules. Run `rails generate devise:install`
- According to the guide information, would need to add `config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }` to the `config/environments/development.rb`

#### Rebuild the database
As I said before, we already have user model, users controller and sessions controller. To avoid conflict, I destroyed them before moving on. So I did

```
rails destroy model user
rails destroy controller users
rails destroy controller sessions
```

The codes should be clean now. To rebuild the database do

```
rake db:drop
rake db:create
rake db:migrate
```

*Make sure have the backup of database*

#### Create devise
OK, good to setup devise. Do `rails generate devise user`.  Then do `rake db:migrate`. Next.. Yes, we have devise setup! Visit localhost:3000/users/sign_up and should be able to create users.

if you have warning like `can't mass-assign protected attributes`, it's strong parameters error. In my case, I need to remove the `protected_attributes` gem!

#### Customise devise
We now have devise for our authentication. But the routes do not look nice. As the famous gem, devise provides all the custom configurations. We edit the `config/routes.rb`, replace `devise_for :users` by

```
devise_for :users, path: '', 
     path_names: { sign_in: "signin", sign_out: "signout", sign_up: "signup" }, 
     only: :sessions
```

We now can use localhost:3000/signin for logging in.

The views do not look good. Therefore to customise it, we do `rails g devise:views users -v sessions`. Just for login. Don't forget the edit `config.scoped_views = true` in `config/initializers/devise.rb` so that it uses the custom views.

#### BDD
After finishing these, please update the BDD tests. As a ruby developer, we always want to have tests cover the features.

#### Conclusion.
Devise is strong and easy to use gem, allowing developer to implement the authentication system in short time. This is also why I love ruby, rails ;-)
