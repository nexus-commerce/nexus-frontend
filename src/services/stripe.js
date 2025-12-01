import { loadStripe } from '@stripe/stripe-js';
import config from '../config/environment';

const STRIPE_PUBLISHABLE_KEY = config.stripe.publishableKey;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('⚠️ Stripe publishable key not found in environment variables!');
  console.error('Please set VUE_APP_STRIPE_PUBLISHABLE_KEY in your environment');
} else if (config.app.debug) {
  console.log('✓ Stripe Configuration:', {
    keyPrefix: STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...',
    mode: config.stripe.isTestMode ? 'TEST' : 'LIVE'
  });
}

let stripePromise;

export const getStripe = () => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default getStripe;

