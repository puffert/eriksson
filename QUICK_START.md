# Quick Start Guide 🚀

Your blog is now powered by **Astro**! Here's how to use it:

## Adding a New Blog Post

1. **Create a new file** in `src/content/blog/`

   Example: `src/content/blog/my-new-post.md`

2. **Add this frontmatter** (required metadata):

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
pubDate: 2024-11-03
category: "Testing"
icon: "🧪"
tags: ["AI", "testing"]
draft: false
---
```

3. **Write your content** in Markdown below the frontmatter:

```markdown
## Introduction

Your content here! Supports:
- **Bold text**
- *Italic text*
- `Code blocks`
- Lists
- [Links](https://example.com)

### Code Example

\`\`\`python
def test_function():
    return "Hello, World!"
\`\`\`
```

4. **Save and commit** - GitHub Actions will automatically deploy!

## Post Types

### Quick Tips (Small Posts)
- Short, focused content
- Quick solutions
- Examples and snippets

### Full Articles
- Longer, comprehensive guides
- Multiple sections
- Detailed explanations
- Both use the same format!

## Development Commands

```bash
# Install dependencies (first time only)
npm install

# Start local dev server
npm run dev
# Opens at http://localhost:4321

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Important: GitHub Pages Setup

After pushing, **update GitHub Pages settings**:

1. Go to: https://github.com/puffert/eriksson/settings/pages
2. Under **"Source"**, select: **"GitHub Actions"** (NOT "Deploy from a branch")
3. Save

The GitHub Action workflow will automatically build and deploy your site!

## File Locations

- **Blog posts**: `src/content/blog/*.md`
- **Homepage**: `src/pages/index.astro`
- **Blog listing**: `src/pages/blog/index.astro`
- **Styles**: `public/styles.css`
- **Scripts**: `public/script.js`

## Example Posts

Check out the sample posts:
- `src/content/blog/quick-tip-testing-llms.md` - Quick tip example
- `src/content/blog/comprehensive-ai-testing-guide.md` - Full article example

## Need Help?

- Astro docs: https://docs.astro.build
- Content Collections: https://docs.astro.build/en/guides/content-collections/
- GitHub Actions logs: Check the "Actions" tab in your repo

---

**Ready to blog!** Just create `.md` files and write! ✨
