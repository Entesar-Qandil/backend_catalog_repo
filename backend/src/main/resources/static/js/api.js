const API_BASE = "http://localhost:8080";

async function http(u, init) {
  const r = await fetch(u, init);
  if (!r.ok) throw new Error(await r.text().catch(() => r.statusText));
  return r.status === 204 ? null : r.json();
}

async function getFavorites() {
  return http(`${API_BASE}/api/favorites`);
}

async function addFavorite(catId, note = "") {
  return http(`${API_BASE}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ catId, note })
  });
}

async function updateFavorite(id, note = "") {
  return http(`${API_BASE}/api/favorites/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note })
  });
}

async function deleteFavorite(id) {
  return http(`${API_BASE}/api/favorites/${id}`, { method: "DELETE" });
}

window.api = { getFavorites, addFavorite, updateFavorite, deleteFavorite };
