#!/bin/bash

# SEO Testing and Validation Script for TCIOE Frontend

echo "🔍 TCIOE Frontend SEO Testing & Validation"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
echo -e "\n${BLUE}1. Checking Environment Configuration...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local file exists${NC}"
    
    # Check for required variables
    if grep -q "NEXT_PUBLIC_BASE_URL" .env.local; then
        echo -e "${GREEN}✓ NEXT_PUBLIC_BASE_URL is set${NC}"
    else
        echo -e "${RED}✗ NEXT_PUBLIC_BASE_URL is missing${NC}"
    fi
    
    if grep -q "GOOGLE_VERIFICATION_ID" .env.local; then
        echo -e "${GREEN}✓ GOOGLE_VERIFICATION_ID is set${NC}"
    else
        echo -e "${YELLOW}⚠ GOOGLE_VERIFICATION_ID is missing (optional for local dev)${NC}"
    fi
else
    echo -e "${RED}✗ .env.local file not found${NC}"
    echo -e "${YELLOW}  Create it by copying .env.example: cp .env.example .env.local${NC}"
fi

# Check if required SEO files exist
echo -e "\n${BLUE}2. Checking SEO Files...${NC}"
seo_files=(
    "app/sitemap.ts"
    "app/robots.ts"
    "lib/seo.ts"
    "components/SEO.tsx"
    "components/StructuredData.tsx"
    "public/manifest.json"
)

for file in "${seo_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file is missing${NC}"
    fi
done

# Build the project to check for errors
echo -e "\n${BLUE}3. Building Project (SEO validation)...${NC}"
if npm run build > build.log 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
    rm build.log
else
    echo -e "${RED}✗ Build failed. Check build.log for details${NC}"
    echo "Last 10 lines of build log:"
    tail -n 10 build.log
fi

# Start the development server in background for testing
echo -e "\n${BLUE}4. Starting Development Server for Testing...${NC}"
npm run dev > dev.log 2>&1 &
DEV_PID=$!
echo "Development server PID: $DEV_PID"

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Test endpoints
echo -e "\n${BLUE}5. Testing SEO Endpoints...${NC}"
BASE_URL="http://localhost:3000"

endpoints=(
    "/sitemap.xml"
    "/robots.txt"
    "/"
    "/about"
    "/departments/civil"
)

for endpoint in "${endpoints[@]}"; do
    if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" | grep -q "200"; then
        echo -e "${GREEN}✓ $endpoint is accessible${NC}"
    else
        echo -e "${RED}✗ $endpoint returned error${NC}"
    fi
done

# Test sitemap.xml content
echo -e "\n${BLUE}6. Validating Sitemap Content...${NC}"
if curl -s "$BASE_URL/sitemap.xml" | grep -q "<urlset"; then
    echo -e "${GREEN}✓ Sitemap.xml contains valid XML${NC}"
    SITEMAP_URLS=$(curl -s "$BASE_URL/sitemap.xml" | grep -c "<url>")
    echo -e "${GREEN}✓ Sitemap contains $SITEMAP_URLS URLs${NC}"
else
    echo -e "${RED}✗ Sitemap.xml is invalid or empty${NC}"
fi

# Test robots.txt content
echo -e "\n${BLUE}7. Validating Robots.txt...${NC}"
if curl -s "$BASE_URL/robots.txt" | grep -q "User-agent"; then
    echo -e "${GREEN}✓ Robots.txt contains valid directives${NC}"
    if curl -s "$BASE_URL/robots.txt" | grep -q "Sitemap:"; then
        echo -e "${GREEN}✓ Robots.txt references sitemap${NC}"
    else
        echo -e "${YELLOW}⚠ Robots.txt doesn't reference sitemap${NC}"
    fi
else
    echo -e "${RED}✗ Robots.txt is invalid or empty${NC}"
fi

# Test meta tags on homepage
echo -e "\n${BLUE}8. Testing Meta Tags on Homepage...${NC}"
HOMEPAGE_HTML=$(curl -s "$BASE_URL/")

if echo "$HOMEPAGE_HTML" | grep -q "<title>"; then
    TITLE=$(echo "$HOMEPAGE_HTML" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
    echo -e "${GREEN}✓ Title tag found: ${NC}$TITLE"
else
    echo -e "${RED}✗ Title tag missing${NC}"
fi

if echo "$HOMEPAGE_HTML" | grep -q 'name="description"'; then
    echo -e "${GREEN}✓ Meta description found${NC}"
else
    echo -e "${RED}✗ Meta description missing${NC}"
fi

if echo "$HOMEPAGE_HTML" | grep -q 'property="og:title"'; then
    echo -e "${GREEN}✓ Open Graph tags found${NC}"
else
    echo -e "${RED}✗ Open Graph tags missing${NC}"
fi

if echo "$HOMEPAGE_HTML" | grep -q 'application/ld+json'; then
    echo -e "${GREEN}✓ Structured data found${NC}"
else
    echo -e "${RED}✗ Structured data missing${NC}"
fi

# Cleanup
echo -e "\n${BLUE}9. Cleaning up...${NC}"
kill $DEV_PID 2>/dev/null
rm -f dev.log

echo -e "\n${GREEN}SEO Testing Complete!${NC}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Fix any issues found above"
echo "2. Set up your verification codes in .env.local"
echo "3. Deploy to production"
echo "4. Submit sitemap to search consoles"
echo "5. Monitor search performance"

echo -e "\n${BLUE}Useful Commands:${NC}"
echo "- Test sitemap: curl http://localhost:3000/sitemap.xml"
echo "- Test robots: curl http://localhost:3000/robots.txt"
echo "- Validate HTML: curl -s http://localhost:3000/ | grep -E '<title>|<meta.*description|og:'"
echo "- Check build: npm run build"
