const STORAGE_KEY = "mainPageProducts";
export function getSavedProducts() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setSavedProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  const newEvent = new Event("mainPageProductsChanged");
  window.dispatchEvent(newEvent);
}

export function removeFromSavedStorage(id) {
  try {
    const saved = getSavedProducts().filter(
      (p) => String(p.id) !== String(id)
    );
    setSavedProducts(saved);
  } catch (error) {
    console.error("خطا در به‌روزرسانی localStorage:", error);
  }
}
export function updateSavedStorage(id, payload, getFinalPriceFn) {
  try {
    const saved = getSavedProducts().map((p) => {
      if (String(p.id) !== String(id)) return p;
      const updated = { ...p, ...payload };
      return { ...updated, finalPrice: getFinalPriceFn(updated) };
    });
    setSavedProducts(saved);
  } catch (error) {
    console.error("خطا در به‌روزرسانی localStorage:", error);
  }
}