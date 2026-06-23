'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';

export default function OwnerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, fetchMe, logout } = useAuth();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'owner' && user.role !== 'admin') {
      router.push('/');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please login to access the dashboard.</p>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar + Main */}
      <div className="flex">
        <aside className="w-64 bg-ink-950 text-cream min-h-screen p-4">
          <div className="font-display font-black text-2xl mb-8">PIZI</div>
          <nav className="space-y-1 text-sm">
            <Link href="/owner" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">📊 Dashboard</Link>
            <Link href="/owner/properties" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">🏠 My Properties</Link>
            <Link href="/owner/tenants" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">👥 Tenants</Link>
            <Link href="/owner/rent" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">💰 Rent Collection</Link>
            <Link href="/owner/complaints" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">🛠️ Complaints</Link>
            <Link href="/owner/rooms" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">🛏️ Rooms & Beds</Link>
            <Link href="/owner/agreements" className="block px-3 py-2.5 rounded-lg hover:bg-cream/5">📄 Agreements</Link>
          </nav>

          <button onClick={logout} className="absolute bottom-4 left-4 right-4 px-3 py-2 bg-cream/5 hover:bg-cream/10 rounded-lg text-sm">
            Logout
          </button>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-black text-3xl">Welcome, {user?.name}!</h1>
              <p className="text-ink-700 mt-1">Here's your PG operations overview</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <div className="text-xs text-ink-500 uppercase font-bold">Total Tenants</div>
              <div className="font-display font-black text-3xl mt-1">--</div>
            </div>
            <div className="card">
              <div className="text-xs text-emerald-700 uppercase font-bold">Collected (Month)</div>
              <div className="font-display font-black text-3xl text-emerald-700 mt-1">₹--</div>
            </div>
            <div className="card">
              <div className="text-xs text-rose-700 uppercase font-bold">Pending Dues</div>
              <div className="font-display font-black text-3xl text-rose-700 mt-1">₹--</div>
            </div>
            <div className="card">
              <div className="text-xs text-amber-700 uppercase font-bold">Open Complaints</div>
              <div className="font-display font-black text-3xl text-amber-700 mt-1">--</div>
            </div>
          </div>

          <div className="mt-8 card">
            <h2 className="font-display font-bold text-xl mb-4">🚀 Getting Started</h2>
            <p className="text-sm text-ink-700 mb-4">Welcome to PIZI Owner Dashboard. Backend API: <code className="bg-ink-100 px-2 py-0.5 rounded">{process.env.NEXT_PUBLIC_API_URL}</code></p>
            <p className="text-sm text-ink-700">Connect your Hostinger MySQL database to migrate existing data.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
