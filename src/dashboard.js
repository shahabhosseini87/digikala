import { request } from "./api/apiConfig.js";
import {
  getSavedProducts,
  setSavedProducts,
  removeFromSavedStorage,
  updateSavedStorage,
} from "./storage/storage.js";

const CATEGORIES = [
  "کالای دیجیتال",
  "مد و پوشاک",
  "آرایشی و بهداشتی",
  "سلامتی و پزشکی",
  "اسباب بازی",
];

const SORT_MODES = [
  { label: "مرتب‌سازی", fn: null },
  {
    label: "قیمت: کم به زیاد",
    fn: (a, b) => getFinalPrice(a) - getFinalPrice(b),
  },
  {
    label: "قیمت: زیاد به کم",
    fn: (a, b) => getFinalPrice(b) - getFinalPrice(a),
  },
  {
    label: "بیشترین تخفیف",
    fn: (a, b) => (b.discount ?? 0) - (a.discount ?? 0),
  },
];

let allProducts = [];
let searchTerm = "";
let sortIndex = 0;
let editingId = null;
let MAX_MAINPAGE_PRODUCT = 12;

const tableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");
const openModalBtn = document.getElementById("openModalBtn");

const tableEl = tableBody.closest("table");
tableEl.classList.add("block", "w-full", "lg:table");
tableEl.tHead?.classList.add("hidden", "lg:table-header-group");
tableBody.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "lg:table-row-group");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const formatPrice = (n) => Number(n ?? 0).toLocaleString("fa-IR");

function getFinalPrice(x) {
  const preprice = Number(x.preprice) || 0;
  const discount = Number(x.discount) || 0;
  return Math.round(preprice - (preprice * discount) / 100);
}

function createRow(product, isSaved = false) {
  const tr = document.createElement("tr");
  tr.dataset.id = product.id;
  tr.className = isSaved
    ? "block rounded-xl border border-slate-300 overflow-hidden lg:table-row lg:rounded-none lg:overflow-visible bg-red-400 hover:bg-red-300 transition-colors"
    : "block rounded-xl border border-slate-300 overflow-hidden lg:table-row lg:rounded-none lg:overflow-visible hover:bg-slate-50 transition-colors";

  const cellClass =
    "p-3 border-b border-slate-300 align-middle flex items-center justify-between gap-3 before:content-[attr(data-label)] before:text-xs before:font-semibold before:text-slate-500 lg:table-cell lg:border lg:before:hidden";

  tr.innerHTML = `
    <td class="${cellClass}" data-label="شناسه محصول">${escapeHtml(product.code ?? product.id)}</td>

    <td class="${cellClass}" data-label="تصویر" data-span="full">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.discription)}" class="w-16 h-16 object-cover rounded-lg bg-slate-100" />
    </td>

    <td class="${cellClass}" data-label="اطلاعات محصول" data-span="full">
      <div class="text-slate-800">${escapeHtml(product.discription)}</div>
    </td>

    <td class="${cellClass}" data-label="تخفیف">${escapeHtml(product.discount ?? 0)}%</td>

    <td class="${cellClass}" data-label="قیمت قبلی">${formatPrice(product.preprice)}</td>

    <td class="${cellClass} font-semibold text-slate-900" data-label="قیمت نهایی">
      ${formatPrice(getFinalPrice(product))}
    </td>

    <td class="${cellClass} text-center" data-label="دسته بندی">
      ${escapeHtml(product.category)}
    </td>

    <td class="${cellClass} text-center" data-label="عملیات">
      <div class="flex flex-wrap items-center justify-center gap-2 lg:flex-col">

        <button data-action="edit" data-id="${escapeHtml(product.id)}" class="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          ویرایش
        </button>

        <button data-action="delete" data-id="${escapeHtml(product.id)}" class="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">
          حذف
        </button>

       ${
         isSaved
           ? `<button data-action="removeFromMain" data-id="${escapeHtml(product.id)}" class="p-2 text-xs bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50">حذف از صفحه اصلی</button>`
           : `<button data-action="addToHtml" data-id="${escapeHtml(product.id)}" class="p-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">افزودن به صفحه اصلی</button>`
       }

      </div>
    </td>
  `;

  return tr;
}
function getVisibleProducts() {
  let list = allProducts.filter((product) => {
    return `${product.category ?? ""} ${product.discription ?? ""}`
      .toLowerCase()
      .includes(searchTerm);
  });
  const sorter = SORT_MODES[sortIndex].fn;

  list.sort(
    sorter ?? ((a, b) => (Number(a.code) || 0) - (Number(b.code) || 0)),
  );
  return list;
}

