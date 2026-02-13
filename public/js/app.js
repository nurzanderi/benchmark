import { renderNavbar } from "./components/navbar.js";
import { renderCatalog } from "./components/catalog.js";
import { renderComparison } from "./components/comparison.js";
import { renderBookmarks } from "./components/bookmarks.js";

// Simple event bus for cross-component communication
export const events = {
  emit(name, data) {
    document.dispatchEvent(new CustomEvent(name, { detail: data }));
  },
  on(name, handler) {
    document.addEventListener(name, (e) => handler(e.detail));
  },
};

// Hash-based router
const routes = {
  "": renderCatalog,
  catalog: renderCatalog,
  compare: renderComparison,
  bookmarks: renderBookmarks,
};

function handleRoute() {
  const hash = window.location.hash.slice(1); // remove #
  const [route, ...params] = hash.split("/");
  const handler = routes[route] || routes[""];
  const main = document.getElementById("main-content");
  main.innerHTML = "";
  handler(main, ...params);
}

export function navigate(path) {
  window.location.hash = path;
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("DOMContentLoaded", () => {
  renderNavbar(document.getElementById("navbar-root"));
  handleRoute();
});
