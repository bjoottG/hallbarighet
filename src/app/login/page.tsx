export const metadata = { title: 'Logga in – Hållbarhet' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ fel?: string; next?: string }>;
}) {
  const { fel, next } = await searchParams;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <form
        method="post"
        action="/api/login"
        className="w-full max-w-sm bg-white border rounded-xl p-6 flex flex-col gap-4 shadow-sm"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <img src="/logo-tillvaxtverket.svg" alt="Tillväxtverket" style={{ height: 40, width: 'auto', alignSelf: 'flex-start' }} />
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Logga in – Hållbarhet</h1>
        {next && <input type="hidden" name="next" value={next} />}
        <label className="flex flex-col gap-1 text-sm" style={{ color: 'var(--color-text)' }}>
          Lösenord
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="border rounded-md px-3 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        {fel && (
          <p className="text-sm" role="alert" style={{ color: '#B42318' }}>Fel lösenord. Försök igen.</p>
        )}
        <button
          type="submit"
          className="rounded-md px-4 py-2 text-sm font-semibold text-white"
          style={{ background: '#4A1B8B' }}
        >
          Logga in
        </button>
      </form>
    </main>
  );
}
