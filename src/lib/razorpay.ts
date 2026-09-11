import Razorpay from 'razorpay';

let _razorpay: Razorpay | null = null;
let _cachedKeyId: string | null = null;
let _cachedKeySecret: string | null = null;

export function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env.local');
  }
  if (_razorpay && _cachedKeyId === keyId && _cachedKeySecret === keySecret) {
    return _razorpay;
  }
  _cachedKeyId = keyId;
  _cachedKeySecret = keySecret;
  _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _razorpay;
}

export const razorpay = {
  get orders() { return getRazorpay().orders; },
  get payments() { return getRazorpay().payments; },
};