function renderTable() {
  const list = getVisibleProducts();
  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML = `<tr class="block md:col-span-2 lg:table-row"><td colspan="8" class="p-6 text-center text-slate-500 border border-slate-300">محصولی وجود ندارد</td></tr>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  const savedIds = new Set(getSavedProducts().map((p) => String(p.id)));
  list.forEach((product) =>
    fragment.appendChild(createRow(product, savedIds.has(String(product.id)))),
  );
  tableBody.appendChild(fragment);
}

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderTable();
});
sortBtn.addEventListener("click", () => {
  sortIndex = (sortIndex + 1) % SORT_MODES.length;
  sortBtn.querySelector("span").textContent = SORT_MODES[sortIndex].label;
  renderTable();
});
function getNextCode() {
  const codes = allProducts.map((p) => Number(p.code) || 0);
  return Math.max(0, ...codes) + 1;
}

const modal = document.createElement("div");
modal.className =
  "hidden fixed inset-0 z-50 bg-black/50 items-center justify-center p-4";

modal.innerHTML = `
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
    <h2 id="modalTitle" class="text-lg font-bold mb-4">محصول جدید</h2>
    <form id="productForm" class="space-y-3">
      <textarea name="discription" required rows="3" placeholder="توضیحات محصول" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"></textarea>
      <input name="image" placeholder="آدرس تصویر (URL)" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="preprice" type="number" min="0" required placeholder="قیمت قبلی" class="border border-slate-300 rounded-xl px-3 py-2 text-sm" />
        <input name="discount" type="number" min="0" max="100" placeholder="تخفیف (٪)" class="border border-slate-300 rounded-xl px-3 py-2 text-sm" />
      </div>
      <select name="category" required class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white">
        <option value="">انتخاب دسته بندی</option>
        ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
      </select>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" id="cancelModalBtn" class="px-4 py-2 text-sm border border-slate-300 rounded-xl hover:bg-slate-50">انصراف</button>
        <button type="submit" class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">ذخیره</button>
      </div>
    </form>
  </div>
`;
document.body.appendChild(modal);

const form = modal.querySelector("#productForm");
const modalTitle = modal.querySelector("#modalTitle");
function openModal(product = null) {
  editingId = product ? product.id : null;
  modalTitle.textContent = product ? "ویرایش محصول" : "محصول جدید";
  form.reset();

  if (product) {
    ["discription", "image", "preprice", "discount", "category"].forEach(
      (name) => {
        form.elements[name].value = product[name] ?? "";
      },
    );
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  editingId = null;
}
modal.querySelector("#cancelModalBtn").addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

openModalBtn.addEventListener("click", () => openModal());
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  const payload = {
    discription: data.discription.trim(),
    image: data.image.trim(),
    preprice: Number(data.preprice) || 0,
    discount: Number(data.discount) || 0,
    category: data.category,
  };

  try {
    if (editingId !== null) {
      await request(`/products/${editingId}`, {
        method: "PATCH",
        body: payload,
      });
      updateSavedStorage(editingId, payload, getFinalPrice);
    } else {
      await request("/products", {
        method: "POST",
        body: { code: getNextCode(), ...payload },
      });
    }

    closeModal();
    renderProducts();
  } catch (error) {
    console.error("خطا در ذخیره محصول:", error);
    alert("ذخیره محصول با خطا مواجه شد.");
  }
});

async function renderProducts() {
  try {
    allProducts = await request("/products");
    renderTable();
  } catch (error) {
    console.error("خطا در دریافت محصولات:", error);
    tableBody.innerHTML = `<tr class="block md:col-span-2 lg:table-row"><td colspan="8" class="p-6 text-center text-red-500 border border-slate-300">خطا در دریافت محصولات</td></tr>`;
  }
}
async function deleteProduct(id) {
  const confirmation = confirm("ایا از حذف این محصول اطمینان دارید؟ ");
  if (!confirmation) return;
  try {
    await request(`/products/${id}`, { method: "DELETE" });
    removeFromSavedStorage(id);
    renderProducts();
  } catch (error) {
    alert("حذف محصول با خطا مواجه شد.");
    console.error(error);
  }
}
tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "delete") deleteProduct(id);

  if (action === "edit") {
    const product = allProducts.find((p) => String(p.id) === String(id));
    if (product) openModal(product);
  }
  if (action === "addToHtml") addToMainPage(id);
  if (action === "removeFromMain") removeFromMainPage(id); // NEW
});

function addToMainPage(id) {
  const product = allProducts.find((p) => String(p.id) === String(id));
  if (!product) {
    alert("محصول پیدا نشد!");
    return;
  }

  const saved = getSavedProducts();

  if (saved.some((p) => String(p.id) === String(id))) {
    alert("این محصول قبلاً اضافه شده است.");
    return;
  }

  if (saved.length >= MAX_MAINPAGE_PRODUCT) {
    alert("به حداکثر تعداد رسیده‌اید، لطفاً یکی را حذف کنید.");
    return;
  }

  saved.push({ ...product, finalPrice: getFinalPrice(product) });
  setSavedProducts(saved);
  renderTable();
  alert("با موفقیت اضافه شد.");
}

function removeFromMainPage(id) {
  if (!confirm("این محصول از صفحه اصلی حذف شود؟")) return;

  removeFromSavedStorage(id);
  renderTable();
}

renderProducts();