import { getSavedProducts } from "../../storage/storage";
import { createProductSlide } from "../createSlide";
import Swiper from "swiper";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const CATEGORIES = [
  "همه",
  "آرایشی و بهداشتی",
  "مد و پوشاک",
  "سلامتی و پزشکی",
  "اسباب بازی",
  "کالای دیجیتال",
];

export function getVisibleSlides(products, category) {
  if (category === "همه") return products;
  return products.filter((p) => p.category === category);
}

export async function createCategorisedSwiper() {
  const allProducts = getSavedProducts();
  let selectedCategory = "همه";
  let swiper = null;

  const VIEW_ALL_HREF = "/search/?sort=7";
  const ADDRESS_TEXT = "تحویل به حر، خ. کارگر جنوبی، خ. پاستور، ک. ابراهیمی";

  const section = document.createElement("section");
  section.dir = "rtl";
  section.className = "w-full h-fit p-3 mt-5 rounded-large overflow-hidden";
  section.style.background =
    "linear-gradient(to left bottom, rgb(255, 249, 229), rgb(255, 249, 229))";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between";

  const titleRight = document.createElement("div");
  titleRight.className = "flex items-center gap-2";

  const icon = document.createElement("img");
  icon.src =
    "https://dkstatics-public.digikala.com/digikala-static/5ad0fbd69e8cd68042835241e77b05b0bd61c974_1788691240.png";
  icon.alt = "";
  icon.height = 24;
  icon.className = "inline-block";
  icon.style.height = "24px";
  icon.style.objectFit = "contain";

  const title = document.createElement("span");
  title.className = "text-h4 text-neutral-800";
  title.textContent = "تحویل بگیر!";
  titleRight.append(icon, title);

  const viewAll = document.createElement("a");
  viewAll.href = VIEW_ALL_HREF;
  viewAll.className =
    "flex items-center gap-1 text-body-2-compact text-neutral-600";
  viewAll.innerHTML = `<span>مشاهده همه</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`;

  titleRow.append(titleRight, viewAll);

  const addressBox = document.createElement("div");
  addressBox.className =
    "flex items-center gap-1 px-3 py-2.5 rounded-md mt-3 cursor-pointer";
  addressBox.style.background = "rgba(255,255,255,0.6)";

  const addressText = document.createElement("p");
  addressText.className =
    "font-medium text-body-2-compact text-neutral-600 grow overflow-hidden whitespace-nowrap text-ellipsis";
  addressText.textContent = ADDRESS_TEXT;

  const editIcon = document.createElement("span");
  editIcon.setAttribute("aria-hidden", "true");
  editIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`;

  addressBox.append(addressText, editIcon);

  const buttons = document.createElement("div");
  buttons.className =
    "flex flex-nowrap items-center gap-2 mt-3 pb-4 overflow-x-auto hide-scrollbar";
  buttons.setAttribute("role", "tablist");
  buttons.setAttribute("aria-label", "دسته‌بندی کالاها");

  const sliderWrap = document.createElement("div");
  sliderWrap.className = "w-full min-w-0";
  const swiperEl = document.createElement("div");
  swiperEl.className = "swiper mySwiper-categorised";
  swiperEl.dir = "rtl";
  const swiperWrapper = document.createElement("div");
  swiperWrapper.className = "swiper-wrapper categorised-swiper-wrapper";

  swiperEl.appendChild(swiperWrapper);
  sliderWrap.appendChild(swiperEl);
  section.append(titleRow, addressBox, buttons, sliderWrap);

  function renderButtons() {
    buttons.innerHTML = "";
    CATEGORIES.forEach((category) => {
      const btn = document.createElement("button");
      const isActive = category === selectedCategory;
      btn.type = "button";
      btn.dataset.category = category;
      btn.textContent = category;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(isActive));
      btn.className =
        "rounded-full px-4 py-2 font-medium text-body-2-compact shrink-0 " +
        "text-neutral-800 border border-solid transition-colors " +
        (isActive
          ? "bg-white border-neutral-800"
          : "bg-transparent border-neutral-200");
      buttons.appendChild(btn);
    });
  }

  function renderSlides() {
    const list = getVisibleSlides(allProducts, selectedCategory);
    swiperWrapper.innerHTML = "";

    const fragment = document.createDocumentFragment();
    list.forEach((p) => fragment.appendChild(createProductSlide(p)));
    swiperWrapper.appendChild(fragment);

    if (swiper) {
      swiper.update();
      swiper.slideTo(0, 0);
    }
  }

  buttons.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category]");
    if (!btn) return;
    selectedCategory = btn.dataset.category;
    renderButtons();
    renderSlides();
  });

  renderButtons();
  renderSlides();

  section.initSwiper = () => {
    swiper = new Swiper(swiperEl, {
      modules: [FreeMode],
      slidesPerView: 2.2,
      spaceBetween: 12,
      freeMode: true,
      slidesOffsetBefore: 4,
      slidesOffsetAfter: 4,
      breakpoints: {
        480: { slidesPerView: 2.8, spaceBetween: 12 },
        640: { slidesPerView: 3.5, spaceBetween: 12 },
        768: { slidesPerView: 4.2, spaceBetween: 12 },
        1024: { slidesPerView: 3.2, spaceBetween: 12 },
        1280: { slidesPerView: 7, spaceBetween: 20 },
      },
    });
    return swiper;
  };

  return section;
}
