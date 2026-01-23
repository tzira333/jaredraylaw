# Cloudflare D1 Deployment Guide

Complete guide to deploy Jared Ray Law website to Cloudflare Workers with D1 database.

---

## 📋 **Prerequisites**

Before you begin, make sure you have:

- ✅ A Cloudflare account (free tier works!)
- ✅ Node.js installed (v16.13.0 or higher)
- ✅ npm installed (comes with Node.js)
- ✅ Basic command line knowledge

---

## 🚀 **Step-by-Step Deployment**

### **Step 1: Install Wrangler CLI**

Open your terminal and run:

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

### **Step 2: Login to Cloudflare**

```bash
wrangler login
```

This will open your browser. Log in to your Cloudflare account and authorize Wrangler.

### **Step 3: Prepare Your Project**

Navigate to your project directory:

```bash
cd /path/to/jaredraylaw
```

Install dependencies:

```bash
npm install
```

### **Step 4: Create the D1 Database**

Create your database:

```bash
wrangler d1 create jaredraylaw-db
```

You'll see output like this:
```
✅ Successfully created DB 'jaredraylaw-db'!

[[d1_databases]]
binding = "DB"
database_name = "jaredraylaw-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**IMPORTANT:** Copy the `database_id` value!

### **Step 5: Update wrangler.toml**

Open `wrangler.toml` and add your database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "jaredraylaw-db"
database_id = "YOUR-DATABASE-ID-HERE"  # Paste the ID from Step 4
```

### **Step 6: Run Database Migrations**

Apply the migrations to create your tables:

```bash
wrangler d1 migrations apply jaredraylaw-db --remote
```

This creates:
- ✅ `contact_submissions` table
- ✅ `testimonials` table
- ✅ Seed data with 3 sample testimonials

### **Step 7: Prepare Static Files**

Copy your static files to the public directory:

```bash
npm run build:public
```

This creates:
```
public/
├── index.html
├── css/
│   └── style.css
└── js/
    └── main.js
```

### **Step 8: Deploy to Cloudflare**

Deploy your website:

```bash
wrangler deploy
```

You'll see output like:
```
✨ Successfully deployed to https://jaredraylaw.YOUR-SUBDOMAIN.workers.dev
```

**Your website is now LIVE!** 🎉

---

## 🔧 **Project Structure**

```
jaredraylaw/
├── worker.js                    # Cloudflare Worker (API endpoints)
├── wrangler.toml               # Cloudflare configuration
├── package.json                # Node.js dependencies
├── migrations/                 # D1 database migrations
│   ├── 0001_create_contact_submissions.sql
│   ├── 0002_create_testimonials.sql
│   └── 0003_seed_testimonials.sql
├── public/                     # Static files (auto-generated)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── index.html                  # Source HTML
├── css/
│   └── style.css
├── js/
│   └── main.js
├── README.md
├── DATABASE.md
└── CLOUDFLARE_DEPLOY.md       # This file
```

---

## 🗄️ **Database Schema**

### **contact_submissions**

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID primary key |
| name | TEXT | Client name |
| email | TEXT | Client email |
| phone | TEXT | Client phone |
| service | TEXT | Practice area (family, bankruptcy, etc.) |
| message | TEXT | Client message |
| status | TEXT | Status (new, contacted, closed) |
| created_at | INTEGER | Unix timestamp (ms) |
| updated_at | INTEGER | Unix timestamp (ms) |

### **testimonials**

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID primary key |
| client_name | TEXT | Client name |
| case_type | TEXT | Type of case |
| rating | INTEGER | Star rating (1-5) |
| testimonial_text | TEXT | Testimonial content |
| approved | INTEGER | Approval status (0 or 1) |
| created_at | INTEGER | Unix timestamp (ms) |
| updated_at | INTEGER | Unix timestamp (ms) |

---

## 🔌 **API Endpoints**

Your deployed website exposes these API endpoints:

### **Contact Submissions**

#### Create Submission (Used by Contact Form)
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(440) 123-4567",
  "service": "family",
  "message": "Need help with custody"
}
```

#### Get All Submissions
```
GET /api/contacts?page=1&limit=50&search=john
```

#### Get Single Submission
```
GET /api/contact/{id}
```

#### Update Submission
```
PATCH /api/contact/{id}
Content-Type: application/json

{
  "status": "contacted"
}
```

#### Delete Submission
```
DELETE /api/contact/{id}
```

### **Testimonials**

#### Get Testimonials
```
GET /api/testimonials?approved=true&limit=10
```

#### Create Testimonial
```
POST /api/testimonial
Content-Type: application/json

{
  "client_name": "Jane Smith",
  "case_type": "Bankruptcy",
  "rating": 5,
  "testimonial_text": "Excellent service!"
}
```

---

## 🧪 **Testing Your Deployment**

### Test the Website
Visit your deployed URL:
```
https://jaredraylaw.YOUR-SUBDOMAIN.workers.dev
```

### Test the Contact Form
1. Fill out the contact form
2. Submit it
3. Check if you get a success message

### Verify Database Entry
Query your database:

```bash
wrangler d1 execute jaredraylaw-db --command "SELECT * FROM contact_submissions"
```

You should see your submission!

### Test API Endpoints

Using curl:

```bash
# Get all submissions
curl https://jaredraylaw.YOUR-SUBDOMAIN.workers.dev/api/contacts

