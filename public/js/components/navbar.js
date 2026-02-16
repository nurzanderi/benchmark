import { el } from "../utils/render.js";
import { events } from "../app.js";
import { getBookmarkCount } from "../services/bookmark-service.js";

export function renderNavbar(container) {
  container.innerHTML = "";

  const nav = el("div", { className: "navbar bg-base-100 shadow-sm sticky top-0 z-50" }, [
    // Left: brand
    el("div", { className: "navbar-start" }, [
      el("a", { href: "#catalog", className: "btn btn-ghost text-lg font-bold" }, [
        el("span", { className: "text-primary" }, "Surface Drill Rigs"),
        el("span", { className: "ml-1" }, "- Comparison tool"),
      ]),
    ]),
    // Center: nav links (hidden on mobile)
    el("div", { className: "navbar-center hidden md:flex" }, [
      el("ul", { className: "menu menu-horizontal px-1 gap-1" }, [
        el("li", {}, [
          el("a", { href: "#catalog", className: "font-medium" }, "Catalog"),
        ]),
        el("li", {}, [
          el("a", { href: "#bookmarks", className: "font-medium" }, "Bookmarks"),
        ]),
      ]),
    ]),
    // Right: bookmark badge + theme toggle + mobile menu
    el("div", { className: "navbar-end gap-2" }, [
      // Bookmark indicator
      el("a", { href: "#bookmarks", className: "btn btn-ghost btn-circle", id: "bookmark-badge-btn" }, [
        createBookmarkBadge(getBookmarkCount()),
      ]),
      // Logout button
      el("a", { href: "/logout", className: "btn btn-ghost btn-sm hidden md:inline-flex" }, "Logout"),
      // Mobile dropdown
      el("div", { className: "dropdown dropdown-end md:hidden" }, [
        el("div", { tabindex: "0", role: "button", className: "btn btn-ghost btn-circle" }, [
          el("span", { innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>` }),
        ]),
        el("ul", {
          tabindex: "0",
          className: "menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow",
        }, [
          el("li", {}, [el("a", { href: "#catalog" }, "Catalog")]),
          el("li", {}, [el("a", { href: "#bookmarks" }, "Bookmarks")]),
          el("li", {}, [el("a", { href: "/logout" }, "Logout")]),
        ]),
      ]),
    ]),
  ]);

  container.appendChild(nav);

  // Listen for bookmark changes
  events.on("bookmarks-changed", ({ count }) => {
    const btn = document.getElementById("bookmark-badge-btn");
    if (btn) {
      btn.innerHTML = "";
      btn.appendChild(createBookmarkBadge(count));
    }
  });
}

function createBookmarkBadge(count) {
  const wrapper = el("div", { className: "indicator" });
  if (count > 0) {
    wrapper.appendChild(
      el("span", { className: "indicator-item badge badge-secondary badge-xs", textContent: String(count) })
    );
  }
  wrapper.appendChild(
    el("span", {
      innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>`,
    })
  );
  return wrapper;
}

