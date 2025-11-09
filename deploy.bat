@echo off
REM Crypto Trading Platform Deployment Script for Windows
REM This script handles building, testing, and deploying the application

setlocal enabledelayedexpansion

REM Configuration
set APP_NAME=crypto-trading-platform
set DOCKER_IMAGE=crypto-trading-platform
set DOCKER_TAG=latest
set PORT=3000

REM Functions
:log
echo [%date% %time%] %~1
goto :eof

:success
echo [SUCCESS] %~1
goto :eof

:warning
echo [WARNING] %~1
goto :eof

:error
echo [ERROR] %~1
exit /b 1

REM Check if required tools are installed
:check_dependencies
call :log "Checking dependencies..."

where node >nul 2>&1
if %errorlevel% neq 0 (
    call :error "Node.js is not installed"
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    call :error "npm is not installed"
)

where docker >nul 2>&1
if %errorlevel% neq 0 (
    call :error "Docker is not installed"
)

call :success "All dependencies are installed"
goto :eof

REM Install dependencies
:install_dependencies
call :log "Installing dependencies..."
npm ci
if %errorlevel% neq 0 (
    call :error "Failed to install dependencies"
)
call :success "Dependencies installed"
goto :eof

REM Run tests
:run_tests
call :log "Running unit tests..."
npm test -- --coverage --watchAll=false
if %errorlevel% neq 0 (
    call :error "Unit tests failed"
)
call :success "Unit tests passed"

call :log "Running E2E tests..."
npx playwright install
npx playwright test
if %errorlevel% neq 0 (
    call :error "E2E tests failed"
)
call :success "E2E tests passed"
goto :eof

REM Build application
:build_app
call :log "Building application..."
npm run build
if %errorlevel% neq 0 (
    call :error "Build failed"
)
call :success "Application built successfully"
goto :eof

REM Build Docker image
:build_docker
call :log "Building Docker image..."
docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .
if %errorlevel% neq 0 (
    call :error "Docker build failed"
)
call :success "Docker image built: %DOCKER_IMAGE%:%DOCKER_TAG%"
goto :eof

REM Run Docker container
:run_docker
call :log "Starting Docker container..."
docker run -d --name %APP_NAME% -p %PORT%:80 --restart unless-stopped %DOCKER_IMAGE%:%DOCKER_TAG%
if %errorlevel% neq 0 (
    call :error "Failed to start container"
)
call :success "Container started on port %PORT%"
goto :eof

REM Stop existing container
:stop_container
call :log "Stopping existing container..."
docker ps -q -f name=%APP_NAME% >nul 2>&1
if %errorlevel% equ 0 (
    docker stop %APP_NAME%
    docker rm %APP_NAME%
    call :success "Container stopped and removed"
) else (
    call :log "No existing container found"
)
goto :eof

REM Health check
:health_check
call :log "Performing health check..."
timeout /t 5 /nobreak >nul
curl -f http://localhost:%PORT%/health >nul 2>&1
if %errorlevel% equ 0 (
    call :success "Application is healthy"
) else (
    call :error "Health check failed"
)
goto :eof

REM Deploy to production
:deploy_production
call :log "Deploying to production..."
call :stop_container
call :build_docker
call :run_docker
call :health_check
call :success "Deployment completed successfully!"
call :log "Application is available at: http://localhost:%PORT%"
goto :eof

REM Deploy with Docker Compose
:deploy_compose
call :log "Deploying with Docker Compose..."
docker-compose down
docker-compose up -d --build
if %errorlevel% neq 0 (
    call :error "Docker Compose deployment failed"
)
call :health_check
call :success "Docker Compose deployment completed!"
call :log "Application is available at: http://localhost:%PORT%"
goto :eof

REM Clean up
:cleanup
call :log "Cleaning up..."
docker system prune -f
call :success "Cleanup completed"
goto :eof

REM Show help
:show_help
echo Crypto Trading Platform Deployment Script
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   install     Install dependencies
echo   test        Run tests
echo   build       Build application
echo   docker      Build Docker image
echo   run         Run Docker container
echo   deploy      Deploy to production
echo   compose     Deploy with Docker Compose
echo   stop        Stop container
echo   health      Health check
echo   cleanup     Clean up Docker resources
echo   help        Show this help message
echo.
echo Examples:
echo   %0 install    # Install dependencies
echo   %0 test       # Run all tests
echo   %0 deploy     # Deploy to production
echo   %0 compose    # Deploy with Docker Compose
goto :eof

REM Main script
if "%1"=="" goto :show_help
if "%1"=="install" goto :install_dependencies
if "%1"=="test" goto :run_tests
if "%1"=="build" goto :build_app
if "%1"=="docker" goto :build_docker
if "%1"=="run" goto :run_docker
if "%1"=="deploy" goto :deploy_production
if "%1"=="compose" goto :deploy_compose
if "%1"=="stop" goto :stop_container
if "%1"=="health" goto :health_check
if "%1"=="cleanup" goto :cleanup
if "%1"=="help" goto :show_help
if "%1"=="--help" goto :show_help
if "%1"=="-h" goto :show_help

call :error "Unknown command: %1"


