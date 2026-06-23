'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const registerFn = useAuth((s) => s.register);
  const isLoading = useAuth((s) => s.isLoading);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: (params.get('role') as any) || 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerFn(form);
      toast.success('Account created!');
      const role = useAuth.getState().user?.role;
      if (role === 'owner') router.push('/owner');
      else router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <Link href="/" className="block text-center mb-6">
          <span className="font-display font-black text-3xl text-ink-950">PIZI</span>
        </Link>

        <h1 className="font-display font-black text-2xl text-center">Create account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
          />
          <input
            placeholder="Phone (10 digit)"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as any })}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-coral-500 focus:outline-none"
          >
            <option value="user">I'm looking for a PG</option>
            <option value="owner">I own a property (list it)</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-ink-700">
          Already have an account?{' '}
          <Link href="/login" className="text-coral-500 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}
