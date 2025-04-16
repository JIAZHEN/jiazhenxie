---
title: Using Yarn with Rails
description: "As the rise of Javascript ecosystem, Javascript libraries are needed for better user experience. This article uses Yarn to get a better JS libraries management."
date: 2016-11-17
tags: ["uncategorized"]
image: "https://images.ctfassets.net/1qj7i7j2q7hx/3ODwerz6BHAXQmGsCJjNLm/5c2dac6e099d4586404956a901f6ddde/1_p9SEAYl2BT71uInsGmhgLA.png"
draft: false
---

# Background
As the rise of Javascript, it's undeniable that we would need to use Javascript libraries to get better user experiences on the web application. In Rails, however, adding a Javascript library is not as smoonth as adding a gem. 

You could download the javascript library and manually put it in `vendor`. However, the responsiblities of configurations and correcting font paths are on you. Or maybe rely on a relavant gem if luckily find it. But what if the gem is no longer maintained?

Look at Javascript ecosystem, [npm](https://www.npmjs.com/), [bower](https://bower.io/) and the most recent - [yarn](https://yarnpkg.com/), they are meant to manage Javascript libraries, so why don't we use one of them?

# Install Yarn
I decided to use Yarn in which is a fascinating package manament tool as introduced in my [previous post](https://sheerdevelopment.com/posts/facebook-js-5). So firstly we need to install Yarn. With MacOS just install it with brew
```
brew update
brew install yarn
```

And add `export PATH="$PATH:$HOME/.yarn/bin"` to your profile (this may be in your `.profile`, `.bashrc`, `.zshrc`, etc.)

Test that Yarn is installed by running:
```
yarn --version
# 0.16.1
```

# Initialise a Rails project
First of all, initialise a new Rails project, run:
```
rails new yarn-with-rails
cd yarn-with-rails
```

And create a test page
```
rails g controller static_pages show
rails s
```

You should be able to see the test page on [http://localhost:3000/static_pages/show](http://localhost:3000/static_pages/show) as below

![StaticShow](/assets/images/posts/8vi2Waz.png)

Next to initialise yarn
```
yarn init
```

OK, it's time to do the actual experiment.

# Rails with Yarn
I will use [FontAwesome](http://fontawesome.io/) for this experiment. Run:
```
yarn add font-awesome --modules-folder ./vendor/assets/components/
```

The latest font-awesome library is now installed in the Rails project! Add the following to `config/initializers/assets.rb`:

```
Rails.application.config.assets.paths << Rails.root.join("vendor", "assets", "components")
```

Rename `app/assets/stylesheets/application.css` to `app/assets/stylesheets/application.scss` and change the contents to the following:
```
/*
 * This is a manifest file that'll be compiled into application.css, which will include all the files
 * listed below.
 *
 *= require font-awesome/scss/font-awesome
 */
```

Now can use awesome icons on our test page! In `app/views/static_pages/show.html.erb`, add
```
<p>
  I <i class="fa fa-heart" aria-hidden="true"></i> Ruby
</p>
```

Restart the server and visit [http://localhost:3000/static_pages/show](http://localhost:3000/static_pages/show), font-awesome is on the page! \o/

![static page with font awesome](/assets/images/posts/GY8zWjD.png)

# Font path dependency
On development it's now perfect. However, if we deploy to production (on Heroku in my case), the icon is not showing and has issue with incorrect font path. We need to overwrite `$fa-font-path` to point to the correct path.

Create `app/assets/stylesheets/font-path-overwrite.scss` and add:
```
$fa-font-path: "font-awesome/fonts/";
```
Then change `app/assets/stylesheets/application.css`:
```

/*
 * This is a manifest file that'll be compiled into application.css, which will include all the files
 * listed below.
 *
 *= require font_path_overwrite
 *= require font-awesome/scss/font-awesome
 */
```
That's it!

# Conclusion
So now with Yarn, we can easily retrieve the appropriate Javascript libraries and manage them. The feeling is as using the right tool for the job, saving time with the most elegant way. I love Ruby, Rails is my most favourite web framework, hope this can make it better. If you have any question, feel free to comment or drop me a line.