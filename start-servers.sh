#!/bin/bash

# Script to start both MyQU SSO and QUAI servers
# تشغيل خوادم MyQU SSO و QUAI

echo "🚀 Starting MyQU SSO and QUAI servers..."
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

# Start both servers
start_myqu
sleep 2
start_quai

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📍 MyQU SSO:${NC}  http://127.0.0.1:8000"
echo -e "${BLUE}📍 QUAI:${NC}      http://127.0.0.1:8007"
echo ""
echo -e "${YELLOW}🔐 Login URL:${NC} http://127.0.0.1:8007/saml/myqulocal/login"
echo -e "${YELLOW}🏠 Home URL:${NC}  http://127.0.0.1:8007"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Press Ctrl+C to stop both servers..."
echo ""

# Wait for user to press Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $MYQU_PID $QUAI_PID 2>/dev/null; echo 'Servers stopped.'; exit 0" INT

# Keep script running
wait

