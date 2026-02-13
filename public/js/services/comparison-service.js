import { sandvikProducts } from "../data/sandvik-products.js";
import { competitors } from "../data/competitors.js";
import { SPEC_FIELDS } from "../data/comparison-specs.js";

export function getSandvikProduct(productId) {
  return sandvikProducts.find((p) => p.id === productId);
}

export function getCompetitorsForProduct(sandvikProductId) {
  return competitors.filter((c) =>
    c.matchesSandvikIds.includes(sandvikProductId)
  );
}

export function getSpecFields(category) {
  return SPEC_FIELDS[category] || [];
}

export function buildComparisonMatrix(sandvikProduct, selectedCompetitors) {
  const specFields = getSpecFields(sandvikProduct.category);
  return specFields
    .filter((field) => {
      // Only include fields where the Sandvik product or at least one competitor has a value
      const sandvikVal = sandvikProduct.specs[field.key];
      const anyCompetitorHas = selectedCompetitors.some(
        (c) => c.specs[field.key] != null
      );
      return sandvikVal != null || anyCompetitorHas;
    })
    .map((field) => ({
      field,
      sandvikValue: sandvikProduct.specs[field.key],
      competitors: selectedCompetitors.map((c) => {
        const compVal = c.specs[field.key];
        const sandVal = sandvikProduct.specs[field.key];
        return {
          competitorId: c.id,
          value: compVal,
          comparison: compareValues(sandVal, compVal, field),
        };
      }),
    }));
}

function compareValues(sandvikVal, competitorVal, field) {
  if (field.type !== "numeric" || field.higherIsBetter == null) return "neutral";
  if (sandvikVal == null || competitorVal == null) return "neutral";
  if (sandvikVal === competitorVal) return "tie";
  if (field.higherIsBetter) {
    return sandvikVal > competitorVal ? "sandvik-better" : "competitor-better";
  } else {
    return sandvikVal < competitorVal ? "sandvik-better" : "competitor-better";
  }
}
