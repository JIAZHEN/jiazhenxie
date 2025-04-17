---
title: Add the ability to forward email in MailCatcher
description: Extending MailCatcher with email forwarding capabilities
date: 2013-10-24T00:00:00.000Z
tags:
  - ruby
  - rails
  - testing
  - tools
image: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--jvDLhx0b--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/cpcr5w0kgl6j94tss7n9.png
draft: false
---

Haven't updated the blog for a few days. It is very busy these days, in the [Agile software development](http://en.wikipedia.org/wiki/Agile_software_development). It's very good software development process. The good thing is everyone is very involved. We all want to be valuable for the team.

OK, let's get into the topic. **Add the ability to forward email in MailCatcher**

### MailCatcher
This is the [github repository](https://github.com/sj26/mailcatcher).

### Running from the source code
We now have the source code. The next step is to edit the source code and test it locally. As we will see the source code, it's suppose to execute as a gem. So we will need to pack it as a gem and install it

```
gem build mailcatcher.gemspec
gem install mailcatcher-0.5.12.gem
```

Then run `mailcatcher` in the terminal to start it, now, visit `localhost:1080`, MailCatcher is there!

### The key points
- `not windows?` is definitely needed, otherwise in windows we will get exception.
- in `application.js`, it uses ajax to send a request to `/messages/:id/:recipient/deliver`
- the request will be handled in `web.rb`
- `web.rb` is called `DeliveryService`
