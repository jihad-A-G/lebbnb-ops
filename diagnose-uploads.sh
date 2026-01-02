#!/bin/bash

# Quick diagnostic script for upload timeout issues
# Run this on your VPS to check current configuration

echo "======================================"
echo "Lebbnb Upload Diagnostics"
echo "======================================"
echo ""

echo "1. Checking Nginx Global Timeouts..."
echo "--------------------------------------"
if grep -q "client_body_timeout" /etc/nginx/nginx.conf; then
    grep -E "(client_body_timeout|proxy_.*_timeout)" /etc/nginx/nginx.conf | grep -v "#"
else
    echo "❌ No timeout settings found in nginx.conf"
fi
echo ""

echo "2. Checking Nginx Site Config..."
echo "--------------------------------------"
if [ -f /etc/nginx/sites-available/lebbnb ]; then
    echo "✓ Config file exists"
    # Check for timeout overrides in /api location
    if grep -A 20 "location /api" /etc/nginx/sites-available/lebbnb | grep -q "timeout"; then
        echo "⚠️  WARNING: Found timeout directives in /api location (should be removed):"
        grep -A 20 "location /api" /etc/nginx/sites-available/lebbnb | grep timeout
    else
        echo "✓ No timeout overrides in /api location (inheriting global settings)"
    fi
else
    echo "❌ Config file not found"
fi
echo ""

echo "3. Checking Backend Container Status..."
echo "--------------------------------------"
cd /opt/docker/lebbnb-ops 2>/dev/null
if [ $? -eq 0 ]; then
    docker compose ps | grep backend
    echo ""
    echo "Backend logs (last 10 lines):"
    docker compose logs backend --tail=10 | grep -E "(timeout|Server|Sharp|Optimiz)"
else
    echo "❌ Not in docker directory"
fi
echo ""

echo "4. Checking Disk Space..."
echo "--------------------------------------"
df -h / | head -2
echo ""
docker system df
echo ""

echo "5. Checking Upload Volume..."
echo "--------------------------------------"
docker volume inspect lebbnb-ops_uploads_data --format '{{ .Mountpoint }}' 2>/dev/null
if [ $? -eq 0 ]; then
    MOUNT=$(docker volume inspect lebbnb-ops_uploads_data --format '{{ .Mountpoint }}')
    sudo du -sh $MOUNT 2>/dev/null
    sudo ls -lh $MOUNT 2>/dev/null | tail -5
fi
echo ""

echo "6. Checking Network Performance..."
echo "--------------------------------------"
echo "Testing connection to backend..."
curl -s -w "\nTime: %{time_total}s\nSpeed: %{speed_upload} bytes/s\n" \
     -o /dev/null http://localhost:5000/health 2>/dev/null || echo "❌ Backend not responding"
echo ""

echo "======================================"
echo "Recommended Actions:"
echo "======================================"
echo "If timeouts are less than 900s (15 min):"
echo "  sudo nano /etc/nginx/nginx.conf"
echo "  # Change all timeout values to 900s"
echo "  sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "If backend not showing 15-minute timeouts:"
echo "  git pull origin main"
echo "  docker compose build backend"
echo "  docker compose up -d backend"
echo ""
