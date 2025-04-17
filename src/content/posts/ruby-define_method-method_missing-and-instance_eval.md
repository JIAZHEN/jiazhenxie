---
title: 'Ruby - define_method, method_missing, and instance_eval'
description: Deep dive into Ruby's metaprogramming features
date: 2013-11-02T00:00:00.000Z
tags:
  - ruby
  - metaprogramming
  - advanced
image: >-
  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeQ1AckHtZUybCtVvIVeT_cCUqIPYjuagUsQ&usqp=CAU
draft: false
---

Ruby's define_method, method_missing, and instance_eval are always mysterious to new starter. I put effort to understand what exactly they are. Here are the notes of what I've got.

#### Define_method
`define_method` lets you create methods using a method rather than the language builtin `def`. One major benefit of this is that you can reduce the duplication inherent methods with similar definitions. For example, the following methods all pull data out of an internal hash:

```
# Without define_method:
def user;  @data[:user];  end
def email; @data[:email]; end
def food;  @data[:food];  end
```

With `define_method`, we can iterate over each method name and reduce the duplication like so:

```
# With define_method:
%w(user email food).each do |meth|
  define_method(meth) { @data[meth.to_sym] }
end
```

Very easy to maintain.

#### Method_missng
`method_missing`, it?s the feature that puts the magic in Rails?s find_by_* methods. Defining all these find_by_* methods by hand is nearly impossible as there?s a large number of combinations and they?re based on columns in the database.

##### Example
```
class MyClass
  def foo(bar)
    17
  end
 
  def do_something(what, ntimes)
    puts "Something happened!"
  end
end
```

```
class Tracer
  def initialize(obj)
    @obj = obj
  end
  def method_missing(method_name, *args)
    puts "Called #{method_name} with args: #{args * ', '}"
    @obj.send(method_name,*args)
  end
end
```

Call the method

```
myclass = MyClass.new
wrapped_class = Tracer.new(myclass)
wrapped_class.do_something("blah", 5)
wrapped_class.foo(89)
```

```
Called do_something with args: blah, 5
Something happened!
Called foo with args: 89
17
```
