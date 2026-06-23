'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, fetchMe, logout } = useAuth();

  useEffect(() => { fetchMe(); }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Admin access required.</p>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-ink-950 text-cream min-h-screen p-4">
        <div className="font-display font-black text-2xl mb-8">PIZI Admin</div>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">📊 Overview</Link>
          <div className="mt-4 mb-2 px-3 text-xs font-bold uppercase text-cream/40">Platform</div>
          <Link href="/admin/properties" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">🏠 All Properties</Link>
          <Link href="/admin/users" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">👤 Users</Link>
          <Link href="/admin/leads" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">📞 Leads</Link>

          <div className="mt-4 mb-2 px-3 text-xs font-bold uppercase text-cream/40">PG Management</div>
          <Link href="/admin/tenants" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">👥 All Tenants</Link>
          <Link href="/admin/rent" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">💰 All Bills</Link>
          <Link href="/admin/complaints" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">🛠️ All Complaints</Link>
          <Link href="/admin/rooms" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">🛏️ All Rooms</Link>
          <Link href="/admin/agreements" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">📄 All Agreements</Link>
        </nav>
        <button onClick={logout} className="mt-8 w-full px-3 py-2 bg-cream/5 hover:bg-cream/10 rounded-lg text-sm">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="font-display font-black text-3xl">Admin Dashboard</h1>
        <p className="text-ink-700 mt-1">Welcome, {user?.name}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="card">
            <div className="text-xs text-ink-500 uppercase font-bold">Total Properties</div>
            <div className="font-display font-black text-3xl mt-1">--</div>
          </div>
          <div className="card">
            <div className="text-xs text-ink-500 uppercase font-bold">Total Owners</div>
            <div className="font-display font-black text-3xl mt-1">--</div>
          </div>
          <div className="card">
            <div className="text-xs text-emerald-700 uppercase font-bold">Revenue (Month)</div>
            <div className="font-display font-black text-3xl text-emerald-700 mt-1">₹--</div>
          </div>
          <div className="card">
            <div className="text-xs text-rose-700 uppercase font-bold">Urgent Issues</div>
            <div className="font-display font-black text-3xl text-rose-700 mt-1">--</div>
          </div>
        </div>
      </main>
    </div>
  );
}
