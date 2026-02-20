# ⚡ Quick Start Deployment Guide

## 🎯 Goal: Deploy MVP in 2 Hours

This guide will help you deploy a working MVP of Storyboard AI to the internet as quickly as possible.

---

## Prerequisites (15 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Create new project (wait 2-3 minutes for setup)
4. Go to **Settings → API**
5. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

6. Go to **SQL Editor** and run:
```sql
-- Copy entire content from apps/api/supabase/schema.sql
```

### 2. Get AI API Keys (Optional for testing)
- **Replicate**: https://replicate.com/account/api-tokens (or skip for now)
- **OpenAI**: https://platform.openai.com/api-keys (or skip for now)

---

## Step 1: Prepare Your Code (10 minutes)

### Update Environment Variables
Create `.env.local` in the root directory:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services (OPTIONAL - can add later)
REPLICATE_API_KEY=r8_test_key
OPENAI_API_KEY=sk-test_key

# Redis (LOCAL DEVELOPMENT)
REDIS_URL=redis://localhost:6379

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
JWT_SECRET=dev-secret-key-change-for-production-min-32-chars
```

### Test Locally
```bash
# Install dependencies
npm install

# Build (verify no errors)
npm run build

# Start servers
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- API Health: http://localhost:4000/health

---

## Step 2: Deploy Frontend to Vercel (20 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/storyboard-ai.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `storyboard-ai` repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000  # Will update later
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

6. Click "Deploy"

**Your frontend is now live!** 🎉

---

## Step 3: Deploy API to Render (30 minutes)

### 1. Create Render Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: storyboard-api
   - **Root Directory**: `apps/api`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: Free or Basic ($7/mo)

### 2. Add Environment Variables
```
NODE_ENV=production
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379  # Will add Redis later
JWT_SECRET=generate-random-32-characters-here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

### 3. Deploy
- Click "Create Web Service"
- Wait for deployment (3-5 minutes)
- Copy your API URL (e.g., `https://storyboard-api.onrender.com`)

**Your API is now live!** 🚀

---

## Step 4: Connect Everything (10 minutes)

### Update Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update:
```
NEXT_PUBLIC_API_URL=https://storyboard-api.onrender.com
```
3. Click "Save"
4. Redeploy (go to Deployments → click menu → "Redeploy")

### Test the Integration
1. Visit your Vercel URL
2. Try to sign up
3. Check if user is created in Supabase (Table Editor → users)

---

## Step 5: Add Redis (Optional - 15 minutes)

### Option 1: Upstash (Easiest)
1. Go to https://upstash.com
2. Create free Redis database
3. Copy the `UPSTASH_REDIS_REST_URL`
4. Update Render API environment variable:
```
REDIS_URL=your-upstash-url
```

### Option 2: Redis Cloud
1. Go to https://redis.com/cloud
2. Create free Redis database
3. Copy connection URL
4. Update Render API:
```
REDIS_URL=redis://...
```

---

## Step 6: Add AI Generation (Optional - 15 minutes)

### 1. Add Replicate API Key
1. Go to https://replicate.com/account/api-tokens
2. Create API key
3. Add to Render API environment variables:
```
REPLICATE_API_KEY=r8_your-key
```

### 2. Add OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create API key
3. Add to Render API:
```
OPENAI_API_KEY=sk-your-key
```

### 3. Deploy AI Workers (Optional)
For now, AI generation can run locally or be integrated into the API service.

---

## Step 7: Add Custom Domain (Optional - 20 minutes)

### 1. Buy Domain
- Namecheap, GoDaddy, or any registrar
- Cost: ~$10-15/year

### 2. Configure DNS in Vercel
1. Go to Vercel → Project → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Add DNS records at your registrar:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Configure API Domain (Render)
1. Go to Render → Your Service → Settings
2. Add custom domain: `api.yourdomain.com`
3. Add CNAME record:
```
Type: CNAME
Name: api
Value: your-app.onrender.com
```

---

## ✅ Final Checklist

- [ ] Frontend deployed to Vercel
- [ ] API deployed to Render
- [ ] Supabase project created & schema migrated
- [ ] Environment variables configured
- [ ] User signup works
- [ ] User login works
- [ ] Can create projects
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

### Frontend shows 404
- Check that Root Directory is set to `apps/web` in Vercel
- Redeploy after pushing new code

### API returns 500 error
- Check Render logs for errors
- Verify all environment variables are set
- Ensure Supabase migration was run

### CORS errors
- Update `CORS_ORIGIN` in Render to match your Vercel URL
- Redeploy API

### Can't sign up
- Check Supabase project is active
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check RLS policies in Supabase

---

## 📈 Next Steps After MVP

1. **Add Payment Processing** (Stripe)
2. **Deploy AI Workers** (Modal or RunPod)
3. **Set up Monitoring** (Sentry, LogRocket)
4. **Add Email Notifications** (Resend, SendGrid)
5. **Implement Analytics** (Google Analytics, Mixpanel)
6. **Create Landing Page** (optimize for conversions)
7. **Add Social Login** (Google, GitHub via Supabase)
8. **Optimize Performance** (caching, CDN)

---

## 💰 Initial Costs

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | **Free** |
| Render | Free | **Free** (or $7/mo for Basic) |
| Supabase | Free | **Free** (up to 500MB) |
| Upstash Redis | Free | **Free** (10K commands/day) |
| **Total** | | **$0-7/month** |

---

## 🎉 Congratulations!

Your Storyboard AI MVP is now live on the internet! 🚀

**Share your launch:**
- Twitter: @yourhandle
- Product Hunt: Submit for launch
- Indie Hackers: Share your journey

---

**Need Help?**
- Documentation: See `DEPLOYMENT_PLAN.md` for detailed guide
- Issues: Check GitHub Issues
- Email: support@storyboardai.com

**Last Updated**: February 20, 2026
