import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('⚠️ Stripe publishable key not found in environment variables!');
  console.error('Please set VUE_APP_STRIPE_PUBLISHABLE_KEY in your .env file');
} else if (process.env.VUE_APP_DEBUG === 'true') {
  console.log('✓ Stripe Configuration:', {
    keyPrefix: STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...',
    mode: STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_') ? 'TEST' : 'LIVE'
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

