import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory (secret gift/)
dotenv.config({ path: join(__dirname, '../../.env') });

// Validate environment variables
const key_id = process.env.VITE_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.error('❌ RAZORPAY CONFIGURATION ERROR:');
  console.error('Missing environment variables:');
  if (!key_id) console.error('  - VITE_RAZORPAY_KEY_ID is not set');
  if (!key_secret) console.error('  - RAZORPAY_KEY_SECRET is not set');
  console.error('\nPlease add these to your Render dashboard:');
  console.error('https://dashboard.render.com → Select your service → Environment');
}

// Initialize Razorpay (will be null if keys missing)
const razorpay = (key_id && key_secret) ? new Razorpay({
  key_id,
  key_secret,
}) : null;

if (razorpay) {
  console.log('✅ Razorpay initialized successfully');
}

export default razorpay;
