import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `Sign In — ${siteConfig.name}`,
};

interface LoginPageProps {
  searchParams?: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolved = searchParams ? await searchParams : undefined;
  return <LoginForm initialRedirect={resolved?.redirect} />;
}
