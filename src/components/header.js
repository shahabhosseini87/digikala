import { request } from "../api/apiConfig";

function getVisibleCategory(categories, activeId) {
  return (
    categories.filter((category) => String(category.id) === activeId)[0] ?? null
  );
}

const CHEVRON_LEFT = `
  <svg class="size-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5"
       viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>`;

const MENU_ICON = `
  <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2"
       viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;

function renderCategoryContent(category) {
  const wrap = document.createElement("div");

  if (!category) {
    wrap.className = "p-8 text-sm text-slate-500 ";
    wrap.textContent = "محصولی برای نمایش وجود ندارد";
    return wrap;
  }

  wrap.className = "p-8 font-digikala";

  if (category.viewAll && typeof category.viewAll.title === "string") {
    const viewAll = document.createElement("a");
    viewAll.href = category.viewAll.url || "#";
    viewAll.className =
      "inline-flex items-center gap-1 mb-8 text-sm font-bold text-sky-700 hover:text-sky-900";
    viewAll.textContent = category.viewAll.title;
    viewAll.insertAdjacentHTML("beforeend", CHEVRON_LEFT);
    wrap.appendChild(viewAll);
  }

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-4 gap-x-8 gap-y-6" ;

  const columns = Array.isArray(category.columns) ? category.columns : [];

  columns.forEach((column) => {
    if (!Array.isArray(column)) return;

    const colEl = document.createElement("div");
    colEl.className = "flex flex-col gap-6";

    column.forEach((section) => {
      if (!section || typeof section.title !== "string") return;

      const sectionEl = document.createElement("div");

      const title = document.createElement("a");
      title.href = section.url || "#";
      title.className =
        "flex items-center gap-1 border-r-2 border-red-500 pr-2 mb-3 text-sm font-bold text-slate-800 hover:text-red-500 transition-colors";
      title.textContent = section.title;
      title.insertAdjacentHTML("beforeend", CHEVRON_LEFT);
      sectionEl.appendChild(title);

      const items = Array.isArray(section.items) ? section.items : [];

      items.forEach((item) => {
        if (!item || typeof item.title !== "string") return;

        const a = document.createElement("a");
        a.href = item.url || "#";
        a.textContent = item.title;
        a.className =
          "block py-2 pr-2 text-sm text-slate-500 hover:text-red-500 transition-colors";
        sectionEl.appendChild(a);
      });

      colEl.appendChild(sectionEl);
    });

    grid.appendChild(colEl);
  });

  wrap.appendChild(grid);
  return wrap;
}

function createDropdown(navLink, panelParent) {
  const categories = navLink.categories.filter(
    (c) => c && c.id != null && typeof c.title === "string",
  );

  let activeId = categories.length > 0 ? String(categories[0].id) : null;
  let closeTimer;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.dataset.id = navLink.id;
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");
  trigger.className =
    "flex items-center gap-2 px-2 py-1 -mb-3 pb-3 border-b-2 border-transparent font-bold text-slate-900 transition-colors cursor-pointer";
  trigger.insertAdjacentHTML("beforeend", MENU_ICON);

  const triggerText = document.createElement("span");
  triggerText.textContent = navLink.title;
  trigger.appendChild(triggerText);

  const panel = document.createElement("div");
  panel.className =
    "hidden absolute right-4 left-4 top-full z-50 bg-white rounded-b-xl shadow-lg border border-slate-100 overflow-hidden";

  const inner = document.createElement("div");
  inner.className = "flex max-h-[70vh]";

  const sidebar = document.createElement("div");
  sidebar.className = "w-64 shrink-0 overflow-y-auto bg-slate-50 font-digikala";

  categories.forEach((category) => {
    const item = document.createElement("a");
    item.href = category.url || "#";
    item.dataset.categoryId = String(category.id);
    item.className =
      "flex items-center justify-between gap-3 px-6 py-4 text-sm text-slate-700 transition-colors";

    const label = document.createElement("span");
    label.textContent = category.title;

    item.appendChild(label);
    sidebar.appendChild(item);
  });

  const content = document.createElement("div");
  content.className = "flex-1 overflow-y-auto";

  inner.appendChild(sidebar);
  inner.appendChild(content);
  panel.appendChild(inner);
  panelParent.appendChild(panel);

  function highlightSidebar() {
    sidebar.querySelectorAll("[data-category-id]").forEach((el) => {
      const isActive = el.dataset.categoryId === activeId;
      el.classList.toggle("bg-white", isActive);
      el.classList.toggle("text-red-500", isActive);
      el.classList.toggle("font-bold", isActive);
    });
  }

  function render() {
    highlightSidebar();
    content.replaceChildren(
      renderCategoryContent(getVisibleCategory(categories, activeId)),
    );
  }

  function open() {
    clearTimeout(closeTimer);
    panel.classList.remove("hidden");
    trigger.setAttribute("aria-expanded", "true");
    trigger.classList.add("border-red-500");
  }

  function close() {
    clearTimeout(closeTimer);
    panel.classList.add("hidden");
    trigger.setAttribute("aria-expanded", "false");
    trigger.classList.remove("border-red-500");
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 150);
  }

  trigger.addEventListener("mouseenter", open);
  trigger.addEventListener("mouseleave", scheduleClose);
  panel.addEventListener("mouseenter", open);
  panel.addEventListener("mouseleave", scheduleClose);

  trigger.addEventListener("click", () => {
    if (panel.classList.contains("hidden")) open();
    else close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  window.addEventListener("scroll", close, { passive: true });

  sidebar.addEventListener("mouseover", (e) => {
    const item = e.target.closest("[data-category-id]");
    if (!item) return;

    const id = item.dataset.categoryId;
    if (id === activeId) return;

    activeId = id;
    render();
  });

  render();
  return trigger;
}
export async function createHeader() {
  const header = document.createElement("header");

  header.className =
    "w-full bg-white shadow-sm border-b border-slate-200 font-sans sticky top-0 z-50";
  header.setAttribute("dir", "rtl");

  const data = await request("/header");


  const desktop = document.createElement("div");
  desktop.className = "relative hidden lg:block container mx-auto px-4";

  const topRow = document.createElement("div");
  topRow.className = "flex items-center justify-between py-4 gap-6";

  const rightSide = document.createElement("div");
  rightSide.className = "flex items-center gap-8 flex-1";

  const logoBox = document.createElement("div");
  logoBox.className = "w-[195px] h-[30px]";

  const logo = document.createElement("img");
  logo.src = data.logo.image;
  logo.alt = "لوگو";

  logoBox.appendChild(logo);

  const searchWrap = document.createElement("div");
  searchWrap.className = "relative flex-1 max-w-2xl";

  const searchIconWrap = document.createElement("span");
  searchIconWrap.className =
    "absolute inset-y-0 right-0 flex items-center pr-3 gap-x-3 pointer-events-none text-slate-400";

  const searchIconBox = document.createElement("div");
  searchIconBox.className = "size-fit";

  searchIconBox.innerHTML = `
    <svg class="size-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14">
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 11.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11m7.5 2L10 10"
      />
    </svg>
  `;

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "جستجو";

  searchInput.className =
    "w-full bg-slate-100 text-slate-800 pr-12 pl-4 py-3 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all";

  searchIconWrap.appendChild(searchIconBox);
  searchWrap.appendChild(searchIconWrap);
  searchWrap.appendChild(searchInput);

  rightSide.appendChild(logoBox);
  rightSide.appendChild(searchWrap);

  const leftSide = document.createElement("div");
  leftSide.className = "flex items-center gap-4";

  const loginLink = document.createElement("a");

  loginLink.href = "../../dashboard.html";

  loginLink.className =
    "flex items-center justify-center bg-primary-red gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 text-sm font-medium transition-colors";

  loginLink.textContent = "ورود به پنل مدیریت";

  const bellBtn = document.createElement("button");

  bellBtn.className =
    "p-2 text-slate-600 rounded-xl transition-colors relative";

  const bellIconBox = document.createElement("div");
  bellIconBox.className = "size-fit";


  bellBtn.appendChild(bellIconBox);

  const cartBtn = document.createElement("button");

  cartBtn.className =
    "p-2 text-slate-600 rounded-xl transition-colors";

  const cartIconBox = document.createElement("div");
  cartIconBox.className = "size-fit";


  cartBtn.appendChild(cartIconBox);

  leftSide.appendChild(loginLink);
  leftSide.appendChild(bellBtn);
  leftSide.appendChild(cartBtn);

  topRow.appendChild(rightSide);
  topRow.appendChild(leftSide);


  const bottomRow = document.createElement("div");

  bottomRow.className =
    "relative flex items-center justify-between py-3 border-t border-slate-100 text-sm font-digikala max-h-20 overflow-hidden opacity-100 translate-y-0 transition-all duration-300 ease-in-out";

  const nav = document.createElement("nav");

  nav.className =
    "flex p-1 items-center gap-6 text-slate-700 font-medium";

  try {
    const links = data?.links;

    if (!Array.isArray(links)) {
      throw new Error("نوع دیتا نامعتبر است.");
    }

    if (links.length === 0) {
      console.warn("لینکی برای نمایش در هدر وجود ندارد");
      nav.textContent = "لینکی برای نمایش وجود ندارد!";
    } else {
      const fragment = document.createDocumentFragment();

      links.forEach((navLink) => {
        if (
          !navLink ||
          typeof navLink.title !== "string" ||
          (typeof navLink.id !== "string" &&
            typeof navLink.id !== "number")
        ) {
          console.warn("Invalid navigation link:", navLink);
          return;
        }

        if (
          navLink.dropdown &&
          Array.isArray(navLink.categories) &&
          navLink.categories.length > 0
        ) {
      
          fragment.appendChild(createDropdown(navLink, desktop));
          return;
        }

        const a = document.createElement("a");

        a.textContent = navLink.title;
        a.href = navLink.url || "#";
        a.dataset.id = navLink.id;

        fragment.appendChild(a);
      });

      nav.appendChild(fragment);
    }
  } catch (error) {
    console.error("خطا در دریافت لینک‌های هدر:", error);
    nav.textContent = "لینکی برای نمایش وجود ندارد!";
  }

  const location = document.createElement("div");

  location.className =
    "flex items-center gap-2 text-slate-700 cursor-pointer";

  bottomRow.appendChild(nav);
  bottomRow.appendChild(location);

  desktop.appendChild(topRow);
  desktop.appendChild(bottomRow);


  const mobile = document.createElement("div");

  mobile.className =
    "flex lg:hidden items-center justify-between px-4 py-3 gap-3";

  const mobileBellBtn = document.createElement("button");

  mobileBellBtn.className =
    "p-2.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-full shrink-0";

  

  const mobileBellIconBox = document.createElement("div");
  mobileBellIconBox.className = "size-fit ";

    mobileBellIconBox.innerHTML=`<svg
    class='size-6'
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M9.5 4a6.5 6.5 0 0 1 6.5 6.5c0 1.62-.59 3.1-1.57 4.23l5.65 5.65l-.71.71l-5.65-5.65A6.47 6.47 0 0 1 9.5 17A6.5 6.5 0 0 1 3 10.5A6.5 6.5 0 0 1 9.5 4m0 1A5.5 5.5 0 0 0 4 10.5A5.5 5.5 0 0 0 9.5 16a5.5 5.5 0 0 0 5.5-5.5A5.5 5.5 0 0 0 9.5 5"
      />
    </svg>`

  mobileBellBtn.appendChild(mobileBellIconBox);

  const mobileSearchWrap = document.createElement("div");
  mobileSearchWrap.className = "relative flex-1";

  const mobileSearchBox = document.createElement("div");

  mobileSearchBox.className =
    "w-full bg-slate-100 text-slate-800 px-4 py-2.5 rounded-full flex items-center justify-between text-sm border border-slate-200";

  const mobileSearchText = document.createElement("div");

  mobileSearchText.className =
    "flex items-center gap-1 text-slate-500 font-medium text-xs";

  const searchInSpan = document.createElement("span");
  searchInSpan.textContent = "جستجو در";

  const brandSpan = document.createElement("span");

  brandSpan.className = "text-red-600 font-bold tracking-tight";
  brandSpan.textContent = "دیجی‌کالا";

  mobileSearchText.appendChild(searchInSpan);
  mobileSearchText.appendChild(brandSpan);

  const mobileCameraIconBox = document.createElement("div");
  mobileCameraIconBox.className = "size-fit";

  mobileCameraIconBox.innerHTML=`<svg
  class='size-6'
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 4.5a.5.5 0 0 0-.5-.5a.5.5 0 0 0-.5.5v1.53c-2.25.25-4 2.15-4 4.47v5.91L5.41 18h12.18L16 16.41V10.5c0-2.32-1.75-4.22-4-4.47zM11.5 3A1.5 1.5 0 0 1 13 4.5v.71c2.31.65 4 2.79 4 5.29V16l3 3H3l3-3v-5.5C6 8 7.69 5.86 10 5.21V4.5A1.5 1.5 0 0 1 11.5 3m0 19a2.5 2.5 0 0 1-2.45-2h1.04a1.495 1.495 0 0 0 2.82 0h1.04a2.5 2.5 0 0 1-2.45 2"
      />
    </svg>`

  mobileSearchBox.appendChild(mobileSearchText);
  mobileSearchBox.appendChild(mobileCameraIconBox);

  mobileSearchWrap.appendChild(mobileSearchBox);

  mobile.appendChild(mobileBellBtn);
  mobile.appendChild(mobileSearchWrap);


  header.appendChild(desktop);
  header.appendChild(mobile);


  let lastScrollY = window.scrollY;

  let ticking = false;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 50) {
      bottomRow.classList.remove(
        "max-h-0",
        "!py-0",
        "opacity-0",
        "-translate-y-2",
        "pointer-events-none"
      );

      bottomRow.classList.add(
        "max-h-20",
        "opacity-100",
        "translate-y-0"
      );

      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY + 5) {
      bottomRow.classList.add(
        "max-h-0",
        "!py-0",
        "opacity-0",
        "-translate-y-2",
        "pointer-events-none"
      );

      bottomRow.classList.remove(
        "max-h-20",
        "opacity-100",
        "translate-y-0"
      );
    }

      else if (currentScrollY < lastScrollY - 5) {
      bottomRow.classList.remove(
        "max-h-0",
        "!py-0",
        "opacity-0",
        "-translate-y-2",
        "pointer-events-none"
      );

      bottomRow.classList.add(
        "max-h-20",
        "opacity-100",
        "translate-y-0"
      );
    }

    lastScrollY = currentScrollY;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });

      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  return header;
}