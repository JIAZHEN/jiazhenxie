---
title: Automation Test with Rspec and Capybara
description: Automated testing with RSpec and Capybara
date: 2013-10-14T00:00:00.000Z
tags:
  - testing
  - automation
  - rspec
  - capybara
image: >-
  https://blog.testproject.io/wp-content/uploads/2021/01/Test-your-Ruby-waters-with-Capybara.jpg
draft: false
---

Today I completed a refactoring task for our existing automation test repository. Briefly, we have a site creator which has a seven-step wizard.

I wrote a spec for the site creator which will finish each step automatically as well as experiment the wizard. There are several tricky things for this task. I will summarise them as below.

#### Test each step independently
There are seven steps for the site creator wizard. Normally user will finish step by step. However, as for testing, we need to make sure each test (`example` for Rspec) is independent. That means if Rspec run my `site_creator_spec`, the tests can be ran randomly.

#### DRY the codes
Above we are saying testings for steps must be independent. But due to the nature of wizard, we need to finish the previous steps before testing steps in the middle. That means, if want to test step 3, we need to finish step 1 and 2; to test step 6, step 1, 2, 3, 4, 5 must be finished.

So obviously there are plenty of places we could make redundancy. What I have done is to finish my own code, regardless how dirty, duplicate it is. Then I did `DRY`. The result is that I make my codes extremely clear and readable.

#### Randomly pick element
There are many radios on the site creator. One way is to write test cases for each of them. But it's a bit waste of time and duplicate. Instead, we can store all radios in an array, then randomly pick one.

It's Monday but I still feel good, as I have finished my work properly. The more exciting is that I can keep practicing my Ruby skills.

I am not just QA, I am a **Developer in QA** ;-)
