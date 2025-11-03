# Custom Domain Setup for nodevortex.io

## Quick Setup

### Option 1: Enable Custom Domain (Recommended)

When you're ready to use `nodevortex.io`:

1. **Add CNAME file** (GitHub will create this automatically when you configure the domain)
   - Go to: Repository Settings → Pages → Custom domain
   - Enter: `nodevortex.io` (or `www.nodevortex.io` if you prefer)
   - GitHub will create a `CNAME` file in your repository

2. **Update GitHub Actions workflow**:
   - Edit `.github/workflows/deploy.yml`
   - In the Build step, add:
   ```yaml
   env:
     NODE_ENV: production
     CUSTOM_DOMAIN: 'true'  # Add this line
   ```

3. **Configure DNS** (at your domain registrar):
   - Add an `A` record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - OR add a `CNAME` record pointing to: `puffert.github.io`

4. **Wait for propagation** (usually 5-60 minutes)

### Option 2: Keep Both URLs Working

You can keep the GitHub Pages URL (`puffert.github.io/eriksson`) working while also setting up the custom domain. Just don't enable `CUSTOM_DOMAIN` in the workflow, and the site will work at both URLs.

## Current Configuration

- **GitHub Pages URL**: `puffert.github.io/eriksson` (uses base `/eriksson`)
- **Custom Domain**: `nodevortex.io` (uses base `/` when enabled)

## Testing Locally

To test with custom domain settings locally:

```bash
# Test with custom domain base
CUSTOM_DOMAIN=true npm run build
npm run preview
```

## Switching Between Modes

To switch between GitHub Pages and custom domain:

1. **For custom domain**: Set `CUSTOM_DOMAIN: 'true'` in `.github/workflows/deploy.yml`
2. **For GitHub Pages**: Remove or set `CUSTOM_DOMAIN: 'false'` (or don't set it)

## Important Notes

- When using custom domain, all links will work from root (`nodevortex.io/blog`)
- When using GitHub Pages, links use `/eriksson` base (`puffert.github.io/eriksson/blog`)
- The site automatically detects which mode to use based on the `CUSTOM_DOMAIN` environment variable
- You can run both simultaneously - just choose which one gets the custom domain in GitHub Pages settings

## Troubleshooting

### Links not working after switching?
- Make sure you've committed and pushed the workflow changes
- Wait for GitHub Actions to rebuild (2-3 minutes)
- Clear your browser cache

### Domain not resolving?
- Check DNS propagation: https://dnschecker.org
- Verify A/CNAME records are correct
- Wait up to 24 hours for full DNS propagation

### SSL/HTTPS issues?
- GitHub Pages automatically provides SSL certificates for custom domains
- It may take a few minutes to provision after DNS is configured
