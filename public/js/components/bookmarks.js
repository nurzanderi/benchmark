import { el } from "../utils/render.js";
import { getBookmarks, removeBookmark } from "../services/bookmark-service.js";
import { getSandvikProduct } from "../services/comparison-service.js";
import { competitors } from "../data/competitors.js";

export function renderBookmarks(container) {
  const wrapper = el("div", { className: "space-y-6" });

  wrapper.appendChild(
    el("h1", { className: "text-3xl font-bold" }, "Saved Comparisons")
  );

  const listContainer = el("div", { id: "bookmarks-list" });
  wrapper.appendChild(listContainer);
  container.appendChild(wrapper);

  renderList();

  function renderList() {
    listContainer.innerHTML = "";
    const bookmarks = getBookmarks();

    if (bookmarks.length === 0) {
      listContainer.appendChild(
        el("div", { className: "alert mt-4" }, [
          el("span", { innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }),
          el("span", {}, "No saved comparisons yet. Go to the catalog, compare a product, and save it!"),
        ])
      );
      return;
    }

    const grid = el("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" });

    for (const bm of bookmarks) {
      const sandvik = getSandvikProduct(bm.sandvikProductId);
      const comps = bm.competitorProductIds
        .map((id) => competitors.find((c) => c.id === id))
        .filter(Boolean);

      const card = el("div", { className: "card bg-base-100 shadow-sm border border-base-300" });
      const body = el("div", { className: "card-body p-5" });

      body.appendChild(
        el("h3", { className: "card-title text-base" }, bm.label || "Saved comparison")
      );

      // Details
      const details = el("div", { className: "text-sm space-y-1 mt-2" });
      if (sandvik) {
        details.appendChild(
          el("div", {}, [
            el("span", { className: "text-base-content/50" }, "Sandvik: "),
            el("span", { className: "font-medium text-primary" }, sandvik.name),
          ])
        );
      }
      if (comps.length > 0) {
        details.appendChild(
          el("div", {}, [
            el("span", { className: "text-base-content/50" }, "vs: "),
            el("span", { className: "font-medium" }, comps.map((c) => `${c.name} (${c.manufacturer})`).join(", ")),
          ])
        );
      }
      details.appendChild(
        el("div", { className: "text-xs text-base-content/40 mt-1" }, `Saved ${new Date(bm.createdAt).toLocaleDateString()}`)
      );
      body.appendChild(details);

      // Actions
      const actions = el("div", { className: "card-actions justify-end mt-4 gap-2" });
      actions.appendChild(
        el("a", {
          href: `#compare/${bm.sandvikProductId}`,
          className: "btn btn-primary btn-sm",
          textContent: "Open",
        })
      );
      actions.appendChild(
        el("button", {
          className: "btn btn-ghost btn-sm text-error",
          textContent: "Remove",
          onClick: () => {
            removeBookmark(bm.id);
            renderList();
          },
        })
      );
      body.appendChild(actions);

      card.appendChild(body);
      grid.appendChild(card);
    }

    listContainer.appendChild(grid);
  }
}
