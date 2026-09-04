'use client';

import Link from 'next/link';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  href?: string;
}

/** KPI-kort med flera värderader (värde + etikett per rad) */
export function KPIListCard({ title, items, subtitle }: {
  title: string;
  items: { value: string; label: string }[];
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: 'var(--color-kpi-bg)' }}>
      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {title}
      </p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <span className="font-bold leading-tight whitespace-nowrap" style={{ fontSize: '1.35rem', color: 'var(--color-primary)' }}>
              {item.value}
            </span>
            <span className="text-xs leading-tight" style={{ color: 'var(--color-text)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function KPICard({ title, value, subtitle, href }: Props) {
  const valueEl = href ? (
    <Link
      href={href}
      className="font-bold leading-tight"
      style={{ fontSize: '2rem', color: 'var(--color-primary)', textDecoration: 'underline', textUnderlineOffset: 4 }}
    >
      {value}
    </Link>
  ) : (
    <p className="font-bold leading-tight" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
      {value}
    </p>
  );

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{ background: 'var(--color-kpi-bg)', cursor: href ? 'pointer' : undefined }}
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {title}
      </p>
      {valueEl}
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
