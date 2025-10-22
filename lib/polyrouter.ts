const POLYROUTER_BASE_URL = "https://api.polyrouter.io/functions/v1";

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function polyrouter(endpoint: string, options: FetchOptions = {}) {
  const { retries = 2, retryDelay = 1000, ...fetchOptions } = options;
  const apiKey = process.env.POLYROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("POLYROUTER_API_KEY is not configured");
  }

  const url = `${POLYROUTER_BASE_URL}${endpoint}`;
  const headers = {
    "X-API-Key": apiKey,
    ...fetchOptions.headers,
  };

  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}
