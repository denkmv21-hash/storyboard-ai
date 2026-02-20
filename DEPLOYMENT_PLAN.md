# 🚀 Storyboard AI — Deployment Plan

## 📊 Current Project Status

### ✅ Completed & Working
- **Build System**: TurboRepo monorepo configured
- **Frontend (Next.js)**: ✅ Build passes, server runs on port 3000
- **Backend API (Express)**: ✅ Build passes, server runs on port 4000
- **Authentication**: ✅ Local auth working (signup/login tested)
- **Database Schema**: ✅ Supabase SQL schema ready
- **TypeScript**: ✅ All projects compile without errors

### ⚠️ Requires Configuration
- **Supabase**: Need real project setup
- **Redis**: Required for production queues
- **AI Services**: Replicate & OpenAI API keys needed
- **Stripe**: Payment processing setup required
- **Domain & SSL**: Production domains needed

---

## 📋 Deployment Checklist

### Phase 1: Infrastructure Setup (Week 1)

#### 1.1 Database & Authentication (Supabase)
- [ ] Create Supabase project at https://supabase.com
- [ ] Run SQL migration (`apps/api/supabase/schema.sql`)
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up Storage buckets (scripts, images, exports)
- [ ] Get credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Estimated Time**: 1-2 hours  
**Cost**: Free tier available

#### 1.2 Redis Setup
**Option A: Redis Cloud (Recommended)**
- [ ] Create account at https://redis.com/cloud
- [ ] Create free Redis database
- [ ] Get connection URL: `REDIS_URL`

**Option B: Upstash (Serverless)**
- [ ] Create account at https://upstash.com
- [ ] Create Redis database
- [ ] Get REST URL and token

**Estimated Time**: 30 minutes  
**Cost**: Free tier available

#### 1.3 AI Services
- [ ] **Replicate API** (Image Generation)
  - Create account at https://replicate.com
  - Get API key: `REPLICATE_API_KEY`
  - Add payment method (pay-per-use)

- [ ] **OpenAI API** (Prompt Enhancement)
  - Create account at https://platform.openai.com
  - Get API key: `OPENAI_API_KEY`
  - Add credits ($5 minimum)

**Estimated Time**: 1 hour  
**Cost**: Pay-per-use (~$0.01-0.05 per image)

#### 1.4 Payment Processing (Stripe)
- [ ] Create Stripe account at https://stripe.com
- [ ] Get test keys first:
  - `STRIPE_SECRET_KEY` (sk_test_...)
  - `STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- [ ] Create products & prices for subscription tiers
- [ ] Set up webhook endpoint
- [ ] Get webhook secret: `STRIPE_WEBHOOK_SECRET`

**Estimated Time**: 2-3 hours  
**Cost**: 2.9% + $0.30 per transaction

---

### Phase 2: Frontend Deployment (Vercel)

#### 2.1 Vercel Setup
- [ ] Create Vercel account at https://vercel.com
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Connect GitHub repository
- [ ] Configure project:
  - Framework Preset: Next.js
  - Root Directory: `apps/web`
  - Build Command: `npm run build`
  - Output Directory: `.next`

#### 2.2 Environment Variables (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### 2.3 Deploy
```bash
cd apps/web
vercel --prod
```

**Estimated Time**: 1 hour  
**Cost**: Free tier available

---

### Phase 3: Backend API Deployment

#### Option A: Render (Recommended)

##### 3.1 Render Setup
- [ ] Create account at https://render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure:
  - Root Directory: `apps/api`
  - Build Command: `npm install && npm run build`
  - Start Command: `node dist/index.js`
  - Environment: Node

##### 3.2 Environment Variables (Render)
```env
NODE_ENV=production
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
REDIS_URL=
JWT_SECRET=<generate-secure-random-32-chars>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

##### 3.3 Database Migration
```bash
# Run once after first deployment
curl -X POST https://your-api.onrender.com/api/db/migrate
```

**Estimated Time**: 2 hours  
**Cost**: $7-15/month (Basic plan)

#### Option B: Railway

##### 3.1 Railway Setup
- [ ] Create account at https://railway.app
- [ ] Create new project from GitHub
- [ ] Add PostgreSQL (Supabase already handles this)
- [ ] Deploy API service

**Estimated Time**: 1.5 hours  
**Cost**: $5-10/month

#### Option C: Docker + VPS (Advanced)

##### 3.1 Deploy with Docker Compose
```bash
# On VPS (DigitalOcean, Hetzner, etc.)
docker-compose up -d
```

**Estimated Time**: 3-4 hours  
**Cost**: $5-20/month (VPS)

---

### Phase 4: AI Workers Deployment

#### Option A: Modal (Recommended for GPU)

##### 4.1 Modal Setup
- [ ] Create account at https://modal.com
- [ ] Install Modal CLI: `pip install modal`
- [ ] Authenticate: `modal token new`
- [ ] Create `apps/workers/src/modal_app.py`
- [ ] Deploy:
```bash
cd apps/workers
modal deploy src/modal_app.py
```

**Estimated Time**: 2 hours  
**Cost**: Pay-per-use (~$0.0003/second for GPU)

#### Option B: RunPod / Vast.ai

- [ ] Create account
- [ ] Deploy Python container with GPU
- [ ] Expose FastAPI endpoint

**Estimated Time**: 3 hours  
**Cost**: $0.20-0.50/hour (GPU rental)

