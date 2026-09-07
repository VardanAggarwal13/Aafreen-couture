'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? ROUTES.DASHBOARD;

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
      // Direct user straight to intended destination (e.g. checkout or dashboard)
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8D8C8] rounded-full text-[11px] font-medium text-[#A67C52] tracking-wider uppercase">
            <Sparkles size={12} />
            <span>Create Your Royal Account</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#E8D8C8] p-7 sm:p-9 shadow-xs rounded-xs">
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-[#221617]">Join Our Atelier</h1>
            <p className="text-xs text-[#6E6A66] mt-1 font-sans">
              Save your measurements, delivery addresses, and track your couture orders in real-time.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                className="w-full border border-[#E8D8C8] px-3.5 py-2.5 text-xs text-[#221617] placeholder-[#6E6A66]/50 focus:outline-none focus:border-[#A67C52] transition-colors bg-[#FAF7F2]/40 rounded-xs"
                placeholder="e.g. Priya Sharma"
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                Email Address *
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

            {/* Contact Phone */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-wider text-[#221617]">
                  Contact Number
                </label>
                <span className="text-[10px] text-[#A67C52] font-medium">For Courier & WhatsApp</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6E6A66] font-medium border-r border-[#E8D8C8] pr-2">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={10}
                  {...register('phone')}
                  className="w-full border border-[#E8D8C8] pl-14 pr-3.5 py-2.5 text-xs text-[#221617] placeholder-[#6E6A66]/50 focus:outline-none focus:border-[#A67C52] transition-colors bg-[#FAF7F2]/40 rounded-xs"
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full border border-[#E8D8C8] px-3.5 py-2.5 pr-10 text-xs text-[#221617] placeholder-[#6E6A66]/50 focus:outline-none focus:border-[#A67C52] transition-colors bg-[#FAF7F2]/40 rounded-xs"
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="w-full border border-[#E8D8C8] px-3.5 py-2.5 pr-10 text-xs text-[#221617] placeholder-[#6E6A66]/50 focus:outline-none focus:border-[#A67C52] transition-colors bg-[#FAF7F2]/40 rounded-xs"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A66] hover:text-[#221617] transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#221617] text-white py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#A67C52] transition-colors disabled:opacity-50 mt-4 rounded-xs shadow-xs flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Creating Account…' : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Guarantee */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[#6E6A66]">
            <ShieldCheck size={14} className="text-[#A67C52]" />
            <span>Encrypted & Confidential Patron Records</span>
          </div>

          {/* Sign In Redirect */}
          <div className="mt-6 pt-5 border-t border-[#E8D8C8] text-center">
            <p className="text-xs text-[#6E6A66]">
              Already have an account?{' '}
              <Link
                href={redirect ? `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}` : ROUTES.LOGIN}
                className="text-[#A67C52] font-semibold hover:text-[#221617] transition-colors uppercase tracking-wider text-[11px]"
              >
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-[10px] text-[#6E6A66]/70 mt-4 font-sans">
            By registering, you agree to our{' '}
            <Link href="/terms" className="hover:underline">Terms & Conditions</Link> and{' '}
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <RegisterForm />
    </Suspense>
  );
}
