'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, ShoppingBag, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
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
  AUTH_FIELD_ICON,
  AUTH_SUBMIT,
  AUTH_DIVIDER,
  AUTH_GOOGLE,
  AUTH_SWITCH_NOTE,
  AUTH_SWITCH_LINK,
} from '../auth-styles';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Please enter your email address').email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
  rememberMe: z.boolean(),
});

type LoginInput = z.infer<typeof loginSchema>;

interface LoginFormProps {
  initialRedirect?: string;
}

/**
 * Only same-site paths are allowed as a post-login destination. The path must start with a single
 * "/" (so "//evil.com" and "/\evil.com", which browsers treat as another host, are rejected).
 */
function safeRedirectPath(raw?: string | null): string | null {
  if (!raw || !/^\/(?![/\\])/.test(raw) || raw === '/dashboard') return null;
  return raw;
}

const inputBase = AUTH_INPUT;

export function LoginForm({ initialRedirect }: LoginFormProps = {}) {
  const router = useRouter();
  const [redirect, setRedirect] = useState<string>(() => safeRedirectPath(initialRedirect) ?? ROUTES.HOME);

  useEffect(() => {
    const fromUrl = safeRedirectPath(new URLSearchParams(window.location.search).get('redirect'));
    if (fromUrl) setRedirect(fromUrl);
  }, []);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      const role = (session.user as { role?: string })?.role;
      const email = session.user.email?.toLowerCase();
      const isAdmin = role === 'admin' || email === 'vardanaggarwal13@gmail.com';
      const targetUrl = (isAdmin && (!redirect || redirect === ROUTES.HOME || redirect === '/orders'))
        ? '/admin'
        : redirect;
      router.replace(targetUrl);
    }
  }, [session, isPending, redirect, router]);

  const isCheckoutRedirect = redirect === ROUTES.CHECKOUT || redirect.startsWith(`${ROUTES.CHECKOUT}?`);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  // Focus the email field on devices with a real pointer; on phones it would pop the keyboard unasked.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setFocus('email');
  }, [setFocus]);

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setFormError(null);
    try {
      const result = await authClient.signIn.email({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.error) {
        setFormError(result.error.message ?? 'That email and password do not match. Please try again.');
      } else {
        toast.success('Welcome back to Aafreen Couture!');
        const user = result.data?.user as { role?: string; email?: string } | undefined;
        const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'vardanaggarwal13@gmail.com';
        const targetUrl = (isAdmin && (!redirect || redirect === ROUTES.HOME || redirect === '/orders'))
          ? '/admin'
          : redirect;
        router.push(targetUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong while signing in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    setFormError(null);
    try {
      await authClient.signIn.social({ provider: 'google', callbackURL: redirect });
    } catch {
      toast.info('Google sign-in is not available right now. Please sign in with your email and password.');
      setIsGoogleLoading(false);
    }
  }

  const registerHref =
    redirect && redirect !== ROUTES.HOME
      ? `${ROUTES.REGISTER}?redirect=${encodeURIComponent(redirect)}`
      : ROUTES.REGISTER;

  const busy = isLoading || isGoogleLoading;

  return (
    <div className={AUTH_WRAP}>
      <div className={AUTH_CARD}>
        <AuthShowcase variant="login" />

        <div className={AUTH_PANEL}>
          <div className={AUTH_FORM_WIDTH}>
            {/* Mode switch */}
            <div className={AUTH_MODE_SWITCH}>
              <span aria-current="page" className={AUTH_MODE_ACTIVE}>
                Sign In
              </span>
              <Link href={registerHref} className={AUTH_MODE_LINK}>
                Create Account
              </Link>
            </div>

            <h1 className={AUTH_TITLE}>Welcome back</h1>
            <p className={AUTH_SUBTITLE}>
              Sign in to see your orders and saved addresses.
            </p>

            {isCheckoutRedirect && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-surface/60 p-3.5">
                <ShoppingBag size="1.125rem" className="mt-0.5 shrink-0 text-gold-ink" />
                <div>
                  <p className="text-xs font-semibold text-heading">Complete your couture order</p>
                  <p className="mt-0.5 text-[0.75rem] leading-snug text-text">
                    Sign in to continue to checkout and reserve your selected pieces.
                  </p>
                </div>
              </div>
            )}

            {formError && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm leading-snug text-red-800">
                <AlertCircle size="1.0625rem" className="mt-px shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5 [@media(max-height:48rem)]:space-y-2.5 [@media(max-height:48rem)]:mt-3">
              {/* Email */}
              <div>
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
                    className={`${inputBase} ${errors.email ? 'border-red-400' : 'border-heading/20 focus:border-gold'}`}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-[0.75rem] text-red-700">
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
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : capsLock ? 'caps-hint' : undefined}
                    {...register('password')}
                    onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                    onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                    className={`${inputBase} pr-12 ${errors.password ? 'border-red-400' : 'border-heading/20 focus:border-gold'}`}
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
                  <p id="password-error" role="alert" className="mt-1.5 text-[0.75rem] text-red-700">
                    {errors.password.message}
                  </p>
                )}
                {capsLock && !errors.password && (
                  <p id="caps-hint" className="mt-1.5 text-[0.75rem] text-amber-800">
                    Caps Lock is on
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
                  <input type="checkbox" {...register('rememberMe')} className="h-4 w-4 cursor-pointer rounded border-heading/30 accent-[#2E221C]" />
                  Keep me signed in
                </label>
                <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm font-medium text-gold-ink underline-offset-2 transition-colors hover:text-heading hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={busy}
                aria-busy={isLoading}
                className={AUTH_SUBMIT}
              >
                {isLoading ? (
                  <>
                    <Loader2 size="1rem" className="animate-spin" aria-hidden="true" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
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

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={busy}
              className={AUTH_GOOGLE}
            >
              {isGoogleLoading ? (
                <Loader2 size="1.0625rem" className="animate-spin" aria-hidden="true" />
              ) : (
                <svg className="h-[1.0625rem] w-[1.0625rem] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <p className={AUTH_SWITCH_NOTE}>
              New to Aafreen Couture?{' '}
              <Link href={registerHref} className={AUTH_SWITCH_LINK}>
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
