#!/bin/bash

# Script to start MyQU SSO, QUAI, and QSPARK servers
# تشغيل خوادم MyQU SSO و QUAI و QSPARK

echo "🚀 Starting MyQU SSO, QUAI, and QSPARK servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MyQU SSO directory exists
MYQU_PATH="/Users/wesam../Downloads/QU_Projects/myqu-sso"
if [ ! -d "$MYQU_PATH" ]; then
    echo -e "${YELLOW}⚠️  Warning: MyQU SSO directory not found at $MYQU_PATH${NC}"
    echo "Please update the MYQU_PATH variable in this script."
    exit 1
fi

# QSPARK lives as a sibling sub-app inside this repo (./QSPARK).
QSPARK_PATH="$(cd "$(dirname "$0")" && pwd)/QSPARK"
if [ ! -d "$QSPARK_PATH" ]; then
    echo -e "${YELLOW}⚠️  Warning: QSPARK directory not found at $QSPARK_PATH${NC}"
    echo "QSPARK will be skipped."
fi

# Function to start MyQU SSO
start_myqu() {
    echo -e "${BLUE}📡 Starting MyQU SSO on port 8000...${NC}"
    cd "$MYQU_PATH"
    php artisan serve --port=8000 &
    MYQU_PID=$!
    echo -e "${GREEN}✅ MyQU SSO started (PID: $MYQU_PID)${NC}"
    echo ""
}

# Function to start QUAI
start_quai() {
    echo -e "${BLUE}🤖 Starting QUAI on port 8007...${NC}"
    cd "$(dirname "$0")"
    php artisan serve --port=8007 &
    QUAI_PID=$!
    echo -e "${GREEN}✅ QUAI started (PID: $QUAI_PID)${NC}"
    echo ""
}

# Function to start QSPARK (standalone demo)
start_qspark() {
    if [ ! -d "$QSPARK_PATH" ]; then
        return
    fi
    echo -e "${BLUE}⚡ Starting QSPARK on port 8001...${NC}"
    cd "$QSPARK_PATH"
    php artisan serve --port=8001 &
    QSPARK_PID=$!
    echo -e "${GREEN}✅ QSPARK started (PID: $QSPARK_PID)${NC}"
    echo ""
}

# Start all servers
start_myqu
sleep 2
start_quai
sleep 2
start_qspark

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All servers are running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📍 MyQU SSO:${NC}  http://127.0.0.1:8000"
echo -e "${BLUE}📍 QUAI:${NC}      http://127.0.0.1:8007"
echo -e "${BLUE}📍 QSPARK:${NC}    http://127.0.0.1:8001"
echo ""
echo -e "${YELLOW}🔐 Login URL:${NC} http://127.0.0.1:8007/saml/myqulocal/login"
echo -e "${YELLOW}🏠 Home URL:${NC}  http://127.0.0.1:8007"
echo -e "${YELLOW}⚡ QSPARK Demo Login:${NC} http://127.0.0.1:8001/login (demo_student / demo_faculty / demo_admin, pwd: demo1234)"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Press Ctrl+C to stop all servers..."
echo ""

# Wait for user to press Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill \$MYQU_PID \$QUAI_PID \$QSPARK_PID 2>/dev/null; echo 'Servers stopped.'; exit 0" INT

# Keep script running
wait

