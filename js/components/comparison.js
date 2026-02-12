import { el } from "../utils/render.js";
import { formatSpec, formatNumber, percentOf } from "../utils/format.js";
import {
  getSandvikProduct,
  getCompetitorsForProduct,
  buildComparisonMatrix,
  getSpecFields,
} from "../services/comparison-service.js";
import { BAR_CHART_SPECS } from "../data/comparison-specs.js";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
} from "../services/bookmark-service.js";

export function renderComparison(container, productId) {
  const product = getSandvikProduct(productId);
  if (!product) {
    container.appendChild(
      el("div", { className: "alert alert-error mt-8" }, [
        el("span", {}, `Product "${productId}" not found.`),
      ])
    );
    return;
  }

  const allCompetitors = getCompetitorsForProduct(productId);
  let selectedIds = new Set(allCompetitors.map((c) => c.id));

  const wrapper = el("div", { className: "space-y-6" });

  // Back button
  wrapper.appendChild(
    el("a", {
      href: "#catalog",
      className: "btn btn-ghost btn-sm gap-1",
      innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg> Back to Catalog`,
    })
  );

  // Product header
  wrapper.appendChild(renderProductHeader(product));

  // Competitor selector
  if (allCompetitors.length === 0) {
    wrapper.appendChild(
      el("div", { className: "alert alert-warning" }, [
        el("span", {}, "No competitor data available for this product yet."),
      ])
    );
    container.appendChild(wrapper);
    return;
  }

  const selectorSection = el("div", { className: "space-y-3" });
  selectorSection.appendChild(
    el("h2", { className: "text-xl font-bold" }, "Select Competitors")
  );

  const selectorGrid = el("div", { className: "flex flex-wrap gap-3" });
  for (const comp of allCompetitors) {
    const label = el("label", {
      className: "flex items-center gap-2 cursor-pointer bg-base-100 rounded-lg px-4 py-2 border border-base-300 hover:border-primary transition-colors",
    });
    const cb = el("input", { type: "checkbox", className: "checkbox checkbox-primary checkbox-sm" });
    cb.checked = true;
    cb.addEventListener("change", () => {
      if (cb.checked) {
        selectedIds.add(comp.id);
      } else {
        selectedIds.delete(comp.id);
      }
      updateComparison();
    });
    label.appendChild(cb);
    label.appendChild(
      el("span", { className: "text-sm" }, [
        el("span", { className: "font-medium" }, comp.name),
        el("span", { className: "text-base-content/50 ml-1" }, `(${comp.manufacturer})`),
      ])
    );
    selectorGrid.appendChild(label);
  }
  selectorSection.appendChild(selectorGrid);
  wrapper.appendChild(selectorSection);

  // Bookmark button
  const bookmarkRow = el("div", { className: "flex gap-3", id: "bookmark-row" });
  wrapper.appendChild(bookmarkRow);

  // Comparison table container
  const tableContainer = el("div", { id: "comparison-table-area" });
  wrapper.appendChild(tableContainer);

  // Bar chart container
  const chartContainer = el("div", { id: "comparison-chart-area" });
  wrapper.appendChild(chartContainer);

  container.appendChild(wrapper);

  function updateComparison() {
    const selected = allCompetitors.filter((c) => selectedIds.has(c.id));
    const matrix = buildComparisonMatrix(product, selected);

    // Table
    tableContainer.innerHTML = "";
    if (selected.length > 0) {
      tableContainer.appendChild(renderComparisonTable(product, selected, matrix));
    }

    // Bar charts
    chartContainer.innerHTML = "";
    if (selected.length > 0) {
      chartContainer.appendChild(renderBarCharts(product, selected));
    }

    // Bookmark button
    renderBookmarkButton(bookmarkRow, product, selected);
  }

  updateComparison();
}

function renderProductHeader(product) {
  const header = el("div", { className: "card bg-base-100 shadow-sm border border-base-300" });
  const body = el("div", { className: "card-body" });

  body.appendChild(
    el("h1", { className: "text-2xl font-bold text-primary" }, product.name)
  );

  // Quick stats
  const stats = el("div", { className: "stats stats-vertical sm:stats-horizontal shadow mt-4 w-full" });

  const addStat = (label, value, unit) => {
    const stat = el("div", { className: "stat" });
    stat.appendChild(el("div", { className: "stat-title" }, label));
    stat.appendChild(el("div", { className: "stat-value text-lg" }, formatNumber(value)));
    if (unit) stat.appendChild(el("div", { className: "stat-desc" }, unit));
    stats.appendChild(stat);
  };

  if (product.specs.holeRangeMax) {
    addStat("Hole Range", `${product.specs.holeRangeMin}\u2013${product.specs.holeRangeMax}`, "mm");
  }
  if (product.specs.rockDrillPowerMax) addStat("Rock Drill", product.specs.rockDrillPowerMax, "kW");
  else if (product.specs.pulldownForce) addStat("Pulldown", product.specs.pulldownForce, "kN");
  if (product.specs.enginePower) addStat("Engine", product.specs.enginePower, "kW");
  if (product.specs.weight) addStat("Weight", product.specs.weight, "kg");

  body.appendChild(stats);

  // Highlights
  if (product.highlights && product.highlights.length) {
    const hl = el("div", { className: "mt-4 flex flex-wrap gap-2" });
    for (const h of product.highlights) {
      hl.appendChild(el("span", { className: "badge badge-outline" }, h));
    }
    body.appendChild(hl);
  }

  header.appendChild(body);
  return header;
}

function renderComparisonTable(product, selected, matrix) {
  const section = el("div", { className: "space-y-3" });
  section.appendChild(
    el("h2", { className: "text-xl font-bold" }, "Specification Comparison")
  );

  const tableWrap = el("div", { className: "overflow-x-auto" });
  const table = el("table", { className: "table table-zebra table-sm" });

  // Header
  const thead = el("thead");
  const hRow = el("tr");
  hRow.appendChild(el("th", { className: "bg-base-200 sticky left-0 z-10" }, "Specification"));
  hRow.appendChild(el("th", { className: "bg-primary/10 text-primary font-bold" }, product.name));
  for (const comp of selected) {
    hRow.appendChild(el("th", {}, `${comp.name}`));
  }
  thead.appendChild(hRow);
  table.appendChild(thead);

  // Body
  const tbody = el("tbody");
  for (const row of matrix) {
    const tr = el("tr");
    // Spec label
    const labelCell = el("td", { className: "font-medium bg-base-200 sticky left-0 z-10 whitespace-nowrap" });
    labelCell.textContent = row.field.label;
    if (row.field.unit) {
      labelCell.appendChild(el("span", { className: "text-base-content/40 ml-1 text-xs" }, `(${row.field.unit})`));
    }
    tr.appendChild(labelCell);

    // Sandvik value
    const sandvikCell = el("td", { className: "bg-primary/5 font-semibold" });
    sandvikCell.textContent = formatSpec(row.sandvikValue, "", row.field.type);
    tr.appendChild(sandvikCell);

    // Competitor values
    for (const comp of row.competitors) {
      const td = el("td");
      td.textContent = formatSpec(comp.value, "", row.field.type);
      if (comp.comparison === "sandvik-better") {
        td.classList.add("text-error", "opacity-70");
      } else if (comp.comparison === "competitor-better") {
        td.classList.add("text-success", "font-semibold");
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  section.appendChild(tableWrap);
  return section;
}

function renderBarCharts(product, selected) {
  const section = el("div", { className: "space-y-3" });
  section.appendChild(
    el("h2", { className: "text-xl font-bold" }, "Visual Comparison")
  );

  const specKeys = BAR_CHART_SPECS[product.category] || [];
  const specFields = getSpecFields(product.category);

  for (const key of specKeys) {
    const field = specFields.find((f) => f.key === key);
    if (!field) continue;

    const sandvikVal = product.specs[key];
    if (sandvikVal == null) continue;

    const allVals = [sandvikVal, ...selected.map((c) => c.specs[key] || 0)];
    const maxVal = Math.max(...allVals);

    const chartCard = el("div", { className: "bg-base-100 rounded-lg p-4 border border-base-300" });
    chartCard.appendChild(
      el("div", { className: "text-sm font-semibold mb-3" }, `${field.label} (${field.unit})`)
    );

    // Sandvik bar
    chartCard.appendChild(createBar(product.name, sandvikVal, maxVal, field.unit, true, field.higherIsBetter));

    // Competitor bars
    for (const comp of selected) {
      const val = comp.specs[key];
      if (val == null) continue;
      chartCard.appendChild(createBar(comp.name, val, maxVal, field.unit, false, field.higherIsBetter));
    }

    section.appendChild(chartCard);
  }

  return section;
}

function createBar(label, value, maxVal, unit, isSandvik, higherIsBetter) {
  const pct = percentOf(value, maxVal);
  const row = el("div", { className: "mb-2" });
  row.appendChild(
    el("div", { className: "flex justify-between text-xs mb-1" }, [
      el("span", { className: isSandvik ? "font-bold text-primary" : "text-base-content/70" }, label),
      el("span", { className: "font-mono" }, `${formatNumber(value)} ${unit}`),
    ])
  );
  const barBg = el("div", { className: "w-full bg-base-200 rounded-full h-5" });
  const bar = el("div", {
    className: `bar-chart-bar h-5 rounded-full ${isSandvik ? "bg-primary" : "bg-neutral/40"}`,
  });
  bar.style.width = `${pct}%`;
  barBg.appendChild(bar);
  row.appendChild(barBg);
  return row;
}

function renderBookmarkButton(container, product, selected) {
  container.innerHTML = "";
  if (selected.length === 0) return;

  const selectedIds = selected.map((c) => c.id);
  const alreadyBookmarked = isBookmarked(product.id, selectedIds);

  if (alreadyBookmarked) {
    const btn = el("button", {
      className: "btn btn-outline btn-secondary gap-2",
      onClick: () => {
        const bm = getBookmarks().find(
          (b) =>
            b.sandvikProductId === product.id &&
            JSON.stringify([...b.competitorProductIds].sort()) ===
              JSON.stringify([...selectedIds].sort())
        );
        if (bm) {
          removeBookmark(bm.id);
          renderBookmarkButton(container, product, selected);
        }
      },
    });
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>`;
    btn.appendChild(document.createTextNode(" Saved"));
    container.appendChild(btn);
  } else {
    const label = `${product.name} vs ${selected.map((c) => c.name).join(", ")}`;
    const btn = el("button", {
      className: "btn btn-secondary gap-2",
      onClick: () => {
        addBookmark(product.id, selectedIds, label);
        renderBookmarkButton(container, product, selected);
      },
    });
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>`;
    btn.appendChild(document.createTextNode(" Save Comparison"));
    container.appendChild(btn);
  }
}
