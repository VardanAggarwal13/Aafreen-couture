import type { Metadata } from 'next';
import { RegisterForm } from './RegisterForm';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `Create Account — ${siteConfig.name}`,
};

interface RegisterPageProps {
  searchParams?: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolved = searchParams ? await searchParams : undefined;
  return <RegisterForm initialRedirect={resolved?.redirect} />;
}
