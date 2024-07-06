import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { ipAddress, next } from '@vercel/edge';

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	// 120 requests per day
	limiter: Ratelimit.slidingWindow(120, '1d')
});

export const config = {
	matcher: '/'
};

export default async function middleware(request: Request) {
	const ip = ipAddress(request) ?? '127.0.0.1';
	const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
	return success ? next() : Response.json({ message: 'rate limited' }, { status: 429 });
}
