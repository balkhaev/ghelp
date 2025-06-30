/**
 * Универсальный fetcher для SWR.
 * По-умолчанию ожидает JSON-ответ и бросает ошибку при ненулевом статусе.
 */
export async function fetcher<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    // Пробуем распарсить тело ошибки, но не бросаем, если JSON невалиден
    let message = `Request to ${input} failed with ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  // Если контент пустой, возвращаем null ‒ это особенно полезно для ответов 204
  if (res.status === 204) return null as T;
  return (await res.json()) as T;
}
