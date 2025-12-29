#!/bin/bash

# Lebbnb Docker Setup Verification Script
# This script tests if the Docker setup is working correctly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Lebbnb Docker Setup Verification${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check 1: Docker installed
echo -n "Checking Docker installation... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Docker not installed${NC}"
    exit 1
fi

# Check 2: Docker Compose installed
echo -n "Checking Docker Compose installation... "
if command -v docker compose &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Docker Compose not installed${NC}"
    exit 1
fi

# Check 3: .env file exists
echo -n "Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    echo "  Run: cp .env.example .env"
fi

# Check 4: Docker daemon running
echo -n "Checking Docker daemon... "
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Docker daemon not running${NC}"
    exit 1
fi

# Check 5: Dockerfile exists
echo -n "Checking backend Dockerfile... "
if [ -f Lebbnb-backend/Dockerfile ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Backend Dockerfile missing${NC}"
fi

echo -n "Checking frontend Dockerfile... "
if [ -f lebbnb-frontend/Dockerfile ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Frontend Dockerfile missing${NC}"
fi

# Check 6: docker-compose.yml exists
echo -n "Checking docker-compose.yml... "
if [ -f docker-compose.yml ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ docker-compose.yml missing${NC}"
    exit 1
fi

# Check 7: Validate docker-compose file
echo -n "Validating docker-compose.yml... "
if docker compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Invalid docker-compose.yml${NC}"
    docker compose config
    exit 1
fi

# Check 8: Check if services are running
echo ""
echo -e "${BLUE}Checking running services...${NC}"
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}Services are running:${NC}"
    docker compose ps
    echo ""
    
    # Test endpoints
    echo -e "${BLUE}Testing endpoints...${NC}"
    
    # Test backend health
    echo -n "Backend health check... "
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Backend not responding${NC}"
    fi
    
    # Test frontend
    echo -n "Frontend check... "
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend not responding${NC}"
    fi
    
    # Test backend API
    echo -n "Backend API check... "
    if curl -s http://localhost:5000/api > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Backend API not responding${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Services not running${NC}"
    echo "  Run: ./deploy.sh start"
fi

# Check 9: Check volumes
echo ""
echo -e "${BLUE}Checking Docker volumes...${NC}"
if docker volume ls | grep -q "lebbnb"; then
    echo -e "${GREEN}✓ Volumes created:${NC}"
    docker volume ls | grep "lebbnb"
else
    echo -e "${YELLOW}⚠ No volumes found${NC}"
    echo "  Volumes will be created when services start"
fi

# Check 10: Check disk space
echo ""
echo -n "Checking disk space... "
AVAILABLE=$(df -h . | tail -1 | awk '{print $4}')
echo -e "${GREEN}✓ Available: $AVAILABLE${NC}"

# Check 11: Check port availability (if services not running)
if ! docker compose ps | grep -q "Up"; then
    echo ""
    echo -e "${BLUE}Checking port availability...${NC}"
    
    for port in 3000 5000 27017; do
        echo -n "Port $port... "
        if lsof -Pi :$port -sTCP:LISTEN -t > /dev/null 2>&1; then
            echo -e "${RED}✗ In use${NC}"
        else
            echo -e "${GREEN}✓ Available${NC}"
        fi
    done
fi

# Summary
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Verification Complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

if [ -f .env ] && [ -f docker-compose.yml ] && [ -f Lebbnb-backend/Dockerfile ] && [ -f lebbnb-frontend/Dockerfile ]; then
    echo -e "${GREEN}✅ Setup is complete and ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review your .env file"
    echo "  2. Run: ./deploy.sh start"
    echo "  3. Visit: http://localhost:3000"
else
    echo -e "${YELLOW}⚠ Setup incomplete. Please check the errors above.${NC}"
fi

echo ""
