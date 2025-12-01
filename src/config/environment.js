const config = {
  app: {
    debug: process.env.VUE_APP_DEBUG === 'true',
    env: process.env.NODE_ENV || 'development'
  },

  api: {
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
    timeout: 30000
  },

  stripe: {
    publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY || '',
    isTestMode: (process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY || '').startsWith('pk_test_')
  }
};

const validateConfig = () => {
  const errors = [];

  if (!config.api.baseURL) {
    errors.push('VUE_APP_API_BASE_URL is not set');
  }

  if (!config.stripe.publishableKey) {
    errors.push('VUE_APP_STRIPE_PUBLISHABLE_KEY is not set');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration Errors:', errors);
  }

  return errors.length === 0;
};

if (config.app.debug) {
  console.log('📋 Application Configuration:');
  console.log('  Environment:', config.app.env);
  console.log('  API Base URL:', config.api.baseURL);
  console.log('  Stripe Mode:', config.stripe.isTestMode ? 'TEST' : 'LIVE');
  
  const isValid = validateConfig();
  console.log('  Config Valid:', isValid ? '✓' : '✗');
}

export default config;

