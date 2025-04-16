---
title: Precedence
description: An interesting issue which is hard to debug
date: 2013-10-27
tags: ["uncategorized"]
image: "https://media.geeksforgeeks.org/wp-content/uploads/20190708163349/Operators-Precedence.jpg"
draft: false
---

Today when practised Ruby, I encountered an issue about precedence.

##### Common sense
Let's start with simple exercise, the old fashion `if` statement is as below

```ruby
if a > b
  1
else
  2
end 
```
And we can also shorten to  `a > b ? 1 : 2`. Easy right? Please look at the next example.

##### Dictionary Class

```ruby
class Dictionary

  def initialize
    @entries = {}
  end

  def entries
    @entries
  end

  def add(entry)
    if entry.is_a? Hash
      @entries.merge!(entry)
    else
      @entries[entry] = nil
    end
  end

  def include?(key)
    @entries.key?(key)
  end

end
```
If we do 

```ruby
d = Dictionary.new
d.include?'nothing' ? d.entries['nothing'] : nil
```

I was expecting the result is *nil*. But it returns *false* and throws warning `string literal in condition`. What is it??

##### Investigation
In Ruby, if on a non-boolean input will check existence, the check for existence with ?? considered true; you receive a warning (warning: string literal in condition)

```ruby
> "1" ? 1 : 2
(irb): warning: string literal in condition
 => 1
```

So, d.include? is executed without 'nothing'. Then the codes become: 
`'nothing' ? d.entries['nothing'] : nil`

##### Solution
Add a bracket for 'nothing', 

```ruby
d = Dictionary.new
d.include?('nothing') ? d.entries['nothing'] : nil

 => nil 
```

Yay! So, please do remember add the bracket if using `? :` expression.