'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { siteConfig } from '@/config/site.config';
import { ROUTES } from '@/constants/routes';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? ROUTES.DASHBOARD;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message ?? 'Invalid email or password. Please try again.');
      } else {
        toast.success('Welcome back to Aafreen Couture!');
        router.push(redirect);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      await authClient.signIn.social({ provider: 'google', callbackURL: redirect });
    } catch {
      toast.info('Google sign-in is undergoing scheduled verification. Please sign in with email and password.');
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href={ROUTES.HOME} className="inline-block transition-transform hover:scale-102">
            <Image
              src="/images/logo-header.webp"
              alt={siteConfig.name}
              width={200}
              height={95}
              className="h-12 w-auto mx-auto object-contain"
              priority
            />
          </Link>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold mt-3">
            Atelier Sign In
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#E8D8C8] p-7 sm:p-9 shadow-xs rounded-xs">
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-[#221617]">Welcome Back</h1>
            <p className="text-xs text-[#6E6A66] mt-1 font-sans">
              Sign in to manage your orders, saved addresses, and bridal consultations.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full border border-[#E8D8C8] px-3.5 py-2.5 text-xs text-[#221617] placeholder-[#6E6A66]/50 focus:outline-none focus:border-[#A67C52] transition-colors bg-[#FAF7F2]/40 rounded-xs"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-[#221617]">
                  Password
                </label>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-[11px] text-[#A67C52] hover:text-[#221617] transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full border border-[#E8D8C8] px-3.5 py-2.5 pr-10 text-xs text-[#221617] placeholder-[#6E6A66]/50 focus:outline-none focus:border-[#A67C52] transition-colors bg-[#FAF7F2]/40 rounded-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A66] hover:text-[#221617] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#221617] text-white py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#A67C52] transition-colors disabled:opacity-50 mt-4 rounded-xs shadow-xs flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Signing in…' : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8D8C8]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-white px-3 text-[#6E6A66]">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full border border-[#E8D8C8] py-2.5 text-xs text-[#221617] hover:border-[#A67C52] hover:bg-[#FAF7F2]/40 transition-colors flex items-center justify-center gap-2 rounded-xs font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 pt-5 border-t border-[#E8D8C8] text-center">
            <p className="text-xs text-[#6E6A66]">
              Don&apos;t have an account yet?{' '}
              <Link
                href={redirect ? `${ROUTES.REGISTER}?redirect=${encodeURIComponent(redirect)}` : ROUTES.REGISTER}
                className="text-[#A67C52] font-semibold hover:text-[#221617] transition-colors uppercase tracking-wider text-[11px]"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[#6E6A66]">
            <ShieldCheck size={14} className="text-[#A67C52]" />
            <span>Secure 256-Bit SSL Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
