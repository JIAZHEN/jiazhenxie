---
title: Codewar Notes
description: Notes and solutions from CodeWars programming challenges
date: 2013-12-07T00:00:00.000Z
tags:
  - programming
  - learning
  - algorithms
image: 'https://www.codewars.com/packs/assets/og-image.7f5134fb.png'
draft: false
---

- sorts an array of hashes passed in by the hash key specified
    
    ```
    array.sort_by { |h| h[key] }
    ```

- takes an array of keys and a default value and returns a hash with all keys set to the default value
    
    ```
    Hash[keys.map { |key| [key, default_value] }]
    ```

- sorts the passed in array of numbers. If the function passes in an empty array or null/nil value then it should return an empty array
    
    ```
    Array(nums).sort
    ```

- return true if all elements in the array meet conditions
    
    ```
    data.select { |row| row[:sex] == sex }.all? { |row| row[:age] > age }
    ```

- count the number of 1s in a string
    
    ```
    n.to_s(2).count "1"
    ```

- contain all

    ```
    class Array
      def contains_all?(other_array)
        (other_array - self).size == 0
      end
    end
    ```

- Matrix Addtion

    ```
    def matrixAddition(a, b)
      a.zip(b).map{|x,y| x.zip(y).map{|w,z| w+z}}
    end
    ```

- block

    Extend the Array class so that it supports an "invoke" instance method. The method will be called when someone wishes to execute/invoke a method on each of the items in the array.

    For example, if you wanted to call the "update" method with two arguments on all non-nil objects within an array called "items":

    ```
    # contrived class example used to provide a method that we could call
    class ExampleItem
      # notice that this method always returns "updated"
      def update(arg1, arg2)
        @arg1 = arg1
        @arg2 = arg2
        "updated"
       end
    end
    items = [ExampleItem.new, nil, ExampleItem.new]

    update_results = items.invoke(:update, "argument 1", "argument 2") {|item| item != nil}
    # update_result would == ['updated', 'updated']
    ```

    solution

    ```
    class Array
      def invoke(name, *args, &block)
        self.select(&block).map { |e| e.send(name.to_sym, *args)}
      end
    end
    ```

- Email Regex

    ```
    email_regex = /A[w+-.]+@[a-zd-.]+.[a-z]+z/i
    !!(email =~ email_regex)
    ```
    - Split uppercase
    ```
    s.split /(?=[A-Z])/
    ```

- Uncapitalize

    ```
    class String
      def uncapitalize 
        self[0, 1].downcase + self[1..-1]
      end
    end

    str.split(/-|_/) - split by '-' or '_'
    ```
- Fluent Calculator

    ```
      class Calc
        ACCEPTED_METHODS = { 
          one:'1', two:'2',   three:'3',  four:'4', five:'5',
          six:'6', seven:'7', eight:'8',  nine:'9', ten:'10',
          plus:'+', minus:'-', times:'*', divided_by:'/'
        }
        
        def method_missing(name)
          @calc_string = "#{@calc_string} #{ACCEPTED_METHODS[name]}".strip
          @calc_string.split.size == 3 ? eval(@calc_string) : self
        end
      end
    ```
- Hash#fetch
  * `fetch(key_name)`: get the value if the key exists, raise a KeyError if it doesn't
  * `fetch(key_name, default_value)`: get the value if the key exists, return default_value otherwise
  * `fetch(key_name) { |key| "default" }`: get the value if the key exists, otherwise run the supplied 

- Array#pack, Array#unpack

    ```
    module Converter
      def self.to_ascii(hex)
        [hex].pack("H*")
      end

      def self.to_hex(ascii)
        ascii.unpack("H*").first
      end
    end
    ```
- Overlape scan

    ```
    def search_substr( fullText, searchText, allowOverlap = true )
      if searchText == ''
        0
      else
        fullText.scan(allowOverlap ? Regexp.new("(?=(#{searchText}))") : searchText).size
      end
    end
    ```
