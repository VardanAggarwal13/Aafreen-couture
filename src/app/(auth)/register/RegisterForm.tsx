'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck, ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { siteConfig } from '@/config/site.config';
import { ROUTES } from '@/constants/routes';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
      .or(z.literal(''))
      .optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  initialRedirect?: string;
}

export function RegisterForm({ initialRedirect }: RegisterFormProps = {}) {
  const router = useRouter();
  const [redirect, setRedirect] = useState<string>(() => {
    if (
      initialRedirect &&
      initialRedirect.startsWith('/') &&
      !initialRedirect.startsWith('//') &&
      initialRedirect !== '/dashboard'
    ) {
      return initialRedirect;
    }
    return ROUTES.HOME;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const r = sp.get('redirect');
      if (r && r.startsWith('/') && !r.startsWith('//') && r !== '/dashboard') {
        setRedirect(r);
      }
    }
  }, []);

  const isCheckoutRedirect = redirect === ROUTES.CHECKOUT || redirect.startsWith(`${ROUTES.CHECKOUT}?`);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      // 1. Create account with Better-Auth
      const result = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message ?? 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // 2. Save phone number if provided
      if (data.phone) {
        try {
          await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: data.phone }),
          });
        } catch {
          // Non-blocking
        }
      }

      toast.success(`Welcome to ${siteConfig.name}, ${data.name.split(' ')[0]}!`);
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      await authClient.signIn.social({ provider: 'google', callbackURL: redirect });
    } catch {
      toast.info('Google registration is undergoing scheduled verification. Please sign up with email.');
    }
  }

  const loginHref =
    redirect && redirect !== ROUTES.HOME
      ? `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`
      : ROUTES.LOGIN;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-5xl bg-surface border border-border shadow-lg rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: High-Fashion Editorial Imagery (Desktop) */}
        <div className="relative lg:col-span-5 hidden lg:flex flex-col justify-between p-8 xl:p-10 text-white overflow-hidden bg-heading">
          {/* Background Couture Photo */}
          <Image
            src="/images/products/meherbaan-rani-pink-bridal-lehenga-1011.webp"
            alt="Aafreen Couture Haute Bridal"
            fill
            sizes="45vw"
            priority
            className="object-cover object-top filter brightness-90"
          />

          {/* Luxury Gradient Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

          {/* Top Atelier Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md border border-gold/40 rounded-xs text-[10px] uppercase tracking-[0.25em] text-[#E0C088]">
              <Sparkles size={11} className="text-gold" />
              <span>Atelier Membership</span>
            </div>
          </div>

          {/* Middle Editorial Typography & Privileges */}
          <div className="relative z-10 space-y-4 my-auto py-6">
            <h2 className="font-serif text-2xl xl:text-3xl font-medium leading-tight text-[#FAF5ED]">
              Begin Your Bespoke Couture Journey
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Create your atelier account to archive bespoke bridal measurements, track hand-embroidery progress, and unlock personalized stylist appointments.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <span className="w-4 h-4 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-gold" />
                </span>
                <span>Archive Sizing & Custom Blouse Measurements</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <span className="w-4 h-4 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-gold" />
                </span>
                <span>Multiple Saved Delivery Addresses & Expedited Checkout</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <span className="w-4 h-4 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-gold" />
                </span>
                <span>Early Invitations to New Collection Unveilings</span>
              </div>
            </div>
          </div>

          {/* Bottom Royal Seal */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <p className="font-serif italic text-xs text-[#E0C088]">
              &ldquo;Crafted with devotion for your most memorable occasions.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Side: Exclusive Registration Portal */}
        <div className="lg:col-span-7 p-6 sm:p-10 xl:p-12 flex flex-col justify-center bg-surface">
          <div className="max-w-md w-full mx-auto">
            {/* Tab Navigation Header */}
            <div className="flex items-center gap-8 border-b border-border/80 pb-3 mb-6">
              <Link
                href={loginHref}
                className="font-serif text-lg sm:text-xl text-text/60 hover:text-heading transition-colors tracking-wide"
              >
                Sign In
              </Link>
              <div className="relative">
                <span className="font-serif text-lg sm:text-xl font-semibold text-heading tracking-wide">
                  Create Account
                </span>
                <span className="absolute -bottom-3.5 left-0 right-0 h-[2.5px] bg-gold" />
              </div>
            </div>

            <p className="text-xs text-text mb-6 font-sans">
              Join Aafreen Couture to enjoy personalized bridal consultations and effortless ordering.
            </p>

            {/* Checkout Notification */}
            {isCheckoutRedirect && (
              <div className="mb-6 p-3.5 bg-background border border-gold/50 rounded-xs flex items-center gap-3">
                <ShoppingBag size={18} className="text-gold shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-heading">Complete Your Couture Order</p>
                  <p className="text-[11px] text-text leading-tight mt-0.5">
                    Create your account to proceed to checkout and secure your selected couture items.
                  </p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  className="w-full border border-border px-3.5 py-2.5 text-xs text-heading placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors bg-background/50 rounded-xs"
                  placeholder="e.g. Priya Sharma"
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full border border-border px-3.5 py-2.5 text-xs text-heading placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors bg-background/50 rounded-xs"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-wider text-heading">
                    Contact Number
                  </label>
                  <span className="text-[10px] text-gold font-medium">For Courier & Dispatch</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text font-medium border-r border-border pr-2">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={10}
                    {...register('phone')}
                    className="w-full border border-border pl-14 pr-3.5 py-2.5 text-xs text-heading placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors bg-background/50 rounded-xs"
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className="w-full border border-border px-3.5 py-2.5 pr-10 text-xs text-heading placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors bg-background/50 rounded-xs"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-heading transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className="w-full border border-border px-3.5 py-2.5 pr-10 text-xs text-heading placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors bg-background/50 rounded-xs"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-heading transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-heading text-surface py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold transition-colors duration-300 disabled:opacity-50 rounded-xs shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isLoading ? (
                    <span>Creating Atelier Account…</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-gold" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Social Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-surface px-3 text-text/70">Or continue with</span>
              </div>
            </div>

            {/* Google Social Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full border border-border py-2.5 text-xs text-heading hover:border-gold hover:bg-background/50 transition-colors flex items-center justify-center gap-2 rounded-xs font-medium cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom Switch Note */}
            <div className="mt-6 pt-5 border-t border-border/80 text-center">
              <p className="text-xs text-text">
                Already have an Atelier account?{' '}
                <Link
                  href={loginHref}
                  className="text-gold font-semibold hover:text-heading transition-colors uppercase tracking-wider text-[11px]"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Terms notice */}
            <p className="text-center text-[10px] text-text/70 mt-3 font-sans">
              By registering, you agree to our{' '}
              <Link href="/terms" className="hover:underline text-heading">Terms & Conditions</Link> and{' '}
              <Link href="/privacy-policy" className="hover:underline text-heading">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
