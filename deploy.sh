#!/bin/bash

# Lebbnb Docker Deployment Script
# This script helps deploy and manage the Lebbnb application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${2}${1}${NC}"
}

# Print header
print_header() {
    echo ""
    print_message "================================" "$BLUE"
    print_message "$1" "$BLUE"
    print_message "================================" "$BLUE"
    echo ""
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_message "❌ Docker is not installed!" "$RED"
        print_message "Please install Docker first: https://docs.docker.com/engine/install/" "$YELLOW"
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        print_message "❌ Docker Compose is not installed!" "$RED"
        print_message "Please install Docker Compose" "$YELLOW"
        exit 1
    fi
    
    print_message "✅ Docker and Docker Compose are installed" "$GREEN"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_message "⚠️  .env file not found!" "$YELLOW"
        print_message "Creating .env from .env.example..." "$BLUE"
        
        if [ -f .env.example ]; then
            cp .env.example .env
            print_message "✅ Created .env file" "$GREEN"
            print_message "⚠️  IMPORTANT: Edit .env file with your configuration!" "$RED"
            print_message "Run: nano .env" "$YELLOW"
            exit 1
        else
            print_message "❌ .env.example not found!" "$RED"
            exit 1
        fi
    fi
    print_message "✅ .env file exists" "$GREEN"
}

# Build and start services
start_services() {
    print_header "Starting Lebbnb Application"
    
    print_message "Building Docker images..." "$BLUE"
    docker compose build
    
    print_message "Starting services..." "$BLUE"
    docker compose up -d
    
    print_message "✅ Services started successfully!" "$GREEN"
    
    echo ""
    print_message "Waiting for services to be healthy..." "$BLUE"
    sleep 10
    
    show_status
}

# Stop services
stop_services() {
    print_header "Stopping Lebbnb Application"
    
    docker compose down
    
    print_message "✅ Services stopped successfully!" "$GREEN"
}

# Restart services
restart_services() {
    print_header "Restarting Lebbnb Application"
    
    docker compose restart
    
    print_message "✅ Services restarted successfully!" "$GREEN"
    sleep 5
    show_status
}

# Show logs
show_logs() {
    print_header "Application Logs"
    
    docker compose logs -f --tail=100
}

# Show status
show_status() {
    print_header "Application Status"
    
    docker compose ps
    
    echo ""
    print_message "Service URLs:" "$BLUE"
    echo "  Frontend:    http://localhost:3000"
    echo "  Backend API: http://localhost:5000/api"
    echo "  Health:      http://localhost:5000/health"
    echo "  Admin:       http://localhost:3000/admin/login"
}

# Update application
update_app() {
    print_header "Updating Lebbnb Application"
    
    print_message "Pulling latest code..." "$BLUE"
    git pull origin main
    
    print_message "Stopping services..." "$BLUE"
    docker compose down
    
    print_message "Rebuilding images..." "$BLUE"
    docker compose build --no-cache
    
    print_message "Starting services..." "$BLUE"
    docker compose up -d
    
    print_message "✅ Update completed successfully!" "$GREEN"
    
    sleep 10
    show_status
}

# Backup data
backup_data() {
    print_header "Backing Up Data"
    
    BACKUP_DIR="./backups"
    DATE=$(date +%Y%m%d_%H%M%S)
    
    mkdir -p $BACKUP_DIR
    
    print_message "Backing up MongoDB..." "$BLUE"
    docker compose exec -T mongodb mongodump \
        --username=${MONGO_ROOT_USERNAME:-admin} \
        --password=${MONGO_ROOT_PASSWORD} \
        --authenticationDatabase=admin \
        --db=${MONGO_DATABASE:-lebbnb} \
        --archive > $BACKUP_DIR/mongo-$DATE.archive
    
    print_message "Backing up uploads..." "$BLUE"
    docker run --rm \
        -v lebbnb_uploads_data:/data \
        -v $(pwd)/$BACKUP_DIR:/backup \
        alpine tar czf /backup/uploads-$DATE.tar.gz -C /data .
    
    print_message "✅ Backup completed: $BACKUP_DIR" "$GREEN"
    print_message "MongoDB: mongo-$DATE.archive" "$BLUE"
    print_message "Uploads: uploads-$DATE.tar.gz" "$BLUE"
}

# Clean up Docker resources
cleanup() {
    print_header "Cleaning Up Docker Resources"
    
    print_message "⚠️  This will remove unused Docker images and containers" "$YELLOW"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -f
        print_message "✅ Cleanup completed!" "$GREEN"
    else
        print_message "Cleanup cancelled" "$YELLOW"
    fi
}

# Generate JWT secrets
generate_secrets() {
    print_header "Generate JWT Secrets"
    
    print_message "JWT Access Secret:" "$BLUE"
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    
    echo ""
    print_message "JWT Refresh Secret:" "$BLUE"
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    
    echo ""
    print_message "Copy these secrets to your .env file" "$YELLOW"
}

# Main menu
show_menu() {
    clear
    print_header "Lebbnb Docker Management"
    
    echo "1) Start application"
    echo "2) Stop application"
    echo "3) Restart application"
    echo "4) View logs"
    echo "5) Show status"
    echo "6) Update application"
    echo "7) Backup data"
    echo "8) Generate JWT secrets"
    echo "9) Clean up Docker"
    echo "0) Exit"
    echo ""
}

# Main script
main() {
    check_docker
    check_env
    
    if [ $# -eq 0 ]; then
        # Interactive mode
        while true; do
            show_menu
            read -p "Select option: " choice
            
            case $choice in
                1) start_services ;;
                2) stop_services ;;
                3) restart_services ;;
                4) show_logs ;;
                5) show_status ;;
                6) update_app ;;
                7) backup_data ;;
                8) generate_secrets ;;
                9) cleanup ;;
                0) 
                    print_message "Goodbye!" "$GREEN"
                    exit 0 
                    ;;
                *) 
                    print_message "Invalid option!" "$RED"
                    sleep 2
                    ;;
            esac
            
            if [ "$choice" != "4" ]; then
                echo ""
                read -p "Press Enter to continue..."
            fi
        done
    else
        # Command line mode
        case "$1" in
            start) start_services ;;
            stop) stop_services ;;
            restart) restart_services ;;
            logs) show_logs ;;
            status) show_status ;;
            update) update_app ;;
            backup) backup_data ;;
            secrets) generate_secrets ;;
            cleanup) cleanup ;;
            *)
                print_message "Usage: $0 {start|stop|restart|logs|status|update|backup|secrets|cleanup}" "$YELLOW"
                exit 1
                ;;
        esac
    fi
}

# Run main function
main "$@"
