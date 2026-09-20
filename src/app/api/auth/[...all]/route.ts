import { auth } from '@/lib/auth';

export const GET = async (req: Request) => auth.handler(req);
export const POST = async (req: Request) => auth.handler(req);
export const OPTIONS = async (req: Request) => auth.handler(req);
