'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const isLoading = useAuth((s) => s.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const role = useAuth.getState().user?.role;
      toast.success('Welcome back!');
      if (role === 'admin') router.push('/admin');
      else if (role === 'owner') router.push('/owner');
      else router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <Link href="/" className="block text-center mb-6">
          <span className="font-display font-black text-3xl text-ink-950">PIZI</span>
        </Link>

        <h1 className="font-display font-black text-2xl text-center">Welcome back</h1>
        <p className="text-sm text-ink-700 text-center mt-2">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-ink-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-ink-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-ink-700">
          Don't have an account?{' '}
          <Link href="/register" className="text-coral-500 font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
