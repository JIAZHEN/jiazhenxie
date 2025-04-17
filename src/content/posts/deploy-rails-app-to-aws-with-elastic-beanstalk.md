---
title: Deploy rails app to AWS with Elastic Beanstalk
description: Deploying Rails applications to AWS Elastic Beanstalk
date: 2016-10-17T00:00:00.000Z
tags:
  - ruby
  - rails
  - devops
  - aws
  - deployment
image: 'https://miro.medium.com/v2/resize:fit:1058/1*vqDloHZv9SVFtkr_0e7now.png'
draft: false
---

## What is AWS Elastic Beanstalk?
AWS Elastic Beanstalk is a cloud deployment and provisioning service that automates the process of getting applications set up on the Amazon Web Services (AWS) infrastructure. You don't pay for Elastic Beanstalk, **it's free service but you do pay for the resources it created.**

## Get startted
First thing first you need an amason AWS account, simply sign up on [Amazon AWS](https://aws.amazon.com/), it offers free tier for a year when this is written.

## Rails app
Assuming that you already have a rails app that is ready to be deployed. If not, please follow the commands below to create a sample rails app.

```
$ rails new blog
$ cd blog
$ git init && git add -A && git commit -m "Add rails scaffold"
$ rails generate scaffold post title:string body:text
$ bundle exec rake db:migrate
$ git add -A && git commit -am "Add post resource"
```

## Elastic Beanstalk Command Line Tools
Install it via Homebrew (or follow [this instruction](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html#eb_cli3-install-with-pip) for PC)
```
$ brew update
$ brew install aws-elasticbeanstalk
```

## Initialise the Elastic Beanstalk
CD into your rails app directory, then initalise the app
```
cd blog
eb init

Select a default region
3) us-west-2 : US West (Oregon)
Select an application to use
[ Create new Application ]
Enter Application Name
blog
Application blog has been created.
It appears you are using Ruby. Is this correct?
(y/n): y
Select a platform version.
1) Ruby 2.2 (Puma)
Do you want to set up SSH for your instances?
(y/n): n
```
Note: you will need setup your AWS key id and secret ID if it's the first you use Elastic Beanstalk Command Line Tools.

## Create a new environment
Run 
```
eb create blog-env:
```
It may takes a few minutes to execute.

Then set the secret key and any other environment variables
```
# for mac user
rake secret | pbcopy
eb setenv SECRET_KEY_BASE={the secret key in your clipboard}
```

## DB
```
# database.yml
production:
    <<: *default
    adapter: postgresql
    encoding: unicode
    database: <%= ENV['RDS_DB_NAME'] %>
    username: <%= ENV['RDS_USERNAME'] %>
    password: <%= ENV['RDS_PASSWORD'] %>
    host: <%= ENV['RDS_HOSTNAME'] %>
    port: <%= ENV['RDS_PORT'] %>
```
Note: Please remember to create **db.t2.micro** RDS instance only, it's only free.

Push the changes then do
```
eb deploy
```

You app is now live!

## Rerefence
1. [How to set up a Rails 4.2 app on AWS with Elastic Beanstalk and PostgreSQL](https://medium.com/@jatescher/how-to-set-up-a-rails-4-2-app-on-aws-with-elastic-beanstalk-and-postgresql-3f9f29c046e2#.fbvysqycv)
