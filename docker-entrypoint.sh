#!/bin/sh
set -e

cat > /usr/share/nginx/html/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  VUE_APP_API_BASE_URL: "${VUE_APP_API_BASE_URL:-http://localhost:8080/api/v1}",
  VUE_APP_STRIPE_PUBLISHABLE_KEY: "${VUE_APP_STRIPE_PUBLISHABLE_KEY:-}",
  VUE_APP_DEBUG: "${VUE_APP_DEBUG:-false}"
};
EOF

echo "✅ Runtime configuration generated:"
echo "   API Base URL: ${VUE_APP_API_BASE_URL:-http://localhost:8080/api/v1}"
echo "   Stripe Key: ${VUE_APP_STRIPE_PUBLISHABLE_KEY:-[not set]}"
echo "   Debug: ${VUE_APP_DEBUG:-false}"

exec "$@"

