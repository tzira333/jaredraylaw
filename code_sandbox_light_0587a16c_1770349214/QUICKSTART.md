# Quick Start - Cloudflare Deployment

Deploy Jared Ray Law website to Cloudflare Workers with D1 database in 5 minutes!

## 🚀 One-Command Deploy (Easy Way)

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. ✅ Check/install Wrangler CLI
2. ✅ Login to Cloudflare
3. ✅ Create D1 database
4. ✅ Run migrations
5. ✅ Build static files
6. ✅ Deploy your website

**That's it!** Follow the prompts.

---

## 📋 Manual Deploy (Step by Step)

If you prefer to do it manually:

### 1. Install Wrangler
```bash
npm install -g wrangler
```

### 2. Login
```bash
wrangler login
```

### 3. Create Database
```bash
wrangler d1 create jaredraylaw-db
```

Copy the `database_id` and update `wrangler.toml`

### 4. Run Migrations
```bash
wrangler d1 migrations apply jaredraylaw-db --remote
```

### 5. Build & Deploy
```bash
npm run build:public
wrangler deploy
```

---

## 📖 Full Documentation

See **[CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md)** for:
- Complete deployment guide
- API endpoint documentation
- Database schema details
- Custom domain setup
- Troubleshooting
- Development workflow

---

## 🌐 After Deployment

Your website will be live at:
```
https://jaredraylaw.YOUR-SUBDOMAIN.workers.dev
```

### Test the Contact Form
1. Visit your deployed URL
2. Fill out the contact form
3. Submit it
4. You should see a success message

### View Submissions
```bash
wrangler d1 execute jaredraylaw-db --command "SELECT * FROM contact_submissions"
```

### Add Custom Domain
1. Go to Cloudflare Dashboard
2. Workers & Pages → jaredraylaw
3. Settings → Triggers → Add Custom Domain
4. Enter `jaredraylaw.com`

---

## 🔧 Development

### Run Locally
```bash
wrangler d1 migrations apply jaredraylaw-db --local
wrangler dev
```

Visit: http://localhost:8787

### View Logs
```bash
wrangler tail
```

---

## 📞 Need Help?

See [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) for detailed troubleshooting.

---

**Your website is ready to go live!** 🎉