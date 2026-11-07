import Swiper from "swiper";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";

import { request } from "../../api/apiConfig.js";
import { createPopularSlide } from "../createSlide.js";

export async function createPopularSection() {
  const section = document.createElement("div");
  section.className = "relative flex-1 w-full mt-5 font-digikala";

  const swiperEl = document.createElement("div");
  swiperEl.className = "swiper";
  swiperEl.setAttribute("dir", "rtl");

  const swiperWrapper = document.createElement("div");
  swiperWrapper.className = "swiper-wrapper";

  const buttonClass =
    "hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 size-8 items-center justify-center rounded-full bg-white shadow-md cursor-pointer [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none";

  const nextBtn = document.createElement("div");
  nextBtn.className = buttonClass + " left-2";

  const prevBtn = document.createElement("div");
  prevBtn.className = buttonClass + " right-2";

  try {
    const data = await request("/components");
    const products = data?.popularProducts;

    if (!Array.isArray(products)) {
      throw new Error("دیتای محصولات باید از نوع آرایه باشد");
    }

    for (let i = 0; i < products.length; i += 3) {
      swiperWrapper.appendChild(createPopularSlide(products.slice(i, i + 3)));
    }
  } catch (error) {
    console.error("خطا در دریافت محصولات:", error);
    section.textContent = "محصولی برای نمایش وجود ندارد !";
    return section;
  }

  swiperEl.appendChild(swiperWrapper);
  section.appendChild(swiperEl);
  section.appendChild(nextBtn);
  section.appendChild(prevBtn);

  new Swiper(swiperEl, {
    modules: [Navigation, FreeMode],
    freeMode: true,
    spaceBetween: 16,
    slidesPerView: 1.15,
    observer: true,
    observeParents: true,
    navigation: { nextEl: nextBtn, prevEl: prevBtn },
    breakpoints: {
      640: { slidesPerView: 2.2 },
      1024: { slidesPerView: 3.2 },
    },
  });

  return section;
}