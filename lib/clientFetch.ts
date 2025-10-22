"use client";

export async function api(path: string, init?: RequestInit) {
  const t0 = performance.now();
  const res = await fetch(path, { ...init, cache: "no-store" });
  const t1 = performance.now();

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  // Dispatch custom event for logging
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("api:log", {
        detail: {
          path,
          method: init?.method || "GET",
          status: res.status,
          ms: Math.round(t1 - t0),
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  if (!res.ok) {
    throw Object.assign(new Error("Request failed"), {
      status: res.status,
      body,
    });
  }

  return body;
}
