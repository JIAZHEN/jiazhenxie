---
title: AbRules - My AB testing gem
description: A light weight ruby AB test library based on rules
date: 2015-09-23
tags: ["uncategorized"]
image: "https://www.codewars.com/packs/assets/og-image.7f5134fb.png"
draft: false
---

# AbRules
AbRules is a light ruby library to fulfill A/B testing.

Inspired by Split, AbRules aims to simplify the A/B testing logic, focus on providing flexible rules to generate different contents.

## Requirements
- Ruby 1.9.3 or higher

## Setup
```bash
gem install ab_rules
```

## Usage
Example: A/B testing by ID

```ruby
require "ab_rules"

AbRules.split_by_id(122, "control", "test")  #=> "control"
AbRules.split_by_id(333, "control", "test")  #=> "test"

AbRules.split_by_id(333, "control", "test") do |alternative|
  "The version is #{alternative}"
end

#=> "The version is test"
```

Example: A/B testing by rules

```ruby
require "ab_rules"

SITES = [123, 567, 999]
NETWORKS = [1, 4, 6]

rules = [
  AbRules.rule(:control) do |subjects|
    subjects[:country] == "uk"
  end,

  AbRules.rule(:test) do |subjects|
    subjects[:id] && subjects[:id].even?
  end,

  AbRules.rule(:default)
]

AbRules.split_by_rule({ country: "uk" }, rules)  #=> :control
AbRules.split_by_rule({ id: 2 }, rules)  #=> :test
AbRules.split_by_rule({}, rules) do |content|
  "Cotent is #{content}"
end
#=> "Cotent is default"
```

## Questions, Feedback
Feel free to message me on [Github](github.com/JIAZHEN/) or Twitter [@JIAZHENXIE](https://twitter.com/JIAZHENXIE) :)