#!/bin/bash

# MyQU SSO Integration Setup Script
# This script helps set up the MyQU SSO integration for QUAI project

set -e

echo "=========================================="
echo "MyQU SSO Integration Setup for QUAI"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    print_error "Error: artisan file not found. Please run this script from the QUAI project root."
    exit 1
fi

print_success "Found Laravel project"

# Step 1: Install SAML package
echo ""
echo "Step 1: Installing OneLogin PHP SAML package..."
if composer require onelogin/php-saml --no-interaction; then
    print_success "SAML package installed successfully"
else
    print_error "Failed to install SAML package"
    exit 1
fi

# Step 2: Create migration
echo ""
echo "Step 2: Creating database migration..."
php artisan make:migration add_sso_fields_to_users_table --quiet

# Find the migration file
MIGRATION_FILE=$(ls -t database/migrations/*add_sso_fields_to_users_table.php 2>/dev/null | head -1)

if [ -n "$MIGRATION_FILE" ]; then
    print_success "Migration file created: $MIGRATION_FILE"
    
    # Add migration content
    cat > "$MIGRATION_FILE" << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('id');
            $table->string('employee_id')->nullable()->after('username');
            $table->string('identity')->nullable()->after('employee_id');
            $table->string('mobile')->nullable()->after('identity');
            $table->string('user_type')->nullable()->after('mobile');
            $table->string('saml_id')->nullable()->unique()->after('user_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'employee_id', 'identity', 'mobile', 'user_type', 'saml_id']);
        });
    }
};
EOF
    print_success "Migration content added"
else
    print_warning "Migration file not found, you may need to create it manually"
fi

# Step 3: Create SAML Controller directory
echo ""
echo "Step 3: Creating Auth directory..."
mkdir -p app/Http/Controllers/Auth
print_success "Auth directory created"

# Step 4: Create Middleware directory
echo ""
echo "Step 4: Creating Middleware..."
mkdir -p app/Http/Middleware
print_success "Middleware directory ready"

# Step 5: Update .env file
echo ""
echo "Step 5: Updating .env file..."

if [ -f ".env" ]; then
    # Check if SAML config already exists
    if grep -q "MYQU_SSO_URL" .env; then
        print_warning "SAML configuration already exists in .env"
    else
        cat >> .env << 'EOF'

# MyQU SSO Configuration
MYQU_SSO_URL=http://127.0.0.1:8001
MYQU_SSO_ENTITY_ID=http://127.0.0.1:8001/saml/metadata
MYQU_SSO_LOGIN_URL=http://127.0.0.1:8001/unified-login
MYQU_SSO_LOGOUT_URL=http://127.0.0.1:8001/saml/logout
MYQU_SSO_CERT=""

# QUAI Service Provider Configuration (update for production)
SAML_SP_ENTITY_ID=http://localhost:8000
SAML_SP_ACS_URL=http://localhost:8000/saml/acs
SAML_SP_SLS_URL=http://localhost:8000/saml/sls
EOF
        print_success "SAML configuration added to .env"
    fi
else
    print_error ".env file not found"
    exit 1
fi

# Step 6: Summary
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
print_info "Next steps:"
echo "1. Review and customize the migration file: $MIGRATION_FILE"
echo "2. Run: php artisan migrate"
echo "3. Create SamlController.php in app/Http/Controllers/Auth/"
echo "4. Create EnsureSamlAuthenticated.php in app/Http/Middleware/"
echo "5. Update routes/web.php with SAML routes"
echo "6. Update config/services.php with SAML configuration"
echo "7. Update app/Models/User.php with new fillable fields"
echo "8. Obtain X.509 certificate from MyQU SSO team"
echo "9. Update MYQU_SSO_CERT in .env with the certificate"
echo "10. Test the integration"
echo ""
print_info "Refer to MYQU_SSO_INTEGRATION_GUIDE.md for detailed instructions"
echo ""
print_success "Setup script completed successfully!"