#### Option C: Keep Local (Development)

- [ ] Run workers locally
- [ ] Expose via ngrok for testing
- [ ] Connect to production Redis

**Estimated Time**: 1 hour  
**Cost**: Free (local) or $10/month (ngrok)

---

### Phase 5: Domain & SSL

#### 5.1 Domain Registration
- [ ] Purchase domain (Namecheap, GoDaddy, etc.)
- [ ] Recommended domains:
  - `storyboardai.com` (if available)
  - `getstoryboard.ai`
  - `storyboard.app`

**Estimated Cost**: $10-50/year

#### 5.2 DNS Configuration
```
# Root domain
@  A     76.76.21.21 (Vercel IP)

# API subdomain
api CNAME your-app.onrender.com

# WWW
www CNAME cname.vercel-dns.com
```

#### 5.3 SSL Certificates
- ✅ Vercel: Automatic HTTPS
- ✅ Render: Automatic HTTPS
- ✅ Let's Encrypt for VPS

**Estimated Time**: 1 hour  
**Cost**: Free (Let's Encrypt) or included

---

### Phase 6: Production Configuration

#### 6.1 Update Environment Variables

**Frontend (.env.production)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Backend (.env.production)**
```env
NODE_ENV=production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REDIS_URL=redis://...
JWT_SECRET=<secure-random-64-chars>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ORIGIN=https://yourdomain.com
```

**Workers (.env.production)**
```env
REDIS_URL=redis://...
REPLICATE_API_KEY=r8_...
OPENAI_API_KEY=sk-...
API_URL=https://api.yourdomain.com
```

#### 6.2 Security Hardening
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Configure CORS for production domains only
- [ ] Enable rate limiting on API
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Enable HTTPS only
- [ ] Add security headers (Helmet.js already configured)

#### 6.3 Monitoring & Logging
- [ ] **Error Tracking**: Sentry or LogRocket
- [ ] **Analytics**: Google Analytics / Plausible
- [ ] **Uptime Monitoring**: UptimeRobot or Pingdom
- [ ] **Log Aggregation**: Logtail or Papertrail

---

### Phase 7: Testing & QA

#### 7.1 End-to-End Testing
- [ ] User registration flow
- [ ] Login/logout
- [ ] Project creation
- [ ] Script upload & parsing
- [ ] Image generation
- [ ] Subscription purchase
- [ ] Export functionality

#### 7.2 Performance Testing
- [ ] Load testing (100 concurrent users)
- [ ] Image generation latency (<30s target)
- [ ] API response time (<200ms target)
- [ ] Frontend Lighthouse score (>90 target)

#### 7.3 Security Audit
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Input validation
- [ ] File upload security

---

### Phase 8: Launch Preparation

#### 8.1 Pre-Launch Checklist
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Error alerts set up
- [ ] Backup strategy implemented
- [ ] Documentation updated

#### 8.2 Marketing & Communication
- [ ] Landing page ready
- [ ] Pricing page live
- [ ] Terms of Service & Privacy Policy
- [ ] Support email configured
- [ ] Social media accounts created

#### 8.3 Soft Launch
- [ ] Invite beta testers (10-50 users)
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Optimize performance

---

## 💰 Estimated Monthly Costs

| Service | Free Tier | Starter | Growth |
|---------|-----------|---------|--------|
| **Vercel (Frontend)** | ✅ Free | $20/mo | $20/mo |
| **Render (API)** | ❌ | $7/mo | $25/mo |
| **Modal (AI Workers)** | ✅ Free* | $10/mo* | $50/mo* |
| **Supabase (DB)** | ✅ Free | $25/mo | $25/mo |
| **Redis Cloud** | ✅ Free | $10/mo | $30/mo |
| **Stripe** | 2.9% + $0.30 | Same | Same |
| **Domain** | - | $1/mo | $1/mo |
| **Total (excl. Stripe)** | **$0** | **~$73/mo** | **~$151/mo** |

\* Pay-per-use based on GPU time

---

## 🎯 Recommended Deployment Strategy

### Stage 1: MVP Launch (Week 1-2)
1. Set up Supabase (free tier)
2. Deploy frontend to Vercel (free tier)
3. Deploy API to Render ($7/mo)
4. Run workers locally with ngrok
5. Use test Stripe keys
6. Launch to beta users

**Total Cost**: ~$10/month

### Stage 2: Production Ready (Week 3-4)
1. Upgrade to production API keys
2. Deploy workers to Modal
3. Set up Redis Cloud
4. Configure custom domain
5. Enable Stripe payments
6. Add monitoring & logging

**Total Cost**: ~$75/month

### Stage 3: Scale (Month 2+)
1. Optimize AI generation costs
2. Add CDN for images
3. Implement caching
4. Scale infrastructure based on usage
5. Add enterprise features

**Total Cost**: Variable based on usage

---

## 📞 Support & Resources

### Documentation
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Modal: https://modal.com/docs
- Stripe: https://stripe.com/docs

### Community
- Discord: Storyboard AI community
- GitHub Issues: Bug reports & feature requests
- Email: support@storyboardai.com

---

## 🔄 Post-Deployment Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review user feedback

### Weekly
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Backup verification

### Monthly
- [ ] Security audit
- [ ] Cost optimization review
- [ ] Feature roadmap planning

---

**Last Updated**: February 20, 2026  
**Version**: 1.0  
**Status**: Ready for Deployment
