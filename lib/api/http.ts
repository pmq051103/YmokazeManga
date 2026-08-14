import { MangaSource, SourceUnavailableError } from "./types";

/**
 * Small fetch wrapper that adds a timeout and turns any network / HTTP /
 * parsing failure into a SourceUnavailableError, so callers (the resolver)
 * can catch one error type and move on to the fallback source.
 */
export async function fetchJson<T>(
  source: MangaSource,
  url: string,
  init?: RequestInit,
  timeoutMs = 8000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new SourceUnavailableError(
        source,
        `Request failed with status ${res.status} for ${url}`
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof SourceUnavailableError) throw err;
    const msg = err instanceof Error ? err.message : "Unknown fetch error";
    throw new SourceUnavailableError(source, msg);
  } finally {
    clearTimeout(timer);
  }
}
