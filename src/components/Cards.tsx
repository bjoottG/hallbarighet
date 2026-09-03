'use client';

export function ChartCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</h3>
      {subtitle
        ? <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
        : <div className="mb-3" />}
      {children}
    </div>
  );
}

export function TableCard({ title, subtitle, maxHeight, children }: {
  title: string; subtitle?: string; maxHeight?: number; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{title}</h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
        )}
      </div>
      <div className="overflow-auto" style={{ maxHeight: maxHeight ?? 460 }}>
        {children}
      </div>
    </div>
  );
}

export const TH = ({ children, right }: { children?: React.ReactNode; right?: boolean }) => (
  <th
    className={`${right ? 'text-right' : 'text-left'} py-2 px-3 font-semibold whitespace-nowrap sticky top-0 bg-white`}
    style={{ color: 'var(--color-text-muted)' }}
  >
    {children}
  </th>
);

export const TD = ({ children, right, mono, title }: {
  children?: React.ReactNode; right?: boolean; mono?: boolean; title?: string;
}) => (
  <td
    className={`py-1.5 px-3 ${right ? 'text-right' : 'text-left'} ${mono ? 'font-mono' : ''}`}
    style={{ color: 'var(--color-text)' }}
    title={title}
  >
    {children}
  </td>
);
