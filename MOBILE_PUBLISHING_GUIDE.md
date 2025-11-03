# 📱 Mobile Publishing Guide for Vortex Node

## Quick Start: Publishing from Your Phone

### Step 1: Open GitHub Mobile App
1. Download GitHub mobile app (iOS/Android)
2. Sign in to your account
3. Navigate to your repository: `puffert/eriksson`

### Step 2: Create a New Post
1. Go to **Issues** tab
2. Tap **New Issue**
3. Select **"📝 New Blog Post"** template
4. Fill in the form:
   - **Title**: Your post title
   - **Description**: Brief 1-2 sentence summary
   - **Category**: Choose from:
     - **Offensive Security** → Uses `offensive.png` header
     - **Learning** → Uses `AITesting.png` header
     - **News** → Uses `news.png` header
   - **Tags**: Add relevant tags (comma-separated)
   - **Icon**: Choose an emoji (optional)
   - **Content**: Write in Markdown
   - **Source URL**: Link to original (if sharing)

### Step 3: Publish
1. Submit the issue
2. Go to **Labels** and add the **"publish"** label
3. The GitHub Action will automatically:
   - Convert your issue to a blog post
   - Add the appropriate header image
   - Deploy to your site
   - Comment with the live URL
   - Close the issue

## Content Tips

### Sharing Articles from X/LinkedIn
```markdown
Found this amazing article about AI security testing!

[Original Tweet](https://x.com/...)

## Key Takeaways
- Point 1
- Point 2

## My Thoughts
This is important because...
```

### Adding Code Snippets
````markdown
Here's how to test an LLM:

```python
def test_llm_response(prompt):
    response = llm.generate(prompt)
    assert validate_output(response)
```
````

### Including Images
```markdown
![Description](https://image-url.com/image.jpg)
```

## Categories & Auto-Headers

| Category | Header Image | Use For |
|----------|-------------|---------|
| Offensive Security | offensive.png | Red team, pentesting, exploits, attack techniques |
| Learning | AITesting.png | Tutorials, guides, educational content, how-tos |
| News | news.png | Latest AI/security news, updates, industry developments |

## Quick Actions

### Edit a Post
1. Find the original issue
2. Edit the issue body
3. Add label **"update"** (coming soon)

### Delete a Post
1. Manually delete the file from `src/content/blog/`
2. Or mark issue with **"delete"** label (coming soon)

## Troubleshooting

### Post Not Appearing?
- Check GitHub Actions tab for errors
- Ensure you added the **"publish"** label
- Wait 2-3 minutes for deployment

### Wrong Header Image?
- Check the category selection
- Header images are automatically assigned based on category

## Advanced: Manual Creation

If you prefer, you can also create posts manually:

1. Create a new file in `src/content/blog/your-post-name.md`
2. Add frontmatter:
```yaml
---
title: "Your Title"
description: "Brief description"
pubDate: 2024-01-20
category: "News"
icon: "📰"
image: "news.png"
tags: ["AI", "security"]
draft: false
---

Your content here...
```
3. Commit and push

## Tips for Mobile Writing

1. **Use voice-to-text** for longer posts
2. **Save drafts** as issues without the "publish" label
3. **Use simple Markdown** - the mobile editor is basic
4. **Preview** by submitting without "publish" first
5. **Quick shares**: Just paste the link and add your commentary

## URL Structure

Your posts will be available at:
```
https://puffert.github.io/eriksson/blog/[post-title-slug]
```

Example:
- Title: "New AI Security Tool Released"
- URL: `https://puffert.github.io/eriksson/blog/new-ai-security-tool-released`

---

**Need help?** Create an issue without the "publish" label to test the system!
