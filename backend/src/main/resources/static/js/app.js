const API_LIST = "https://cataas.com/api/cats";
const API_IMG = id => `https://cataas.com/cat/${id}`;

const viewEl = document.getElementById("view");
const gridEl = viewEl.querySelector(".grid");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const linkBrowse = document.getElementById("link-browse");
const linkFav = document.getElementById("link-fav");

let route = location.hash.startsWith("#/favorites") ? "favorites" : "browse";
let page = 1;
let hasNext = true;
let loading = false;

const favMap = new Map();

function cardHTML(id) {
  const active = favMap.has(id);
  return `<div class="col"><article class="card h-100"><figure class="card__media mb-0"><img loading="lazy" src="${API_IMG(id)}" alt="Cat ${id}"></figure><button class="fav" type="button" data-id="${id}" aria-pressed="${active ? "true" : "false"}">${active ? "★" : "☆"}</button></article></div>`;
}

function skeleton(n) {
  return Array.from({ length: n }, () => `<div class="col"><article class="card h-100"><figure class="card__media mb-0"></figure></article></div>`).join("");
}

function pageCols() {
  if (window.innerWidth >= 992) return 3;
  if (window.innerWidth >= 576) return 2;
  return 1;
}

function pageSize() {
  return 3 * pageCols();
}

async function fetchPage(p) {
  const size = pageSize();
  const res = await fetch(`${API_LIST}?skip=${(p - 1) * size}&limit=${size}`);
  const data = await res.json();
  return data.map(c => c.id || c._id).filter(Boolean);
}

async function loadFavs() {
  const list = await window.api.getFavorites();
  favMap.clear();
  list.forEach(f => favMap.set(f.catId, f.id));
}

function setActiveLink() {
  if (route === "browse") {
    linkBrowse.setAttribute("aria-current", "page");
    linkFav.removeAttribute("aria-current");
  } else {
    linkFav.setAttribute("aria-current", "page");
    linkBrowse.removeAttribute("aria-current");
  }
}

async function renderBrowse() {
  await loadFavs();
  setActiveLink();
  const size = pageSize();
  gridEl.innerHTML = skeleton(size);
  loading = true;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = true;
  try {
    const ids = await fetchPage(page);
    hasNext = ids.length === size;
    gridEl.innerHTML = ids.map(cardHTML).join("");
  } catch {
    hasNext = false;
    gridEl.innerHTML = `<div class="col"><div class="p-4 text-center border rounded-3 bg-white">Failed to load</div></div>`;
  } finally {
    loading = false;
    prevBtn.disabled = page <= 1 || loading;
    nextBtn.disabled = !hasNext || loading;
  }
}

async function renderFavorites() {
  await loadFavs();
  setActiveLink();
  const ids = [...favMap.keys()];
  if (!ids.length) {
    gridEl.innerHTML = `<div class="col"><div class="p-4 text-center border rounded-3 bg-white">No favorites yet</div></div>`;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  gridEl.innerHTML = ids.map(cardHTML).join("");
  prevBtn.disabled = true;
  nextBtn.disabled = true;
}

gridEl.addEventListener("click", async e => {
  const btn = e.target.closest(".fav");
  if (!btn) return;
  const catId = btn.dataset.id;
  const existingId = favMap.get(catId);
  if (existingId) {
    await window.api.deleteFavorite(existingId);
    favMap.delete(catId);
  } else {
    const f = await window.api.addFavorite(catId);
    favMap.set(catId, f.id);
  }
  btn.setAttribute("aria-pressed", favMap.has(catId) ? "true" : "false");
  btn.textContent = favMap.has(catId) ? "★" : "☆";
  if (route === "favorites" && !favMap.has(catId)) renderFavorites();
});

window.addEventListener("hashchange", () => {
  route = location.hash.startsWith("#/favorites") ? "favorites" : "browse";
  page = 1;
  route === "browse" ? renderBrowse() : renderFavorites();
});

prevBtn.addEventListener("click", () => {
  if (loading || page <= 1) return;
  page--;
  renderBrowse();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

nextBtn.addEventListener("click", () => {
  if (loading || !hasNext) return;
  page++;
  renderBrowse();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (!location.hash) location.hash = "#/browse";
(route === "browse" ? renderBrowse : renderFavorites)();
