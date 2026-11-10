export function ErrorNote({ title, message }: { title: string; message: string }) {
  return (
    <p role="alert" className="mb-6 rounded-card border border-review p-3 text-sm text-review">
      <strong>{title}:</strong> {message}
    </p>
  );
}
