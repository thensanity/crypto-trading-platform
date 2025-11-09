#!/bin/bash

# Crypto Trading Platform Deployment Script
# This script handles building, testing, and deploying the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="crypto-trading-platform"
DOCKER_IMAGE="crypto-trading-platform"
DOCKER_TAG="latest"
PORT=3000

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

# Check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    npm ci
    success "Dependencies installed"
}

# Run tests
run_tests() {
    log "Running unit tests..."
    npm test -- --coverage --watchAll=false
    success "Unit tests passed"
    
    log "Running E2E tests..."
    npx playwright install
    npx playwright test
    success "E2E tests passed"
}

# Build application
build_app() {
    log "Building application..."
    npm run build
    success "Application built successfully"
}

# Build Docker image
build_docker() {
    log "Building Docker image..."
    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
    success "Docker image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
}

# Run Docker container
run_docker() {
    log "Starting Docker container..."
    docker run -d \
        --name ${APP_NAME} \
        -p ${PORT}:80 \
        --restart unless-stopped \
        ${DOCKER_IMAGE}:${DOCKER_TAG}
    success "Container started on port ${PORT}"
}

# Stop existing container
stop_container() {
    log "Stopping existing container..."
    if docker ps -q -f name=${APP_NAME} | grep -q .; then
        docker stop ${APP_NAME}
        docker rm ${APP_NAME}
        success "Container stopped and removed"
    else
        log "No existing container found"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    sleep 5
    
    if curl -f http://localhost:${PORT}/health > /dev/null 2>&1; then
        success "Application is healthy"
    else
        error "Health check failed"
    fi
}

# Deploy to production
deploy_production() {
    log "Deploying to production..."
    
    # Stop existing container
    stop_container
    
    # Build and run
    build_docker
    run_docker
    
    # Health check
    health_check
    
    success "Deployment completed successfully!"
    log "Application is available at: http://localhost:${PORT}"
}

# Deploy with Docker Compose
deploy_compose() {
    log "Deploying with Docker Compose..."
    
    # Stop existing services
    docker-compose down
    
    # Build and start services
    docker-compose up -d --build
    
    # Health check
    health_check
    
    success "Docker Compose deployment completed!"
    log "Application is available at: http://localhost:${PORT}"
}

# Clean up
cleanup() {
    log "Cleaning up..."
    docker system prune -f
    success "Cleanup completed"
}

# Show help
show_help() {
    echo "Crypto Trading Platform Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install dependencies"
    echo "  test        Run tests"
    echo "  build       Build application"
    echo "  docker      Build Docker image"
    echo "  run         Run Docker container"
    echo "  deploy      Deploy to production"
    echo "  compose     Deploy with Docker Compose"
    echo "  stop        Stop container"
    echo "  health      Health check"
    echo "  cleanup     Clean up Docker resources"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 test       # Run all tests"
    echo "  $0 deploy     # Deploy to production"
    echo "  $0 compose    # Deploy with Docker Compose"
}

# Main script
main() {
    case "${1:-help}" in
        install)
            check_dependencies
            install_dependencies
            ;;
        test)
            check_dependencies
            install_dependencies
            run_tests
            ;;
        build)
            check_dependencies
            install_dependencies
            build_app
            ;;
        docker)
            check_dependencies
            build_docker
            ;;
        run)
            check_dependencies
            stop_container
            build_docker
            run_docker
            health_check
            ;;
        deploy)
            check_dependencies
            install_dependencies
            run_tests
            build_app
            deploy_production
            ;;
        compose)
            check_dependencies
            deploy_compose
            ;;
        stop)
            stop_container
            ;;
        health)
            health_check
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Unknown command: $1"
            ;;
    esac
}

# Run main function with all arguments
main "$@"


