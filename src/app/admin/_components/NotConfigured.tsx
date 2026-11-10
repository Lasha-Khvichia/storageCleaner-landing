export function NotConfigured() {
  return (
    <section className="rounded-card border border-line bg-surface p-6">
      <h1 className="text-xl font-semibold">Admin is not configured</h1>
      <p className="mt-2 text-sm text-muted">
        The admin needs its server-side settings (see the README, section Admin). Until they are set, there is no
        login.
      </p>
    </section>
  );
}
