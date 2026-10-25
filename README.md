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
- The current page keeps inputs only in page memory, with no storage, network calls or tracking.
- Rates and assumptions: `src/uk-constants.ts`. See `PENSION-CHECKLIST.md` for the inherited pre-launch verification checklist.
- Imported from `wealth-chaos`; no backend or additional runtime dependencies.

Run `npm run dev` and open `/payday-to-pension`, or `npm run build` for the production output.

### Pension article and visual checks

`npm run build` generates the article charts from the same pension model as the interactive example. The pension article gets full visible HTML in its static entry, including chart images and tool links. `npm run check:pension` validates the built article metadata, schema, assets, sitemap and illustrative amounts. Charts use a fixed, labelled example dated 22 October 2026.

### £100k decision flow

`src/pension/DecisionPage.tsx` is the primary route. It requires explicit contribution method, tax region and employer amount, plus either a confirmed annual payroll amount or a current percentage with explicit scheme basis; v1 retirement defaults never populate that flow. Labelled demos are not persisted until explicitly confirmed. Version 2 local inputs use a separate storage key. Old retirement hash links remain available in a separate disclosure.

`src/calc/decision.ts` compares a full 2026/27 year of extra gross contributions. It handles cash bonus, non-savings income, grossed-up Gift Aid and existing RAS personal/SIPP contributions. RAS band extension and Personal Allowance restoration are calculated separately from initial payment. Unsupported tax regions/income types, reduced allowances, income above £200k and contributions over the standard allowance suppress personal tax-saving results rather than silently capping contributions. The build runs numerical regression cases alongside the article visual generation.

### Cash-budget discovery

The primary control is a monthly reduction in cash, initially £200 in a labelled example. `solveCashBudget` reverses the current tax model without exceeding that budget and respects this calculator's earnings/standard-allowance boundary. RAS defaults to cash paid before extra relief; the eventual-cost alternative is explicit. Employer percentages follow the selected pay basis; confirmed annual employer amounts stay independent. Additional matching uses an explicitly entered ratio and total-employee-percent cap, and only adds matching above the current contribution. Hypothetical matching examples are clearly labelled and do not overwrite saved personal data. The £200 examples and breakdown conservation are checked during the build.

### Single-page Payday to Pension

The current route uses `DecisionPage.tsx`, `payday.html`, `payday.css` and the scoped `payday-view.js` controller. The trusted markup is checked in, with no user-provided HTML. The projection is in `src/calc/payday.ts` and reuses existing tax, NI, Child Benefit and earnings-basis functions. The source prototype is retained at `docs/prototype/payday-to-pension-prototype.html`. Run `node scripts/check-payday.js` for the default-reference and boundary cases.

The model holds tax bands constant in real terms. TODO: model the nominal freeze until 2031 by making withdrawal tax year-aware. This is straightforward in principle but requires year-specific thresholds and new boundary tests. From 2029/30 the projection limits employee and employer NI savings on extra salary sacrifice to the first £2,000 each year. The model holds that cap fixed in nominal cash in later years. The existing employee contribution is treated as net pay. Lifetime tax-free pension cash is capped at £268,275 nominal, with no allowance already used. Optional employer NI sharing adds to the pension. Childcare notes value Tax-Free Childcare only and do not affect the projection. Earlier decision-flow sections above describe retained legacy modules, not the current route.
