# Jiazhen Xie's Personal Website

A personal website for Jiazhen Xie, built with React, Vite, and Tailwind CSS. This website features a blog, projects showcase, and information about my professional journey.

## Features

- 🎨 Modern, responsive design with dark mode support
- 📝 Blog with markdown support
- 🚀 Fast performance with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Mobile responsive

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JIAZHEN/jiazhenxie.git
   cd jiazhenxie
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Adding a New Blog Post

1. Create a new markdown file in the `src/content/posts` directory with the following format:

   ```markdown
   ---
   title: "Your Blog Post Title"
   description: "A brief description of your post"
   date: "YYYY-MM-DD"
   tags: ["tag1", "tag2"]
   image: "/path/to/your/image.jpg"
   draft: false
   ---

   Your blog post content here...
   ```

2. The frontmatter should include:

   - `title`: The title of your blog post
   - `description`: A brief description of the post
   - `date`: Publication date in YYYY-MM-DD format
   - `tags`: Array of tags for the post
   - `image`: Path to the featured image
   - `draft`: Set to `true` if the post is not ready to be published

3. Write your content using Markdown syntax:

   - Use `#` for headings
   - Use `**` for bold text
   - Use `*` for italic text
   - Use `-` or `*` for lists
   - Use `[text](url)` for links
   - Use `![alt text](image-url)` for images
   - Use `> ` for blockquotes
   - Use `\`\`\`language` for code blocks

4. Save the file with a descriptive name using kebab-case (e.g., `my-new-blog-post.md`)

5. The post will automatically appear in your blog list, sorted by date

## Building for Production

```bash
npm run build
```

## Deployment

The site can be deployed to platforms like Vercel or Netlify. The build output will be in the `dist` directory.

```bash
npm run deploy
```

This will deploy the site to the `gh-pages` branch of the repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Payday to Pension

The UK pension calculator lives at `/payday-to-pension`, with an entry in the desktop and mobile navigation. It is loaded separately from the main pages. The build generates a dedicated HTML entry for GitHub Pages direct visits.

- UI: `src/pension/`; pure calculation functions: `src/calc/`.
- Inputs stay in localStorage; sharing encodes them in the URL fragment.
- Rates and assumptions: `src/uk-constants.ts`. See `PENSION-CHECKLIST.md` for the inherited pre-launch verification checklist.
- Imported from `wealth-chaos`; no backend or additional runtime dependencies.

Run `npm run dev` and open `/payday-to-pension`, or `npm run build` for the production output.

### Pension article and visual checks

`npm run build` generates the article charts from the same pension model as the interactive example. The pension article gets full visible HTML in its static entry, including chart images and tool links. `npm run check:pension` validates the built article metadata, schema, assets, sitemap and illustrative amounts. Charts use a fixed, labelled example dated 22 October 2026.
