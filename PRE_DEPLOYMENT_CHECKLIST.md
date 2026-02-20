# ✅ Pre-Deployment Checklist

## 🔒 Security

### Environment Variables
- [ ] No `.env.local` or `.env` files committed to Git
- [ ] All secrets stored in platform environment variables
- [ ] `JWT_SECRET` is at least 32 random characters
- [ ] API keys rotated after testing

### Database
- [ ] Supabase RLS (Row Level Security) enabled
- [ ] Database user has minimal required permissions
- [ ] SQL injection prevention (parameterized queries)
- [ ] Backup strategy configured

### API Security
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints (Zod)
- [ ] File upload limits enforced
- [ ] HTTPS enforced

### Frontend Security
- [ ] No sensitive data in client-side code
- [ ] CSRF protection enabled
- [ ] XSS prevention (React escapes by default)
- [ ] Content Security Policy headers

---

## 🏗️ Infrastructure

### Supabase
- [ ] Project created
- [ ] SQL schema migrated (`schema.sql`)
- [ ] Storage buckets created (scripts, images, exports)
- [ ] RLS policies tested
- [ ] Connection string tested

### Redis
- [ ] Redis instance created (Upstash or Redis Cloud)
- [ ] Connection URL configured
- [ ] Connection tested

### Frontend (Vercel)
- [ ] GitHub repository connected
- [ ] Root Directory: `apps/web`
- [ ] Build command: `npm run build`
- [ ] All environment variables set
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled

### Backend (Render)
- [ ] GitHub repository connected
- [ ] Root Directory: `apps/api`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `node dist/index.js`
- [ ] All environment variables set
- [ ] Health check endpoint working (`/health`)

### AI Workers
- [ ] Replicate API key added
- [ ] OpenAI API key added
- [ ] Worker deployment configured (Modal/RunPod)
- [ ] GPU resources allocated

---

## 🧪 Testing

### Functional Tests
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Password reset works (if implemented)
- [ ] Create project works
- [ ] Edit project works
- [ ] Delete project works
- [ ] Upload script works
- [ ] Parse script works
- [ ] Generate image works
- [ ] Export works (PDF/PNG/MP4)

### Integration Tests
- [ ] Frontend ↔ API connection works
- [ ] API ↔ Supabase connection works
- [ ] API ↔ Redis connection works
- [ ] Workers ↔ Redis connection works
- [ ] Workers ↔ Replicate API works
- [ ] Stripe webhook works (test mode)

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms (simple endpoints)
- [ ] Image generation < 60 seconds
- [ ] No memory leaks
- [ ] Database queries optimized

### Browser Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Design
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 📊 Monitoring

### Error Tracking
- [ ] Sentry or LogRocket configured
- [ ] Error alerts configured
- [ ] Error boundaries in React components

### Logging
- [ ] API logs enabled
- [ ] Log aggregation configured (Logtail, Papertrail)
- [ ] Log levels configured (info, warn, error)

### Uptime Monitoring
- [ ] UptimeRobot or Pingdom configured
- [ ] Alerts for downtime
- [ ] Health check endpoint monitored

### Analytics
- [ ] Google Analytics / Plausible installed
- [ ] Conversion tracking set up
- [ ] User flow analysis configured

---

## 💳 Payments (Stripe)

### Configuration
- [ ] Stripe account created
- [ ] Test keys configured
- [ ] Live keys ready for launch
- [ ] Products created (Free, Basic, Pro, Enterprise)
- [ ] Prices configured
- [ ] Webhook endpoint created
- [ ] Webhook secret configured

### Testing
- [ ] Test card: 4242 4242 4242 4242
- [ ] Subscription creation works
- [ ] Payment processing works
- [ ] Webhook events received
- [ ] Credits added after payment
- [ ] Cancellation works
- [ ] Refund process tested

---

## 📱 Legal & Compliance

### Required Pages
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy (if using cookies)
- [ ] Refund Policy
- [ ] Acceptable Use Policy

### Compliance
- [ ] GDPR compliance (EU users)
- [ ] CCPA compliance (California users)
- [ ] Cookie consent banner
- [ ] Data export functionality
- [ ] Data deletion functionality
- [ ] Age verification (if required)

---

## 🚀 Launch Preparation

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code formatted (Prettier)
- [ ] No `console.log` in production
- [ ] No `TODO` comments in critical code
- [ ] All functions documented

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] User guide/FAQ created

### Backup & Recovery
- [ ] Database backup strategy
- [ ] Rollback plan documented
- [ ] Disaster recovery plan
- [ ] Data export functionality

### Support
- [ ] Support email configured
- [ ] Contact form working
- [ ] FAQ page created
- [ ] Error messages user-friendly
- [ ] 404 page customized

---

## 🎯 Launch Day Checklist

### Pre-Launch (1 hour before)
- [ ] All tests passing
- [ ] Team notified of launch
- [ ] Monitoring dashboards open
- [ ] Support team ready

### Launch
- [ ] Deploy frontend to production
- [ ] Deploy API to production
- [ ] Verify all services running
- [ ] Test critical user flows
- [ ] Check analytics tracking

### Post-Launch (first 24 hours)
- [ ] Monitor error rates
- [ ] Check uptime
- [ ] Respond to user feedback
- [ ] Track key metrics (signups, conversions)
- [ ] Document any issues

---

## 📈 Post-Launch Optimization

### Week 1
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow endpoints
- [ ] Review analytics

### Month 1
- [ ] A/B test landing page
- [ ] Optimize conversion funnel
- [ ] Add most-requested features
- [ ] Review infrastructure costs

### Ongoing
- [ ] Weekly dependency updates
- [ ] Monthly security audit
- [ ] Quarterly performance review
- [ ] Continuous improvement

---

## 🆘 Emergency Contacts

### Team
- Developer: [Your contact]
- DevOps: [Contact]
- Support: [Contact]

### Services
- Vercel Support: https://vercel.com/support
- Render Support: https://render.com/docs
- Supabase Support: https://supabase.com/support
- Stripe Support: https://stripe.com/support

### Status Pages
- Vercel: https://www.vercel-status.com
- Render: https://status.render.com
- Supabase: https://status.supabase.com
- Stripe: https://status.stripe.com

---

**Last Updated**: February 20, 2026  
**Version**: 1.0
