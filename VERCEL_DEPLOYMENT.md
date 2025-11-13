# 🚀 Vercel Deployment Guide

Complete guide to deploy your Code Tracker application to Vercel.

## Prerequisites

1. A [Vercel Account](https://vercel.com/signup) (free)
2. [Git](https://git-scm.com/) installed
3. A [GitHub](https://github.com) account (recommended)
4. MongoDB Atlas connection string

---

## Step 1: Prepare Your Project

### 1.1 Initialize Git Repository (if not done)

```bash
cd code-tracker
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `code-tracker`)
3. **Do NOT** initialize with README, .gitignore, or license
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/code-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"

2. **Import Git Repository**
   - Click "Import Git Repository"
   - Select your GitHub repository (`code-tracker`)
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables** ⚠️ **IMPORTANT**
   
   Click on "Environment Variables" and add:

   | Name | Value | Example |
   |------|-------|---------|
   | `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=App` |
   | `JWT_SECRET` | Random secure string (32+ chars) | `your_super_secret_jwt_key_min_32_chars_long` |

   > 💡 **Tip**: Generate a secure JWT_SECRET using:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd code-tracker
   vercel
   ```

4. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `code-tracker` (or your choice)
   - In which directory? `./`
   - Auto-detected settings? **Y**

5. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB URI when prompted
   
   vercel env add JWT_SECRET
   # Paste your JWT secret when prompted
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Step 3: Verify Deployment

1. **Open Your Site**
   - Visit the URL provided by Vercel
   - Example: `https://code-tracker-xyz.vercel.app`

2. **Test Features**
   - Register a new account
   - Create a topic
   - Add problems
   - Submit solutions
   - Check leaderboard

---

## Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Environment Variables Reference

### Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp

# JWT Authentication Secret (32+ characters)
JWT_SECRET=your_super_secret_random_string_here
```

### How to Get MongoDB URI

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

**Your current MongoDB URI:**
```
mongodb+srv://cinemazbd3:cinemazbd3@cluster0.f03zw.mongodb.net/?appName=Cluster0
```

---

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Run build checks before deploying

---

## Troubleshooting

### Build Fails

**Problem**: Build fails with module errors

**Solution**:
```bash
# Clean install locally
rm -rf node_modules package-lock.json
npm install
npm run build
# If successful, commit and push
```

### Environment Variables Not Working

**Problem**: App can't connect to database

**Solution**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all variables are set
3. Make sure they're set for "Production", "Preview", and "Development"
4. Redeploy the project

### MongoDB Connection Error

**Problem**: "MongooseServerSelectionError"

**Solution**:
1. Check MongoDB Atlas IP whitelist
2. Add `0.0.0.0/0` to allow all IPs (or Vercel's IP ranges)
3. Verify connection string is correct

---

## Updating Your Deployment

### Push Updates

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically redeploy! 🎉

### Manual Redeploy

In Vercel Dashboard:
1. Go to "Deployments"
2. Click on latest deployment
3. Click "Redeploy"

---

## Performance Tips

1. **Enable Edge Caching**
   - Already configured in Next.js

2. **Use Vercel Analytics**
   - Go to Project Settings → Analytics
   - Enable Web Analytics (free)

3. **Monitor Performance**
   - Check deployment logs in Vercel Dashboard
   - Use MongoDB Atlas monitoring

---

## Security Checklist

✅ Environment variables not committed to Git  
✅ `.env.local` in `.gitignore`  
✅ JWT_SECRET is strong and random  
✅ MongoDB IP whitelist configured  
✅ HTTPS enabled (automatic on Vercel)  

---

## Support & Resources

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [Next.js Deployment](https://nextjs.org/docs/deployment)
- 🔧 [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## Quick Command Reference

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm project-name

# Pull environment variables locally
vercel env pull .env.local
```

---

## 🎉 Congratulations!

Your Code Tracker is now live! Share your deployment URL with your team and start tracking progress together!

**Example URL**: `https://code-tracker-xyz.vercel.app`

---

## Need Help?

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Check MongoDB Atlas connection
4. Review the error messages in browser console

Good luck! 🚀

