import { el } from "../utils/render.js";
import { events } from "../app.js";
import { getBookmarkCount } from "../services/bookmark-service.js";

export function renderNavbar(container) {
  container.innerHTML = "";

  const nav = el("div", { className: "navbar bg-base-100 shadow-sm sticky top-0 z-50" }, [
    // Left: brand
    el("div", { className: "navbar-start" }, [
      el("a", { href: "#catalog", className: "btn btn-ghost text-lg font-bold" }, [
        el("span", { className: "text-primary" }, "Sandvik"),
        el("span", { className: "ml-1" }, "Drill Rig Comparisons"),
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
      // Theme toggle
      createThemeToggle(),
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

function createThemeToggle() {
  const label = el("label", { className: "swap swap-rotate btn btn-ghost btn-circle" });

  const checkbox = el("input", {
    type: "checkbox",
    className: "theme-controller",
  });
  checkbox.setAttribute("value", "dark");

  // Sun icon
  const sun = el("span", {
    className: "swap-off",
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
  });
  // Moon icon
  const moon = el("span", {
    className: "swap-on",
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`,
  });

  label.appendChild(checkbox);
  label.appendChild(sun);
  label.appendChild(moon);

  return label;
}
