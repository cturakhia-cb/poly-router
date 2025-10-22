# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press enter for default
   - Directory? Press enter (current directory)
   - Override settings? **N**

5. Add environment variable:
```bash
vercel env add POLYROUTER_API_KEY production
```
Then paste your API key when prompted.

6. Redeploy with environment variable:
```bash
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   - In the "Environment Variables" section, add:
     - **Name:** `POLYROUTER_API_KEY`
     - **Value:** `pk_53c93a8e27acdc1d17c0daccba8e91a1453748a9487b799f0a355b7b6aae31ba`
   - Click "Add"

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 3: Manual Vercel Setup

1. Build the project locally to verify:
```bash
npm run build
```

2. If build succeeds, deploy:
```bash
vercel --prod
```

## Post-Deployment

### Verify Deployment

After deployment, test these endpoints:

```bash
# Replace YOUR_DOMAIN with your Vercel URL
curl https://YOUR_DOMAIN/api/polyrouter/markets?limit=2
curl https://YOUR_DOMAIN/api/polyrouter/sports/games?league=nfl&limit=2
```

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables Reference

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `POLYROUTER_API_KEY` | Your PolyRouter API key | `pk_xxx...` |

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check that all dependencies are installed:
```bash
npm install
```

2. Verify environment variable is set:
```bash
vercel env ls
```

3. Check build logs in Vercel dashboard

### API Errors

If API calls fail after deployment:

1. Verify environment variable is set correctly
2. Check Vercel function logs for errors
3. Ensure API key has proper permissions

## Performance Optimization

The app is configured for optimal performance:

- ✅ Server-side API proxying (keeps key secure)
- ✅ Dynamic routes for real-time data
- ✅ Optimized for Vercel's edge network
- ✅ Automatic caching where appropriate

## Monitoring

Monitor your deployment:

1. **Vercel Analytics:** Enable in project settings
2. **Function Logs:** View in Vercel dashboard under "Functions"
3. **Performance:** Check "Speed Insights" tab

## Updating

To update your deployment after changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically rebuild and deploy.

Or with Vercel CLI:
```bash
vercel --prod
```

## Rollback

If you need to rollback to a previous deployment:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Find the working deployment
5. Click "..." → "Promote to Production"

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- PolyRouter Docs: https://docs.polyrouter.io
