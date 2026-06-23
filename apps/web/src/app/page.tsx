import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display font-black text-2xl text-ink-950">
            PIZI
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/search" className="hover:text-coral-500">Find PG</Link>
            <Link href="/owners" className="hover:text-coral-500">For Owners</Link>
            <Link href="/login" className="hover:text-coral-500">Login</Link>
            <Link href="/register" className="btn-primary text-sm">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-950 to-ink-900 text-cream py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-display font-black text-5xl md:text-6xl leading-tight">
            Find verified PGs.<br/>
            <span className="text-coral-400">Live better.</span>
          </h1>
          <p className="mt-6 text-lg text-cream/80 max-w-2xl mx-auto">
            India's most trusted PG aggregator. Real photos, verified owners, no brokerage.
          </p>
          <div className="mt-10 flex gap-3 justify-center flex-wrap">
            <Link href="/search" className="btn-primary text-base">Search PGs</Link>
            <Link href="/register?role=owner" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-cream rounded-xl font-bold backdrop-blur transition">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-display font-bold text-xl">Verified Properties</h3>
            <p className="text-ink-700 mt-2">Every PG is personally verified by our team with real photos and amenities.</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-display font-bold text-xl">No Brokerage</h3>
            <p className="text-ink-700 mt-2">Pay zero brokerage. Direct contact with property owners.</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-display font-bold text-xl">Full PG Management</h3>
            <p className="text-ink-700 mt-2">For owners: tenants, rent, complaints, agreements — all in one app.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-950 text-cream py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-display font-black text-2xl">PIZI</p>
          <p className="text-sm text-cream/60 mt-2">Live Better. Stay Smarter.</p>
          <p className="text-xs text-cream/40 mt-6">© {new Date().getFullYear()} Help Together Media Pvt Ltd</p>
        </div>
      </footer>
    </main>
  );
}
