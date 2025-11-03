# GitHub Pages Setup Troubleshooting

## Current Status Check

If you're getting a 404 error, verify these steps:

### ✅ Step 1: Repository is Public
- Go to https://github.com/puffert/eriksson/settings
- Scroll to the bottom → "Danger Zone"
- Make sure repository is set to **Public** (required for free GitHub Pages)

### ✅ Step 2: GitHub Pages is Enabled
1. Go to: https://github.com/puffert/eriksson/settings/pages
2. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**
4. You should see a green checkmark and a URL

### ✅ Step 3: Wait for Deployment
- After enabling, wait **5-10 minutes** for the first deployment
- Check the "Pages" section - it should show "Your site is published at..."

### ✅ Step 4: Correct URL
Your site should be at:
- **https://puffert.github.io/eriksson/** (with trailing slash)

### ✅ Step 5: Clear Browser Cache
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or try in incognito/private mode

## Common Issues

### Issue: "Page build failed"
- Make sure `index.html` is in the root directory (✅ it is)
- Check for any special characters in filenames

### Issue: "404 Not Found"
- Verify repository is **Public**
- Wait 5-10 minutes after enabling Pages
- Check the URL includes the repository name: `/eriksson/`
- Make sure you're using `https://` not `http://`

### Issue: Site shows but is blank
- Check browser console for errors (F12)
- Verify CSS and JS files are loading
- All files should be in root directory

## Quick Verification Commands

Check your files are pushed:
```bash
git ls-files
```

Verify remote:
```bash
git remote -v
```

## Still Not Working?

1. **Check Actions Tab**: https://github.com/puffert/eriksson/actions
   - If you see failed workflows, they should be removed now

2. **Check Pages Settings**: https://github.com/puffert/eriksson/settings/pages
   - Should show green checkmark
   - Should display your site URL

3. **Verify Files on GitHub**:
   - Go to: https://github.com/puffert/eriksson
   - You should see: `index.html`, `styles.css`, `script.js`, `README.md`
   - Click on `index.html` to verify it exists

4. **Try alternative URL format**:
   - `https://puffert.github.io/eriksson/index.html`
   - If this works, there's a routing issue with the root

## Contact GitHub Support

If none of the above works, the issue might be:
- Account restrictions
- Repository permissions
- GitHub Pages service status

Check GitHub Status: https://www.githubstatus.com/

