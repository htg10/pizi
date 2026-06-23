'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function SearchPage() {
  const [filters, setFilters] = useState({ q: '', cityId: '', genderType: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params: any = {};
      if (filters.q) params.q = filters.q;
      if (filters.cityId) params.cityId = filters.cityId;
      const res = await api.get('/properties', { params });
      return res.data.data;
    },
  });

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display font-black text-2xl">PIZI</Link>
          <Link href="/login" className="text-sm font-bold">Login</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display font-black text-3xl mb-6">Find your PG</h1>

        <div className="bg-white p-4 rounded-2xl border border-ink-100 mb-6 flex gap-2 flex-wrap">
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Search by name..."
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border border-ink-200"
          />
          <select
            value={filters.genderType}
            onChange={(e) => setFilters({ ...filters, genderType: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-ink-200"
          >
            <option value="">All</option>
            <option value="male">Boys PG</option>
            <option value="female">Girls PG</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : data?.items?.length === 0 ? (
          <div className="card text-center">
            <p>No properties found. Add some via API first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items?.map((p: any) => (
              <Link key={p.id} href={`/property/${p.slug}`} className="card hover:shadow-lg transition">
                {p.images?.[0] ? (
                  <img src={p.images[0].url} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-3" />
                ) : (
                  <div className="w-full h-48 bg-ink-100 rounded-xl mb-3 flex items-center justify-center text-4xl">🏠</div>
                )}
                <h3 className="font-display font-bold text-xl">{p.name}</h3>
                <p className="text-sm text-ink-700">{p.locality?.name}, {p.city?.name}</p>
                <p className="font-bold text-coral-600 mt-2">{formatCurrency(p.startingPrice)}/mo</p>
                {p.isVerified && <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">✓ Verified</span>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
