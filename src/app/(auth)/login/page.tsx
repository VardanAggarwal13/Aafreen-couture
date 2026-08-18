import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `Sign In — ${siteConfig.name}`,
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
