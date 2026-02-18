import { el } from "../utils/render.js";
import { sandvikProducts, CATEGORIES, getProductImage } from "../data/sandvik-products.js";
import { CARD_SPECS } from "../data/comparison-specs.js";
import { formatRange, formatSpec } from "../utils/format.js";

export function renderCatalog(container) {
  let activeCategory = "all";
  let searchTerm = "";

  const wrapper = el("div", { className: "space-y-6" });

  // Title
  wrapper.appendChild(
    el("h1", { className: "text-3xl font-bold" }, "Product Catalog")
  );
  wrapper.appendChild(
    el("p", { className: "text-base-content/70" }, "Select a surface drill rig to compare against competitor products.")
  );

  // Category tabs
  const tabsContainer = el("div", { className: "tabs tabs-box" });
  const allTab = el("a", {
    className: "tab tab-active",
    textContent: `All (${sandvikProducts.length})`,
    onClick: () => setCategory("all"),
    dataset: { cat: "all" },
  });
  tabsContainer.appendChild(allTab);
  for (const cat of CATEGORIES) {
    const count = sandvikProducts.filter((p) => p.category === cat.id).length;
    tabsContainer.appendChild(
      el("a", {
        className: "tab",
        textContent: `${cat.name.replace("Surface ", "").replace(" Drill Rigs", "")} (${count})`,
        onClick: () => setCategory(cat.id),
        dataset: { cat: cat.id },
      })
    );
  }
  wrapper.appendChild(tabsContainer);

  // Search bar
  const searchRow = el("div", { className: "flex flex-wrap gap-4 items-center" });
  const searchInput = el("input", {
    type: "text",
    placeholder: "Search products...",
    className: "input input-bordered w-full max-w-xs",
  });
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderGrid();
  });
  searchRow.appendChild(searchInput);
  wrapper.appendChild(searchRow);

  // Product grid
  const gridContainer = el("div", { id: "product-grid" });
  wrapper.appendChild(gridContainer);

  container.appendChild(wrapper);

  function setCategory(cat) {
    activeCategory = cat;
    tabsContainer.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("tab-active", t.dataset.cat === cat);
    });
    renderGrid();
  }

  function renderGrid() {
    let filtered = sandvikProducts;
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    gridContainer.innerHTML = "";

    if (filtered.length === 0) {
      gridContainer.appendChild(
        el("div", { className: "alert alert-info mt-4" }, [
          el("span", {}, "No products match your search."),
        ])
      );
      return;
    }

    const grid = el("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-2",
    });

    for (const product of filtered) {
      grid.appendChild(createProductCard(product));
    }
    gridContainer.appendChild(grid);
  }

  renderGrid();
}

function createProductCard(product) {
  const categoryLabel = CATEGORIES.find((c) => c.id === product.category);
  const specs = CARD_SPECS[product.category] || [];

  const card = el("div", {
    className: "card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow cursor-pointer",
    onClick: () => {
      window.location.hash = `compare/${product.id}`;
    },
  });

  // Product image
  const imageUrl = getProductImage(product.id);
  if (imageUrl) {
    const figure = el("figure", { className: "px-0 pt-0 bg-white" });
    const img = el("img", {
      src: imageUrl,
      alt: product.name,
      className: "w-full h-40 object-cover",
    });
    img.loading = "lazy";
    figure.appendChild(img);
    card.appendChild(figure);
  } else {
    const placeholder = el("div", { className: "product-image-placeholder h-40" });
    placeholder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>`;
    card.appendChild(placeholder);
  }

  const body = el("div", { className: "card-body p-5" }, [
    // Title row
    el("h2", { className: "card-title text-base" }, [
      el("span", {}, product.name),
    ]),
    // Category badge
    el("div", { className: "mb-2" }, [
      el("span", {
        className: "badge badge-outline badge-sm",
        textContent: categoryLabel
          ? categoryLabel.name.replace(" Drill Rigs", "")
          : product.category,
      }),
    ]),
  ]);

  // Specs
  const specList = el("div", { className: "space-y-1 text-sm" });
  for (const spec of specs) {
    const val = spec.isRange
      ? formatRange(product.specs[spec.key], product.specs[spec.key2], spec.unit)
      : formatSpec(product.specs[spec.key], spec.unit, "numeric");
    specList.appendChild(
      el("div", { className: "flex justify-between" }, [
        el("span", { className: "text-base-content/60" }, spec.label),
        el("span", { className: "font-medium" }, val),
      ])
    );
  }
  body.appendChild(specList);

  // Highlights
  if (product.highlights && product.highlights.length > 0) {
    const hl = el("div", { className: "mt-3 space-y-1" });
    for (const h of product.highlights) {
      hl.appendChild(
        el("div", { className: "text-xs text-base-content/50" }, `\u2022 ${h}`)
      );
    }
    body.appendChild(hl);
  }

  // Action
  const actions = el("div", { className: "card-actions justify-end mt-4" }, [
    el("a", {
      href: `#compare/${product.id}`,
      className: "btn btn-primary btn-sm",
      textContent: "Compare",
      onClick: (e) => e.stopPropagation(),
    }),
  ]);
  body.appendChild(actions);

  card.appendChild(body);
  return card;
}
