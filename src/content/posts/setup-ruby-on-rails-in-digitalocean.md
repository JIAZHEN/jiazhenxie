---
title: Setup Ruby on Rails in DigitalOcean
description: Complete guide to deploying Ruby on Rails applications on DigitalOcean
date: 2014-08-30T00:00:00.000Z
tags:
  - ruby
  - rails
  - devops
  - deployment
image: 'https://miro.medium.com/v2/resize:fit:1400/1*zQFXeIUoRXpoS3X1VOd_PQ.png'
draft: false
---

Recently I moved the site from Heroku to DigitalOcean. As you can imagine, deployment could be difficult. Therefore I'd like to summarise the steps to deploy to DigitalOcean.

## Create a droplet with one-click Ruby on Rails Application
First of all, you need to create a droplet in DigitalOcean.

## Install git
SSH to the server then run
```
sudo apt-get install git-core
```

## Configurate codebase
```
git clone <repo_https>
chmod 755 rails
chown -R rails:www-data <repo>
```

## Deploy
1. Configure the database to point to the database
2. Install gems `bundle install --deployment`
3. Add any environmental variables to `/etc/default/unicorn`
4. Restart the server `service unicorn restart`
5. Allow remote access to the DB

      ```
      sudo nano /etc/mysql/my.cnf
      bind-address = your_database_IP
      GRANT ALL PRIVILEGES ON db.* To 'user'@'%' IDENTIFIED BY 'password';
      FLUSH PRIVILEGES;
      ```
