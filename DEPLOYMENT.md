# Deployment Guide 🚀

Complete guide to deploy Trading Terminal as a web app and Android APK.

## 📱 Android APK Build

### Method 1: Using Android Studio (Recommended)

1. **Install Prerequisites**
   ```bash
   # Install Node.js 18+
   # Install Android Studio
   # Install Java JDK 11+
   ```

2. **Prepare Frontend Build**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Add Android Platform**
   ```bash
   cd ..
   npm install @capacitor/cli @capacitor/core @capacitor/android
   npx cap add android
   ```

4. **Update Capacitor Config**
   Edit `capacitor.config.ts`:
   ```typescript
   import { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
     appId: 'com.tradeterminal.app',
     appName: 'Trading Terminal',
     webDir: 'frontend/dist',
     server: {
       androidScheme: 'https',
       url: 'https://your-api-url.com', // Optional: for production API
       cleartext: true
     }
   };

   export default config;
   ```

5. **Sync Project**
   ```bash
   npx cap sync android
   ```

6. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

7. **Build APK**
   - In Android Studio: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

8. **Build Release APK**
   - `Build` → `Generate Signed Bundle / APK`
   - Create or use existing keystore
   - APK in: `android/app/build/outputs/apk/release/`

### Method 2: Command Line Build

```bash
cd android
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk

# For release
./gradlew assembleRelease
```

## 🌐 Web App Deployment

### Option 1: Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment**
   - Add `VITE_API_URL` in Vercel dashboard
   - Point to your backend API URL

### Option 2: Netlify (Frontend)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Drag `dist` folder to netlify.com
   - Or use Netlify CLI:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables**
   - Add `VITE_API_URL` in Netlify settings

### Option 3: Railway (Full Stack)

1. **Create Railway Account**
   - Go to railway.app
   - Connect GitHub repository

2. **Deploy Backend**
   - New Project → Deploy from GitHub
   - Root directory: `/backend`
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `PORT=5000`

3. **Deploy Frontend**
   - Add new service from same repo
   - Root directory: `/frontend`
   - Build command: `npm run build`
   - Start command: `npm run preview`
   - Add `VITE_API_URL` with backend URL

### Option 4: Render (Backend)

1. **Create New Web Service**
   - Connect GitHub repository
   - Root directory: `backend`

2. **Configure Service**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   
3. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

### Option 5: Heroku (Backend)

1. **Install Heroku CLI**
   ```bash
   npm i -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   cd backend
   heroku create trading-terminal-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set JWT_SECRET=your-secret-key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 💾 Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to mongodb.com/cloud/atlas
   - Create free cluster

2. **Configure Database**
   - Create database: `trading-terminal`
   - Create user with password
   - Whitelist IP: `0.0.0.0/0` (all IPs)

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/trading-terminal?retryWrites=true&w=majority
   ```

4. **Add to Backend .env**
   ```env
   MONGODB_URI=your-connection-string
   ```

### Local MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu
   sudo apt install mongodb

   # MacOS
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Update .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/trading-terminal
   ```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use HTTPS for all communications
- [ ] Enable CORS only for your frontend domain
- [ ] Set up rate limiting
- [ ] Implement proper input validation
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

## 📊 Monitoring & Analytics

### Backend Monitoring

- Use Railway/Render built-in monitoring
- Set up error tracking (e.g., Sentry)
- Monitor API response times
- Track database queries

### Frontend Analytics

- Google Analytics
- Mixpanel for user behavior
- LogRocket for session replay

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Add Railway deployment commands

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend && vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🐛 Troubleshooting

### Android Build Issues

**Problem: Capacitor not found**
```bash
npm install @capacitor/cli @capacitor/core @capacitor/android
```

**Problem: Gradle build fails**
- Update Android Studio
- Sync Gradle files
- Clean build: `./gradlew clean`

**Problem: APK not installing**
- Enable "Install from Unknown Sources"
- Check Android version compatibility

### Deployment Issues

**Problem: API not connecting**
- Check CORS settings
- Verify API URL in frontend env
- Check backend logs

**Problem: MongoDB connection fails**
- Verify connection string
- Check IP whitelist
- Confirm username/password

**Problem: Frontend shows blank page**
- Check browser console for errors
- Verify API URL is correct
- Check if backend is running

## 📱 Publishing to Play Store

1. **Prepare Release Build**
   - Create keystore
   - Build signed APK/AAB
   - Test thoroughly

2. **Create Play Console Account**
   - Pay $25 one-time fee
   - Complete verification

3. **Upload App**
   - Create app listing
   - Add screenshots (min 2)
   - Write description
   - Set content rating
   - Upload APK/AAB

4. **Review Process**
   - Typically takes 1-3 days
   - Address any issues from Google

## 🔗 Useful Links

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)
- [Android Publishing](https://developer.android.com/studio/publish)

---

Need help? Open an issue on GitHub!