# Get testimonials
curl https://jaredraylaw.YOUR-SUBDOMAIN.workers.dev/api/testimonials
```

---

## 🌐 **Custom Domain Setup**

### Add Your Domain

1. Go to Cloudflare Dashboard
2. Select your Worker: `jaredraylaw`
3. Go to **Settings** → **Triggers**
4. Click **Add Custom Domain**
5. Enter: `jaredraylaw.com` or `www.jaredraylaw.com`
6. Cloudflare will automatically configure DNS

### DNS Configuration

If your domain is NOT on Cloudflare:

1. Add a CNAME record:
   ```
   Type: CNAME
   Name: www (or @)
   Value: jaredraylaw.YOUR-SUBDOMAIN.workers.dev
   ```

2. Wait for DNS propagation (5 mins - 48 hours)

---

## 🔒 **Security & Best Practices**

### Environment Variables

Store sensitive data in environment variables:

```bash
wrangler secret put CONTACT_EMAIL
# Enter: jared@jaredraylaw.com
```

Access in worker.js:
```javascript
const email = env.CONTACT_EMAIL;
```

### Rate Limiting (Recommended)

Add rate limiting to prevent spam:

```javascript
// In worker.js, add before API handlers
const rateLimiter = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return false; // Too many requests
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}
```

### Input Sanitization

Already implemented:
- ✅ Email validation
- ✅ Required field checks
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS headers configured

---

## 🛠️ **Development Workflow**

### Local Development

Run locally with local D1 database:

```bash
# Apply migrations locally
wrangler d1 migrations apply jaredraylaw-db --local

# Start dev server
wrangler dev
```

Visit: `http://localhost:8787`

### Make Changes

1. Edit files (HTML, CSS, JS, Worker)
2. Test locally with `wrangler dev`
3. Deploy when ready: `wrangler deploy`

### Database Management

View all submissions:
```bash
wrangler d1 execute jaredraylaw-db --command "SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 10"
```

Update a submission:
```bash
wrangler d1 execute jaredraylaw-db --command "UPDATE contact_submissions SET status='contacted' WHERE id='xxx'"
```

Delete old submissions:
```bash
wrangler d1 execute jaredraylaw-db --command "DELETE FROM contact_submissions WHERE created_at < strftime('%s', 'now', '-30 days') * 1000"
```

---

## 📊 **Monitoring & Analytics**

### Cloudflare Analytics

View in Cloudflare Dashboard:
- Requests per second
- Bandwidth usage
- Error rates
- Geographic distribution

### Database Queries

Check table sizes:
```bash
wrangler d1 execute jaredraylaw-db --command "SELECT COUNT(*) FROM contact_submissions"
```

### Logs

View real-time logs:
```bash
wrangler tail
```

---

## 🐛 **Troubleshooting**

### Database Connection Issues

**Error:** `Error: D1 database binding not found`

**Solution:** Make sure your `wrangler.toml` has the correct database_id

### Migration Errors

**Error:** `Table already exists`

**Solution:** Drop and recreate:
```bash
wrangler d1 execute jaredraylaw-db --command "DROP TABLE IF EXISTS contact_submissions"
wrangler d1 migrations apply jaredraylaw-db --remote
```

### Form Not Submitting

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Worker logs: `wrangler tail`
4. API endpoint is `/api/contact` not `/tables/contact_submissions`

### CORS Errors

Already configured in `worker.js`, but if issues:
- Check `corsHeaders` object
- Verify OPTIONS handler exists
- Make sure headers are applied to all responses

---

## 💰 **Pricing**

Cloudflare Workers + D1 (Free Tier):
- ✅ 100,000 requests/day (Workers)
- ✅ 5GB storage (D1)
- ✅ 5 million reads/day (D1)
- ✅ 100,000 writes/day (D1)

**Perfect for small to medium law practice websites!**

Paid Plan ($5/month):
- 10 million requests/month
- Additional D1 operations

---

## 🎉 **Your Website is Live!**

After deployment, your website has:

✅ **Professional design** with blue color scheme  
✅ **Working contact form** saving to D1 database  
✅ **Click-to-call buttons** on all devices  
✅ **Testimonials** loaded from database  
✅ **Fast global CDN** via Cloudflare  
✅ **Free SSL certificate**  
✅ **99.99% uptime**  
✅ **Scalable infrastructure**  

---

## 📞 **Need Help?**

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

## 🔄 **Quick Command Reference**

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Create database
wrangler d1 create jaredraylaw-db

# Apply migrations
wrangler d1 migrations apply jaredraylaw-db --remote

# Deploy
wrangler deploy

# View logs
wrangler tail

# Query database
wrangler d1 execute jaredraylaw-db --command "SELECT * FROM contact_submissions"

# Local development
wrangler dev
```

---

**Ready to deploy?** Follow the steps above and you'll have your website live in under 10 minutes! 🚀