# AI Testing Labs - Astro Blog

A retro-futuristic lab-style blog about AI testing, built with Astro and optimized for GitHub Pages.

## 🚀 Features

- **Content Collections**: Write posts in Markdown
- **Retro-Futuristic Design**: 1980s terminal aesthetic with voxel art vibes
- **Fast Static Site**: Astro generates optimized HTML
- **Easy Content Management**: Just add `.md` files to create posts
- **GitHub Pages Ready**: Configured for automatic deployment

## 📝 Adding Blog Posts

### Quick Posts (Small)

Create a file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "Brief description"
pubDate: 2024-01-20
category: "Testing"
icon: "🧪"
tags: ["tag1", "tag2"]
draft: false
---

Your content here. Supports **Markdown**!
```

### Long Articles

Same format, just write more content. The layout automatically handles long-form articles.

### Post Metadata

- `title`: Post title
- `description`: Brief summary (shown on listing pages)
- `pubDate`: Publication date (YYYY-MM-DD)
- `category`: Category name
- `icon`: Optional emoji icon
- `tags`: Array of tags
- `draft`: Set to `true` to hide from published posts

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Project Structure

```
src/
  content/
    blog/           # Blog post markdown files
  layouts/
    BaseLayout.astro      # Main site layout
    BlogPost.astro        # Individual post layout
  pages/
    index.astro           # Homepage
    blog/
      index.astro        # Blog listing
      [...slug].astro     # Individual post pages
  styles.css              # Global styles
  script.js               # Interactive effects
public/                   # Static assets
```

## 🚀 Deployment

The site is configured to deploy to GitHub Pages automatically:

1. Push to `main` branch
2. GitHub Actions builds the site
3. Deploys to GitHub Pages

Or manually:

```bash
npm run build
# Copy dist/ contents to gh-pages branch
```

## 🎨 Styling

All styles are in `src/styles.css`. The retro-futuristic theme uses:
- Dark backgrounds (#050510)
- Muted neon accents (cyan, green)
- Terminal beige text (#d4d4a8)
- Pixelated fonts (Press Start 2P, VT323)

## 📚 Creating Your First Post

1. Create `src/content/blog/my-first-post.md`
2. Add frontmatter with metadata
3. Write your content in Markdown
4. Save and view at `/blog/my-first-post`

That's it! The site automatically:
- Creates the page
- Adds it to the blog listing
- Styles it with your retro theme
- Optimizes it for production

---

**Status**: [SYSTEM_ONLINE] 🟢
