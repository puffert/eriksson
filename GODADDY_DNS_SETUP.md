# GoDaddy DNS Setup for vortexnode.net → GitHub Pages

## Step-by-Step Instructions

### Step 1: Configure Custom Domain in GitHub

1. Go to your repository: https://github.com/puffert/eriksson
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Custom domain**, enter: `vortexnode.net`
4. Click **Save**
5. GitHub will automatically create a `CNAME` file in your repo

**Important**: GitHub will warn you that DNS isn't configured yet - that's normal, we'll fix that next.

### Step 2: Configure DNS in GoDaddy

1. Log in to **GoDaddy.com**
2. Go to **My Products** → **Domains**
3. Click **DNS** next to `vortexnode.net`
4. You'll see the DNS management page

#### Option A: Using A Records (Recommended for root domain)

1. **Delete existing A records** if any (click the trash icon)
2. **Add 4 new A records**:
   - Click **Add** → **A Record**
   - **Name**: `@` (or leave blank)
   - **Value**: `185.199.108.153` → **TTL**: `600 seconds` → **Save**
   - **Name**: `@` (or leave blank)
   - **Value**: `185.199.109.153` → **TTL**: `600 seconds` → **Save**
   - **Name**: `@` (or leave blank)
   - **Value**: `185.199.110.153` → **TTL**: `600 seconds` → **Save**
   - **Name**: `@` (or leave blank)
   - **Value**: `185.199.111.153` → **TTL**: `600 seconds` → **Save**

#### Option B: Using CNAME (Alternative)

If A records don't work, you can use CNAME:
1. **Delete any existing @ records**
2. **Add CNAME record**:
   - **Name**: `@` (or leave blank)
   - **Value**: `puffert.github.io` → **TTL**: `600 seconds` → **Save**

**Note**: Some registrars don't allow CNAME on root domain. If GoDaddy doesn't allow it, use Option A.

### Step 3: Enable Custom Domain in GitHub Actions

1. Edit `.github/workflows/deploy.yml`
2. In the Build step, update the env section:

```yaml
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          CUSTOM_DOMAIN: 'true'  # Add this line
```

3. Commit and push the change

### Step 4: Wait for DNS Propagation

- DNS changes can take **5 minutes to 24 hours** to propagate
- Check status at: https://dnschecker.org/#A/vortexnode.net
- Enter `vortexnode.net` and check if all 4 IPs are showing

### Step 5: Verify SSL Certificate

1. Go back to GitHub: **Settings** → **Pages**
2. Check **"Enforce HTTPS"** - GitHub will automatically provision SSL
3. SSL certificate may take 10-30 minutes to be issued

## Testing Your Setup

Once DNS propagates:

1. Visit: `https://vortexnode.net` (should show your site)
2. Visit: `https://vortexnode.net/blog` (should show blog posts)
3. All links should work without `/eriksson` in the path

## Troubleshooting

### Domain not resolving?
- Wait up to 24 hours for DNS propagation
- Verify A records are correct at: https://dnschecker.org
- Clear your browser cache
- Try incognito/private browsing mode

### SSL certificate issues?
- Make sure "Enforce HTTPS" is checked in GitHub Pages settings
- Wait 10-30 minutes for SSL provisioning
- Check GitHub Pages settings for any warnings

### Still seeing GitHub Pages default page?
- Verify `CUSTOM_DOMAIN: 'true'` is set in GitHub Actions
- Check that GitHub created the `CNAME` file in your repo
- Wait for GitHub Actions to rebuild (2-3 minutes)

### Links still have /eriksson in them?
- Make sure you've pushed the workflow change with `CUSTOM_DOMAIN: 'true'`
- Wait for GitHub Actions to complete deployment
- Clear browser cache

## Quick Checklist

- [ ] Added `vortexnode.net` in GitHub Pages settings
- [ ] Added 4 A records in GoDaddy DNS (or CNAME)
- [ ] Set `CUSTOM_DOMAIN: 'true'` in `.github/workflows/deploy.yml`
- [ ] Committed and pushed the workflow change
- [ ] Waited for DNS propagation (check with dnschecker.org)
- [ ] Enabled "Enforce HTTPS" in GitHub Pages settings
- [ ] Tested the site at `https://vortexnode.net`

## Current Status

After setup:
- **Your site**: `https://vortexnode.net` ✅
- **Blog**: `https://vortexnode.net/blog` ✅
- **Old URL**: `https://puffert.github.io/eriksson` (will still work but redirects may be set up)

---

**Need help?** GitHub Pages documentation: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
