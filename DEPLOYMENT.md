# Frontend Deployment Guide

## Netlify Deployment

Your frontend is configured to work with the deployed backend at:
**https://backend-invoice-extractor.onrender.com**

### Environment Variables

The `.env.production` file contains:
```
VITE_API_URL=https://backend-invoice-extractor.onrender.com
```

This is automatically used when building for production.

### Deploy to Netlify

1. **Push to GitHub** (if not already done)
2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   
3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - No additional environment variables needed (uses .env.production)

4. **Deploy!**
   - Netlify will automatically build and deploy
   - Your site will be live at your custom domain: https://sorryforthedelay.netlify.app

### Local Development

For local development, the app uses Vite's proxy (configured in `vite.config.js`):
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API calls use relative paths that are proxied to the backend

### Testing Production Build Locally

```bash
npm run build
npm run preview
```

This will build and serve the production version locally to test before deploying.
