const API_BASE = "http://localhost:5000";
export async function request(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status}: ${message}`);
  }

  if (response.status === 204) return null;

  return await response.json();
}
