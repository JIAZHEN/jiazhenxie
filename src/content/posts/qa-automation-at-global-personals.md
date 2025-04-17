---
title: QA Automation at Global Personals (Venntro Media Group)
description: Implementing QA automation at Global Personals
date: 2014-06-08T00:00:00.000Z
tags:
  - testing
  - qa
  - automation
  - experience
image: >-
  https://media.licdn.com/dms/image/C4D0BAQFX5kOYM92d-A/company-logo_200_200/0/1594215316549?e=2147483647&v=beta&t=lH5uMUO_KEuQS3zkniYYdc96gHXxVyn4hxrwGqjGpSI
draft: false
---

I joined Global Personals as a Developer in Test in September 2013. Global had successfully started an automation testing programme for a year before I joined. During the last eleven months, we've made quite a lot of further improvements to our framework as well as massively increasing our test library. So here I would like to review what we have achieved and what I have learnt about automation.

## Framework
We use Ruby to develop the automation scripts, just like many of our applications. Therefore we use RSpec as the test framework, plus Capybara and Selenium for all the web application tests.

### Page Object
Previously to reduce the duplicated code, we had created common helpers. However, after a few months more helpers were added, it caused problems that we had no idea where to find or add our helpers. After some research and discussion we decided to use The Page Object pattern to build our own DSL (domain specific language). The idea is to encapsulate the page's behaviours into the page object, which is good for maintaining automation scripts and increasing code readability. Below is an example of the login page object

```
class LoginPage
  def login_as(member)
    fill_in :memberid, with: member.email
    fill_in :password, with: member.password
    find("button[type='submit']").click
  end
end
```

Calling `login_page.login_as` in the automation scripts can log the member in and is easy and readable. It gives a clear code structure where the helpers can be found and added. Another benefit is we can now guess the methods in automation. If you would like to perform a payment with automation, try to search `payment_page`.

## Continuous Integration
As part of BDD (Behaviour Driven Development), the end-to-end automation scripts are able to guarantee the correct behaviours of our applications, no matter what changes are made in the application. With our success in writing automation scripts, naturally we moved forward to CI. By building our CI system with [Jenkins](http://jenkins-ci.org/), we can successfully run automation scripts against different environments and branches. The CI results are output in HTML on the server and can be posted to our team communication application, [Slack](https://slack.com/).

But that's not enough yet. As good testers we'd like to provide the steps to replicate the issue and the clear result of the failure, so we added the ability for automation to take screenshots when an example is failing, and attach them to the HTML. People without any knowledge of the QA Automation application can read the CI results and do not need to imagine what they look like.

![image](http://i749.photobucket.com/albums/xx136/fdf515/screenshot_zpscc2cf6d8.png)

So far we've managed to run 100+ end-to-end tests within an hour in our CI system (it's all running in one virtual machine, amazing!), and it's proven that CI is able to capture bugs in our day-to-day work.

## Stability
Since most of our automation scripts are End-to-End tests and our product has a lot of user interfaces, there are lots of web UI tests in the test suite. As a result, we experiences many intermittent issues like request timeout, page is not completely loaded, server is down etc. These reduce the confidence of our automation tests. Therefore, we need some techniques to help the driver to deal with them in order to increase the tests' stability.

To handle a timeout or element not found error, waiting is a good solution. There are two types of wait, implicit wait and explicit wait.

#### Implicit Wait
Simply using `Capybara.default_wait_time` will change the capybara implicit wait time. Capybara is smart enough to retry finding the link for a brief period of time before giving up and throwing an error. However, changing the global default wait time means automation is slowed down. Thankfully Capybara allows us to temporarily change the time by using `Capybara.using_wait_time(5) {}`.

#### Explicit Wait
As the name suggests, we tell Capybara to sleep until the element is there. The code is written similarly to `sleep 1 until page.has_css?('#targetElementID')`. This is better than implicit wait as we don't have to wait up to the default wait time when we expect not to have the content on the page. But we also need to be careful with this wait. As if the server is down, the automation will continue in an infinite loop, so we should add `Timeout::timeout(5) {}` to the loop.

## Speed Up
Last but not least, the speed of automation. In the agile process, we'll need to add more end-to-end tests to CI as a result of new features required. But we don't want to slow down the CI as in theory, a CI run should finish in an hour as it's for agile testing. We don't have unlimited budget to have thousands of VMs. Therefore we need some tools and techniques to speed it up.

The first idea is to use a headless driver. Selenium is good while developing automation so you can watch it. CI doesn't really need to open a browser. We chose [poltergeist](https://github.com/teampoltergeist/poltergeist) as the headless driver, it doesn't load the entire browser and can simulate the user activities. 

Parallel tests is another technique to speed automation up. We are using the parallel gem in the automation, it increases the overall automation speed by 20%. For instance, one of our automation scripts used to take 912 seconds without parallel, with parallel it takes only 341 seconds.

The automation run without parallel:
![image](http://i749.photobucket.com/albums/xx136/fdf515/automation-without-parallel_zps7c70b92d.png)

The automation run with parallel:
![image](http://i749.photobucket.com/albums/xx136/fdf515/automation-parallel_zpsc47c5ce3.png)


## Repeat Tests
Because we are developing with selenium driver, it's possible that some cases do not work with the poltergeist driver. In order to get the balance of speed and accuracy, we built a repeat mechanism in our automation. The automation scripts are executed concurrently with poltergeist driver, the failing examples are recorded in `rspec.failures` file (if any), then CI will use selenium to re-run just those failing examples.

## Summary
Here at Global Personals we've made great progress in test automation, it speeds up regression testing while not reducing the test confidence level, really helping software development in an agile environment. Of course there is still lots of work that can be done in automation, for example, catch the JavaScript errors on the page then send the whole error stack to the developers. We will never stop improving the automation because it's really enjoyable and helpful!
