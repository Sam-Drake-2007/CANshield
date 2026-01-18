const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default async function api(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg =
        (data && (data.detail || data.message)) ||
        `Request failed (${res.status})`;
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error");
  }
}
