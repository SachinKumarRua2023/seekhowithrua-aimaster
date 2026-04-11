# 🚀 Deploy LMS to Vercel + Domain Setup

## STEP 1: Deploy to Vercel

### Option A: Using Vercel CLI
```powershell
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Go to frontend folder
cd "c:\Users\Sachin Kumar\OneDrive\Desktop\Full Stack Dev Tutorials\projects\seekhowithrua-lms-repo\frontend"

# Deploy to production
vercel --prod
```

### Option B: Using GitHub (Recommended - Easier)
1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import from GitHub: Select `SachinKumarRua2023/seekhowithrua-lms`
4. Configure:
   - **Framework Preset**: Other (Static HTML)
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Click **Deploy**

---

## STEP 2: Add Custom Domain (lms.seekhowithrua.com)

### In Vercel Dashboard:
1. Select your deployed project
2. Go to **Settings** → **Domains**
3. Enter domain: `lms.seekhowithrua.com`
4. Click **Add**
5. Vercel will show DNS instructions

---

## STEP 3: Configure DNS in Hostinger

1. Login to Hostinger hPanel
2. Go to **Domains** → `seekhowithrua.com`
3. Click **DNS Zone Editor**
4. Add new record:

| Type | Name | Target/Value | TTL |
|------|------|--------------|-----|
| CNAME | lms | cname.vercel-dns.com | 14400 |

5. Click **Save**

---

## STEP 4: Wait for SSL Certificate

- Vercel automatically issues SSL via Let's Encrypt
- Wait 2-5 minutes for DNS propagation
- Domain status in Vercel will show **"Valid Configuration"**

---

## STEP 5: Update API URL in Frontend

After deployment, update the backend API URL:

Edit `frontend/js/lms.js`:
```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:8000/api/lms';

// To production backend:
const API_BASE_URL = 'https://django-react-ml-app.onrender.com/api/lms';
```

Then push the change:
```powershell
cd "c:\Users\Sachin Kumar\OneDrive\Desktop\Full Stack Dev Tutorials\projects\seekhowithrua-lms-repo"
git add frontend/js/lms.js
git commit -m "Update API URL to production backend"
git push origin master
vercel --prod
```

---

## ✅ FINAL URLs

| Service | URL |
|---------|-----|
| LMS Frontend | https://lms.seekhowithrua.com |
| Backend API | https://django-react-ml-app.onrender.com/api/lms/ |
| Main Website | https://app.seekhowithrua.com |

---

## 🔗 Check LMS Link in Main Website

In your main React app (`Navbar.jsx`), verify the LMS link:
```javascript
{ name: 'LMS', path: 'https://lms.seekhowithrua.com', icon: '📚', color: '#7c3aed', external: true }
```

This will open the LMS in a new tab from your main website.

---

## QUICK COMMANDS

```powershell
# Deploy to Vercel
cd "c:\Users\Sachin Kumar\OneDrive\Desktop\Full Stack Dev Tutorials\projects\seekhowithrua-lms-repo\frontend"
vercel --prod

# After domain setup, check with:
curl -I https://lms.seekhowithrua.com
```

---

## 🎯 DONE!

Your LMS will be live at: **https://lms.seekhowithrua.com**
