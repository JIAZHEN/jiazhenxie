---
title: "Introduction to Tailwind CSS"
date: "2024-03-25"
description: "Learn how to quickly build beautiful interfaces with Tailwind CSS utility classes"
tags: ["css", "tailwind", "web development"]
---

# Introduction to Tailwind CSS

Tailwind CSS is a utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center` and `rotate-90` that can be composed to build any design, directly in your markup.

## Why Tailwind?

Unlike other CSS frameworks that provide pre-designed components, Tailwind gives you low-level utility classes that let you build completely custom designs without ever leaving your HTML.

## Key Features

- **Utility-First:** Build complex components from utility classes
- **Responsive Design:** Built-in responsive modifiers
- **Dark Mode:** Simple dark mode support
- **Customization:** Easily customize colors, spacing, and more
- **Just-in-Time Compiler:** Generate CSS on-demand for better performance

## Getting Started

To install Tailwind CSS, you can use npm or yarn:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then configure your template paths in `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Basic Example

Here's a simple card component built using Tailwind:

```html
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" />
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span
      class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >#photography</span
    >
    <span
      class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >#travel</span
    >
    <span
      class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >#winter</span
    >
  </div>
</div>
```

## Next Steps

After getting comfortable with the basics, you might want to explore:

- Creating custom themes
- Adding your own plugins
- Using Tailwind with a component framework like React or Vue
- Creating responsive designs

Happy styling with Tailwind CSS!
