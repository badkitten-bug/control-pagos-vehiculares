#!/bin/bash

# ===========================================
# Deploy Script for Control Pagos Vehiculares
# ===========================================

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available. Please install Docker Compose.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Create data directory for SQLite
if [ ! -d "./data" ]; then
    echo -e "${YELLOW}📁 Creating data directory...${NC}"
    mkdir -p ./data
fi

# Stop existing containers if running
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose down 2>/dev/null || true

# Build and start containers
echo -e "${YELLOW}🔨 Building and starting containers...${NC}"
docker compose up -d --build

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check if containers are running
echo -e "${YELLOW}🔍 Checking container status...${NC}"
docker compose ps

# Show logs
echo -e "${YELLOW}📝 Recent logs:${NC}"
docker compose logs --tail=20

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://161.132.40.223${NC}"
echo -e "API:      ${GREEN}http://161.132.40.223/api${NC}"
echo ""
echo -e "Or use the hostname:"
echo -e "Frontend: ${GREEN}http://sv-gGbrDIE0BxoM6dAKh5SW.cloud.elastika.pe${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  docker compose logs -f     # View live logs"
echo "  docker compose ps          # Check status"
echo "  docker compose down        # Stop all services"
echo "  docker compose restart     # Restart all services"
