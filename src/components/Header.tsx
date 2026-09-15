'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-5">
        {/* Logo — hemknapp till första fliken */}
        <Link href="/ansokningar" aria-label="Till startsidan Ansökningar" style={{ flexShrink: 0 }}>
          <img
            src="/logo-tillvaxtverket.svg"
            alt="Tillväxtverket"
            style={{ height: 44, width: 'auto' }}
          />
        </Link>

        {/* Divider */}
        <div className="w-px self-stretch" style={{ background: 'var(--color-border)' }} />

        {/* Title */}
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Hållbarhet
        </h1>

      </div>
    </header>
  );
}
