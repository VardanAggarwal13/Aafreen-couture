'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, ShoppingBag, Mail, Lock, User, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { siteConfig } from '@/config/site.config';
import { ROUTES } from '@/constants/routes';
import { AuthShowcase } from '../AuthShowcase';
import {
  AUTH_WRAP,
  AUTH_CARD,
  AUTH_PANEL,
  AUTH_FORM_WIDTH,
  AUTH_MODE_SWITCH,
  AUTH_MODE_ACTIVE,
  AUTH_MODE_LINK,
  AUTH_TITLE,
  AUTH_SUBTITLE,
  AUTH_LABEL,
  AUTH_INPUT,
  AUTH_INPUT_OK,
  AUTH_INPUT_ERR,
  AUTH_FIELD_ICON,
  AUTH_ERROR,
  AUTH_SUBMIT,
  AUTH_DIVIDER,
  AUTH_GOOGLE,
  AUTH_SWITCH_NOTE,
  AUTH_SWITCH_LINK,
} from '../auth-styles';

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

  const inputClass = (hasError: boolean) => `${AUTH_INPUT} ${hasError ? AUTH_INPUT_ERR : AUTH_INPUT_OK}`;

  return (
    <div className={AUTH_WRAP}>
      <div className={AUTH_CARD}>
        <AuthShowcase variant="register" />

        <div className={AUTH_PANEL}>
          <div className={AUTH_FORM_WIDTH}>
            {/* Mode switch */}
            <div className={AUTH_MODE_SWITCH}>
              <Link href={loginHref} className={AUTH_MODE_LINK}>
                Sign In
              </Link>
              <span aria-current="page" className={AUTH_MODE_ACTIVE}>
                Create Account
              </span>
            </div>

            <h1 className={AUTH_TITLE}>Create your account</h1>
            <p className={AUTH_SUBTITLE}>
              Join Aafreen Couture to enjoy personalized bridal consultations and effortless ordering.
            </p>

            {isCheckoutRedirect && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-surface/60 p-3.5">
                <ShoppingBag size="1.125rem" className="mt-0.5 shrink-0 text-gold-ink" />
                <div>
                  <p className="text-xs font-semibold text-heading">Complete your couture order</p>
                  <p className="mt-0.5 text-xs leading-snug text-text">
                    Create your account to continue to checkout and reserve your selected pieces.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 [@media(max-height:48rem)]:gap-2 [@media(max-height:48rem)]:mt-2"
            >
              {/* Full name */}
              <div>
                <label htmlFor="name" className={AUTH_LABEL}>
                  Full name
                </label>
                <div className="relative">
                  <User size="1.0625rem" aria-hidden="true" className={AUTH_FIELD_ICON} />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Priya Sharma"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    {...register('name')}
                    className={inputClass(!!errors.name)}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" role="alert" className={AUTH_ERROR}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Contact number */}
              <div>
                <label htmlFor="phone" className={AUTH_LABEL}>
                  Contact number <span className="font-normal text-text">(optional)</span>
                </label>
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 border-r border-border pr-2.5 text-sm text-text"
                  >
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="9876543210"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    {...register('phone')}
                    className={`${inputClass(!!errors.phone)} !pl-16`}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" role="alert" className={AUTH_ERROR}>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label htmlFor="email" className={AUTH_LABEL}>
                  Email address
                </label>
                <div className="relative">
                  <Mail size="1.0625rem" aria-hidden="true" className={AUTH_FIELD_ICON} />
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="name@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                    className={inputClass(!!errors.email)}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className={AUTH_ERROR}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={AUTH_LABEL}>
                  Password
                </label>
                <div className="relative">
                  <Lock size="1.0625rem" aria-hidden="true" className={AUTH_FIELD_ICON} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password')}
                    className={`${inputClass(!!errors.password)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-text transition-colors hover:text-heading"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size="1.0625rem" /> : <Eye size="1.0625rem" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className={AUTH_ERROR}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className={AUTH_LABEL}>
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size="1.0625rem" aria-hidden="true" className={AUTH_FIELD_ICON} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                    {...register('confirmPassword')}
                    className={`${inputClass(!!errors.confirmPassword)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-text transition-colors hover:text-heading"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff size="1.0625rem" /> : <Eye size="1.0625rem" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-error" role="alert" className={AUTH_ERROR}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className={`${AUTH_SUBMIT} mt-1 sm:col-span-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size="1rem" className="animate-spin" aria-hidden="true" />
                    <span>Creating your account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size="0.9375rem" className="text-[#C49A5A] transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className={AUTH_DIVIDER}>
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <button type="button" onClick={signInWithGoogle} disabled={isLoading} className={AUTH_GOOGLE}>
              <svg className="h-[1.0625rem] w-[1.0625rem] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className={AUTH_SWITCH_NOTE}>
              Already have an account?{' '}
              <Link href={loginHref} className={AUTH_SWITCH_LINK}>
                Sign in
              </Link>
            </p>

            <p className="mt-3 [@media(max-height:48rem)]:mt-2.5 text-center text-xs text-text/80">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-heading hover:underline">Terms &amp; Conditions</Link> and{' '}
              <Link href="/privacy-policy" className="text-heading hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
