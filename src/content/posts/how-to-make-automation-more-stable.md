---
title: How to make automation more stable
description: Strategies for creating more stable and reliable test automation
date: 2014-05-13T00:00:00.000Z
tags:
  - testing
  - automation
  - qa
  - best-practices
image: 'https://www.zibtek.com/blog/content/images/2020/03/image-14.png'
draft: false
---

Timeout, page is not completely loaded yet .. This is a really big issue in automation test. Therefore, we will need some techniques to help driver to deal with it. So we will be able to increase the tests stability.

#### Use headless driver - poltergeist
1. Add `poltergeist` to gemfile
2. Do `brew install phantomjs` in terminal (assume that using mac ox)
3. Add the following to spec_helper (resolve `Poltergeist detected another element with CSS selector`)

    ```
    require 'capybara/poltergeist'

    Capybara.register_driver :poltergeist do |app|
      options = { :js_errors => false, :timeout => 30, :window_size => [1920, 1080] }
      Capybara::Poltergeist::Driver.new(app, options)
    end

    Capybara.configure do |config|
      config.run_server = false
      config.default_driver = :poltergeist
      config.javascript_driver = :poltergeist
    end
    ```

#### Selectors
1. Capybara is using CSS by default
2. Use xpath find(:xpath, '//ul/li').text
3. In XPath the expression, // means "anywhere in the document" not "anywhere in the current context"

#### Wait
- Implicit Wait

    ```
    driver = Selenium::WebDriver.for :firefox
    driver.manage.timeouts.implicit_wait = 10 # seconds
    driver.get "http://somedomain/url_that_delays_loading"
    element = driver.find_element(:id => "some-dynamic-element")
    
    or for capybara
    config.default_wait_time = 30
   ```
- JS document state `document.readyState == "complete"`
- Explicit Wait plus ExpectedConditions

    ```
    wait = Selenium::WebDriver::Wait.new(:timeout => 3)
    wait.until { driver.find_element(:id => "cheese").displayed? }
    ```

#### Capybara visit
Occasionally I got timeout from Capybara.visit method. Someone suggested to use gem 'thin' or bundle update

http://stackoverflow.com/questions/12922029/usr-lib-ruby-1-9-1-net-protocol-rb146in-rescue-in-rbuf-fill-timeouterror

capybara visit timeout

http://shashikantjagtap.net/cucumber-capybara-poltergeist-rockstar-bdd-combo/

When visit timeout, retry in the method, catch the error. Or, detect if the page has header, retry if not

When it's complaining element can't find but it's there when do it manually, consider it hasn't visited the URL properly.
