import { events } from "../app.js";

const STORAGE_KEY = "sandvik-comparisons-bookmarks";

export function getBookmarks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addBookmark(sandvikProductId, competitorProductIds, label) {
  const bookmarks = getBookmarks();
  const existing = bookmarks.find(
    (b) =>
      b.sandvikProductId === sandvikProductId &&
      JSON.stringify([...b.competitorProductIds].sort()) ===
        JSON.stringify([...competitorProductIds].sort())
  );
  if (existing) return existing;

  const newBookmark = {
    id: `bm_${Date.now()}`,
    sandvikProductId,
    competitorProductIds: [...competitorProductIds],
    createdAt: new Date().toISOString(),
    label,
  };
  bookmarks.push(newBookmark);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  events.emit("bookmarks-changed", { count: bookmarks.length });
  return newBookmark;
}

export function removeBookmark(bookmarkId) {
  const bookmarks = getBookmarks().filter((b) => b.id !== bookmarkId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  events.emit("bookmarks-changed", { count: bookmarks.length });
}

export function isBookmarked(sandvikProductId, competitorProductIds) {
  return getBookmarks().some(
    (b) =>
      b.sandvikProductId === sandvikProductId &&
      JSON.stringify([...b.competitorProductIds].sort()) ===
        JSON.stringify([...competitorProductIds].sort())
  );
}

export function getBookmarkCount() {
  return getBookmarks().length;
}
