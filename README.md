# AI Testing Labs - Cyberpunk Blog

A cyberpunk, vortex-inspired educational blog about AI testing, built with HTML, CSS, and JavaScript. Perfect for hosting on GitHub Pages!

## 🎨 Design Features

- **Cyberpunk Aesthetic**: Inspired by retro-futuristic voxel art with neon accents
- **Vortex Effects**: Animated vortex overlay with parallax scrolling
- **Grid Background**: Animated isometric grid pattern
- **Server Rack Lights**: Animated LED indicators (red, green, blue, yellow, orange)
- **Terminal Interface**: CRT-style terminal window with typing effects
- **Glitch Effects**: Subtle glitch animations on key elements
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Deploying to GitHub Pages

### Method 1: Using GitHub's Web Interface (Easiest)

1. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it (e.g., `ai-testing-blog` or `your-username.github.io` for a user site)
   - Make it public (required for free GitHub Pages)
   - Don't initialize with README (you already have one)

2. **Upload your files**:
   - Click "uploading an existing file"
   - Drag and drop all your files: `index.html`, `styles.css`, `script.js`, and `README.md`
   - Commit with message "Initial commit"

3. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Click Save

4. **Your site will be live at**:
   - `https://your-username.github.io/repository-name/`
   - Or `https://your-username.github.io/` if you named it `your-username.github.io`

### Method 2: Using Git Command Line

```bash
# Navigate to your project folder
cd AI_Homepage

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cyberpunk AI Testing Blog"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/your-username/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository Settings → Pages (same as Method 1, step 3).

## 📝 Customization

### Update Content

- **Blog Posts**: Edit the `.post-card` sections in `index.html`
- **About Text**: Modify the `.about-text` paragraph
- **Contact Links**: Update the `.contact-link` URLs
- **Stats Numbers**: Change `data-target` values in `.stat-number` elements

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --text-primary: #00ff41;      /* Main text color (green) */
    --text-secondary: #00d9ff;    /* Secondary text (cyan) */
    --accent-red: #ff0040;        /* Red accent */
    --accent-green: #00ff41;      /* Green accent */
    --accent-blue: #0080ff;       /* Blue accent */
    /* ... more colors ... */
}
```

### Add New Blog Posts

Copy a `.post-card` article and modify:

```html
<article class="post-card">
    <div class="post-header">
        <span class="post-date">2024.01.20</span>
        <span class="post-category">CATEGORY</span>
    </div>
    <h3 class="post-title">Your Post Title</h3>
    <p class="post-excerpt">Your post excerpt...</p>
    <a href="post-url.html" class="post-link">READ MORE →</a>
</article>
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, grid, flexbox
- **JavaScript**: Interactive effects, animations, observers
- **Google Fonts**: Orbitron (headings) & Share Tech Mono (body)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🔧 Local Development

Simply open `index.html` in your browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# Then visit http://localhost:8000
```

## 📄 License

Feel free to use this as a template for your own blog!

## 🎯 Next Steps

1. Deploy to GitHub Pages
2. Add your actual blog posts
3. Connect your social media links
4. Add a blog post template system (or keep it simple!)
5. Optional: Add a blog post detail page template

---

**Status**: [SYSTEM_ONLINE] 🟢

Built with cyberpunk vibes for AI testing education.
