---
title: Eloquent Ruby Note
description: Notes from learning the book
date: 2014-03-23
tags: ["uncategorized"]
image: "https://gumtreeau-res.cloudinary.com/image/private/t_$_58/gumtree/db4d7c02-5bb2-4295-a284-3a3eee70dbf5.jpg"
draft: false
---

Notes
=====

- Use Hash if would like to search
- Cancel the new line

    ```
    yet_another = %Q{another multi-line string with 
    no newline}
    ```

- kind_of?, which will return true if the object is an instance of DocumentIdentifier or a subclass of DocumentIdentifier
- include module, inject a super class to the object
- When you tack a block onto the end of a method call, Ruby will package up the block as sort of a secret argument and (behind the scenes) passes this secret argument to the method. Inside the method you can detect whether your caller has actually passed in a block with the block_given? method and fire off the block (if there is one) with yield

    ```
    def each_word
      words.each { |word| yield( word ) }
    end
    ```

- Enumerable also contributes the `each_cons` method to your class. The `each_cons` method takes an integer and a block, and will repeatedly call the block, each time passing in an array of consecutive elements from the collection.

- Benefits for block: execute around

    ```
    def with_logging(description)
      begin
        @logger.debug( "Starting #{description}" )
        yield
        @logger.debug( "Completed #{description}" )
      rescue
        @logger.error( "#{description} failed!!")
        raise
      end
    end 
    ```

- Code blocks drag along the scope in which they were created wherever they go. In the last example, this means that @doc object is automatically visible inside the code block?no need to pass it down as an argument.

- Proc vs. Lambda
  1. Proc.new object is very forgiving of the number of arguments passed to its call method.
  2. a Proc.new block executes an explicit return, Ruby will try to return not just from the block but from the method that created the block. While a return from a lambda wrapped block will simply return from the block and no further

- inherited, will get called just after each subclass is define

    ```
    def self.included( host_class )
      host_class.extend( ClassMethods )
    end
    ```

- at_exit is last in / first out
- $! is a global variable that Ruby sets to the last exception raised
- If you have many different ways that you might create an object, a set of wellnamed class methods is generally clearer than making the user supply all sorts of clever arguments to the new method
- Including modules into the singleton class is a common enough task that Ruby has a
special shortcut for it in the form of extend

    ```
    class Document
      extend Finders
      # Most of the class omitted...
    end
    ```

- Execute around with a block. All of the variables that are visible just before the opening do or `{` are still visible inside the code block.
- A good rule of thumb is that the only arguments you should pass from the application into an execute around method are those that the execute around method itself, not the block.
- Compose methods

    ```
    class TextCompressor
      attr_reader :unique, :index
      def initialize( text )
        @unique = []
        @index = []
        add_text( text )
      end

      def add_text( text )
        words = text.split
        words.each { |word| add_word( word ) }
      end

      def add_word( word )
        i = unique_index_of( word ) || add_unique_word( word )
        @index << i
      end

      def unique_index_of( word )
        @unique.index(word)
      end

      def add_unique_word( word )
        @unique << word
        unique.size - 1
      end
    end
    ```

  + First, each method should do a single thing.
  + Each method needs to operate at a single conceptual level: Simply put, don’t mix high-level logic with the nitty-gritty details.
  + Finally, each method needs to have a name that reflects its purpose.
  
- `alias_method` actually copies a method implementation, giving it a new name along the way.

    ```
    class String
      alias_method :old_addition, :+
      def +( other )
        if other.kind_of? Document
          new_content = self + other.content
          return Document.new(other.title, other.author, new_content)
        end
        old_addition(other)
      end
    end
    ```
- `__FILE__` is supplied via the magic of Ruby and is always set to the path of the source file of the current class
- the `class_eval` method takes a string and evaluates it as if it were code that
appeared in the class body
- Pass `instance_eval` a block and, just like call, it will execute the block. The difference is that instance_eval changes the value of self as it executes the block. `self` is the receiver of the block