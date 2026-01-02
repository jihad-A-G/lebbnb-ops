# Upload Performance Optimization - Deployment Guide

## Problem Identified
The upload endpoint was timing out after 15 minutes with just 4 images due to:
1. ❌ Nginx `/api` location had **300s timeouts** overriding global **600s** settings
2. ❌ Node.js/Express server had default **2-minute timeout**
3. ❌ Multer allowed up to **100 files** per request (too many, slows processing)
4. ❌ No client body buffering optimization in Nginx

## Changes Made

### 1. Nginx Configuration (`nginx-config-optimized.conf`)
- ✅ **Removed** location-specific timeouts to inherit global 600s settings
- ✅ **Added** `client_body_buffer_size 256k` for better upload buffering
- ✅ **Added** `client_body_temp_path` for temporary file storage
- ✅ **Kept** `proxy_request_buffering off` and `proxy_buffering off` for streaming
- ✅ **Enhanced** error logging for debugging

### 2. Backend Server Timeout (`src/server.ts`)
- ✅ Set `server.timeout = 600000` (10 minutes)
- ✅ Set `server.keepAliveTimeout = 610000` (10 min + 10 sec)
- ✅ Set `server.headersTimeout = 620000` (10 min + 20 sec)

### 3. Express Request Timeout (`src/app.ts`)
- ✅ Added middleware to set `req.setTimeout(600000)` (10 minutes)
- ✅ Added middleware to set `res.setTimeout(600000)` (10 minutes)

### 4. Multer Configuration (`src/config/multer.ts`)
- ✅ **Reduced** max files from 100 to **20 per request**
- ✅ **Added** `fieldSize: 2MB` limit
- ✅ **Added** `parts: 25` limit for form fields
- ✅ Kept `fileSize: 50MB` per file

## VPS Deployment Steps

### Step 1: Pull Latest Code on VPS
```bash
cd /opt/docker/lebbnb-ops
git pull origin main
```

### Step 2: Ensure Nginx Cache Directory Exists
```bash
sudo mkdir -p /var/cache/nginx/client_temp
sudo chown -R www-data:www-data /var/cache/nginx
sudo chmod -R 755 /var/cache/nginx
```

### Step 3: Update Nginx Configuration
```bash
# Backup current config
sudo cp /etc/nginx/sites-available/lebbnb /etc/nginx/sites-available/lebbnb.backup

# Copy optimized config
sudo cp nginx-config-optimized.conf /etc/nginx/sites-available/lebbnb

# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### Step 4: Rebuild and Restart Backend
```bash
# Rebuild backend container
docker compose build backend

# Restart backend with new timeout settings
docker compose up -d backend

# Verify backend is healthy
docker compose ps
docker compose logs backend --tail=50
```

### Step 5: Verify Settings
```bash
# Check Nginx is running
sudo systemctl status nginx

# Check backend timeout logs
docker compose logs backend | grep "timeouts configured"

# Should see: "⏱️  Server timeouts configured: 10 minutes for uploads"
```

## Testing Upload Performance

### Test with 4 Images
```bash
# On your local machine or VPS, monitor the upload
curl -X POST https://lebbnb.com/api/properties/YOUR_PROPERTY_ID/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "images=@image3.jpg" \
  -F "images=@image4.jpg" \
  -w "\nTime: %{time_total}s\n"
```

### Monitor in Real-Time (On VPS)
```bash
# Terminal 1: Watch Nginx logs
sudo tail -f /var/log/nginx/lebbnb-error.log

# Terminal 2: Watch backend logs
docker compose logs -f backend

# Terminal 3: Monitor network
docker stats lebbnb-backend
```

### Expected Results
- ✅ Uploads should complete within **2-5 minutes** for 4 images
- ✅ No timeout errors in logs
- ✅ HTTP 200 response with uploaded file names
- ✅ Images visible in admin panel

## Troubleshooting

### If Upload Still Times Out

1. **Check Nginx Error Logs:**
   ```bash
   sudo tail -100 /var/log/nginx/lebbnb-error.log
   ```
   Look for: `client_body_timeout`, `proxy_read_timeout`, `upstream timed out`

2. **Check Backend Logs:**
   ```bash
   docker compose logs backend --tail=100
   ```
   Look for: upload errors, memory issues, disk space

3. **Check Disk Space:**
   ```bash
   df -h
   docker system df
   ```

4. **Check Image Sizes:**
   If images are very large (>10MB each), consider:
   - Compressing images before upload
   - Increasing timeouts further (e.g., 15 minutes)
   - Adding image optimization on backend

5. **Increase Timeouts Further (If Needed):**
   
   Edit `/etc/nginx/nginx.conf`:
   ```nginx
   # In http block, change from 600s to 900s (15 minutes)
   client_body_timeout 900s;
   proxy_connect_timeout 900s;
   proxy_send_timeout 900s;
   proxy_read_timeout 900s;
   ```
   
   Then rebuild backend with 15-minute timeout:
   - Change `600000` to `900000` in `src/server.ts` and `src/app.ts`
   - Rebuild and restart

### Check Current Timeout Settings

```bash
# On VPS - Check Nginx global settings
grep -A 10 "http {" /etc/nginx/nginx.conf | grep timeout

# Should show:
# client_body_timeout 600s;
# proxy_connect_timeout 600s;
# proxy_send_timeout 600s;
# proxy_read_timeout 600s;

# Check Nginx site config (should NOT have timeout overrides)
grep timeout /etc/nginx/sites-available/lebbnb

# Only health check should have short timeouts (5s)
# /api location should have NO timeout directives
```

## Performance Tips

1. **Optimize Images Before Upload:**
   - Compress images to <2MB each
   - Use tools like TinyPNG, ImageOptim
   - Convert to WebP format for better compression

2. **Upload in Batches:**
   - Instead of 4 images at once, upload 2 + 2
   - Reduces server load and network congestion

3. **Monitor Server Resources:**
   ```bash
   # Check CPU/Memory usage during upload
   docker stats lebbnb-backend
   
   # If high CPU usage, images might need backend optimization
   ```

4. **Add Image Processing (Future Enhancement):**
   - Install Sharp library for image optimization
   - Auto-resize images to max 1920px width
   - Generate thumbnails on backend

## Success Criteria

✅ 4 images upload in **< 5 minutes**  
✅ No timeout errors  
✅ Images saved in `uploads_data` volume  
✅ Images displayed correctly in frontend  
✅ Property created with all images  

## Rollback (If Issues Occur)

```bash
# Restore old Nginx config
sudo cp /etc/nginx/sites-available/lebbnb.backup /etc/nginx/sites-available/lebbnb
sudo nginx -t
sudo systemctl reload nginx

# Revert backend code
cd /opt/docker/lebbnb-ops
git checkout HEAD~1  # Go back one commit
docker compose build backend
docker compose up -d backend
```

## Next Steps After Successful Upload

1. ✅ Create admin user:
   ```bash
   docker compose exec backend node scripts/createAdmin.js
   ```

2. ✅ Test full property creation flow

3. ✅ Monitor logs for any issues

4. ✅ Consider adding image optimization library (Sharp) for auto-resize

---

**Questions or Issues?** Check logs and test step by step. The 10-minute timeout should be more than enough for 4 images unless they're extremely large (>20MB each).
