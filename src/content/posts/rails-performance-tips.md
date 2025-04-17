---
title: Rails performance tips
description: Essential performance optimization tips for Ruby on Rails applications
date: 2016-11-24T00:00:00.000Z
tags:
  - ruby
  - rails
  - performance
  - optimization
image: >-
  https://thecodest.co/images/uploaded/ways_to_increase_your_rails_performance.png
draft: false
---

> Remember, Ruby takes a large memory footprint. So, for example, to process 1G of data you might need 3G and more of memory.

- When use `model.all`, rethink, is it good to load everything in memory? What if the table gets bigger and bigger.
- MongoDB `aggregate pipeline`.
- Use `activerecord::transaction` when creating lots of rows. It's not only protect data conformity but also perform batch actions.
- Has_many relation, use `user.store_ids` is faster than `user.stores.map(&:id)`
- See if be able to use `model.find_each`
- After use `File.new`, remember to `file.close`


# ActiveRecord
> If you have a 1G of data in the table, ActiveRecord representation of it will take 2G and, in some cases, more.

- Bulk update

	```
  Book.where('title LIKE ?', '%Rails%').update_all(author: 'David')
	```
  
# Unicorn
- To turn on application preloading, simply include this line into your unicorn configuration file:

	```
  preload_app true
	```
- Ruby allocates memory in two heaps. All Ruby objects go to Ruby's own heap. Each object has 40 bytes (on a 64-bit system) to store its data. When object needs to store more, it will allocate space in operating system's heap. When object is garbage collected and then freed, the space in the operating system's heap goes back to the operating system of course. But the space reserved for the object itself in Ruby heap is simply marked as free. *This means that Ruby heap can only grow.*
- Limit memory in unicorn
			
      ```
      class Unicorn::HttpServer
       KIND_MEMORY_LIMIT_RSS = 150 #MB

       alias process_client_orig process_client
       undef_method :process_client
       def process_client(client)
        process_client_orig(client)
        rss = `ps -o rss= -p #{Process.pid}`.chomp.to_i / 1024
        exit if rss > KIND_MEMORY_LIMIT_RSS
       end
      end
      ```
