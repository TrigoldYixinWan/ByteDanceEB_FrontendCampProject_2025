export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(base + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers)
    }
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
