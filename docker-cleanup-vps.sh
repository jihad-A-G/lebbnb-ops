#!/bin/bash

# Docker Complete Cleanup Script for VPS
# This will remove ALL Docker data and start fresh
# Run this on your VPS in /opt/docker/lebbnb-ops

echo "======================================"
echo "Docker Complete Cleanup Script"
echo "======================================"
echo ""
echo "⚠️  WARNING: This will remove:"
echo "   - All containers"
echo "   - All images"
echo "   - All volumes (including uploads!)"
echo "   - All build cache"
echo "   - All networks"
echo ""
echo "Current disk usage:"
docker system df
echo ""
echo "======================================"
echo ""

# Confirm before proceeding
read -p "Do you want to BACKUP uploads volume first? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Backing up uploads volume..."
    BACKUP_DIR="/opt/backups"
    mkdir -p $BACKUP_DIR
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # Copy uploads from volume
    docker run --rm \
      -v lebbnb-ops_uploads_data:/data \
      -v $BACKUP_DIR:/backup \
      alpine tar czf /backup/uploads_backup_$TIMESTAMP.tar.gz -C /data .
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup saved to: $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz"
        ls -lh $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz
    else
        echo "❌ Backup failed!"
        exit 1
    fi
    echo ""
fi

read -p "Continue with complete cleanup? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""
echo "🧹 Starting cleanup..."
echo ""

# Step 1: Stop all running containers
echo "1️⃣  Stopping all containers..."
docker compose down 2>/dev/null
docker stop $(docker ps -aq) 2>/dev/null
echo "   ✓ Containers stopped"
echo ""

# Step 2: Remove all containers
echo "2️⃣  Removing all containers..."
docker rm -f $(docker ps -aq) 2>/dev/null
echo "   ✓ Containers removed"
echo ""

# Step 3: Remove all images
echo "3️⃣  Removing all images..."
docker rmi -f $(docker images -aq) 2>/dev/null
echo "   ✓ Images removed"
echo ""

# Step 4: Remove all volumes
echo "4️⃣  Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null
echo "   ✓ Volumes removed"
echo ""

# Step 5: Remove all networks
echo "5️⃣  Removing custom networks..."
docker network prune -f
echo "   ✓ Networks cleaned"
echo ""

# Step 6: Remove build cache
echo "6️⃣  Removing build cache..."
docker builder prune -af
echo "   ✓ Build cache cleared"
echo ""

# Step 7: Final system prune
echo "7️⃣  Final system cleanup..."
docker system prune -af --volumes
echo "   ✓ System cleaned"
echo ""

echo "======================================"
echo "✅ Cleanup Complete!"
echo "======================================"
echo ""
echo "New disk usage:"
docker system df
echo ""
echo "Disk space freed:"
df -h /
echo ""
echo "======================================"
echo "Next steps:"
echo "======================================"
echo "1. git pull origin main"
echo "2. docker compose build"
echo "3. docker compose up -d"
echo ""
echo "Optional - Restore uploads backup:"
echo "After containers are up, run:"
echo "  docker run --rm \\"
echo "    -v lebbnb-ops_uploads_data:/data \\"
echo "    -v $BACKUP_DIR:/backup \\"
echo "    alpine tar xzf /backup/uploads_backup_TIMESTAMP.tar.gz -C /data"
echo ""
