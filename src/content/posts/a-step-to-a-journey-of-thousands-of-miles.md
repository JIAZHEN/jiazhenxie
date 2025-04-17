---
title: A step to a journey of thousands of miles
description: Reflections on the journey of learning and growth
date: 2016-10-05T00:00:00.000Z
tags:
  - personal
  - learning
  - experience
image: >-
  https://media.istockphoto.com/id/1250921835/photo/ladder-to-success-concept-human-stick-figure-taking-first-step-on-a-red-staircase.jpg?s=612x612&w=0&k=20&c=CD3tlas__5zLST7aLd_jup_IoMWOu5gMMH7Ja5lhGCM=
draft: false
---

## The initial
I've been always thinking that a tech post should be a thing that is very profound. It should resolve a crucial programming or software engineer issue. 

But I am so wrong on that. In reality (by now), most of issues that are just normal, requiring to google and or read documentations to figure out. But I still gained lots of pleasures by resovling them. Therefore I start to record the issues that I meet and how I figure it out.

![Imgur](/assets/images/posts/KLgneIo.jpg)

## The first issue
A few weeks ago I was building a dashboard in Rails. To increase the users' happniness I implement the avatar upload function by [Paperclips](https://github.com/thoughtbot/paperclip). Parts of the code look like:
```
has_attached_file :avatar,
    :styles => { medium: "128x128#" },
    :path => ":rails_root/public/:url",
    :url  => "/avatars/:id/:style/:filename"
```

Clearly I was hoping to organise the path and url better. The issue was that default_url could be not found as the path is redefined. On production the abominated broken image will be shown.

After a few attempts to fix the url and path, but had no luck. The [default_url method](https://github.com/thoughtbot/paperclip/blob/master/lib/paperclip/url_generator.rb#L24-L32) is overall the places.

## My solution
When cannot resolve an issue in a way more than `20~30` mins, I tend to think of it from different ange. The default image is stored in the repository and Rails surely knows where it is. Why don't I just write my own "default_url" method? So the final codes are

```
def avatar_url
	current_user.avatar.present? ? current_user.avatar.url(:medium) : "avatar_missing.png"
end
```

Problem solved! :D
