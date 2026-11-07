import { getSavedProducts } from "../../storage/storage";
import { createProductSlide } from "../createSlide";
import Swiper from "swiper";

export async function createAmazingProducts() {
  let allproducts = getSavedProducts();

  const section = document.createElement("section");
  section.className =
    "mt-5 w-full bg-primary-red flex flex-col lg:flex-row items-center overflow-hidden rounded-xl shadow-md";

  const side = document.createElement("div");
  side.className =
    "w-full lg:w-60 shrink-0 flex lg:flex-col items-center justify-between lg:justify-center p-4 gap-4 text-white";
  side.setAttribute("dir", "rtl");

  const iconWrap = document.createElement("div");
  iconWrap.className = "hidden lg:block";

  const icon = document.createElement("img");
  icon.className = "size-16 object-contain";
  icon.src = "https://dkstatics-public.digikala.com/digikala-static/0d072059918d0c22b88320554ce4b3e07d0472f2_1746354551.svg";
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");

  iconWrap.appendChild(icon);

  const logoTimer = document.createElement("div");
  logoTimer.className = "flex items-center lg:flex-col gap-4";

  const logo = document.createElement("img");
  logo.className = "h-12 w-28 object-contain";
  logo.src =
    "https://dkstatics-public.digikala.com/digikala-static/e0c05f5d67bf71be7605ec22cb3ee6be57d43e94_1746354561.svg";
  logo.alt = "شگفت‌انگیز";

  const countdown = document.createElement("div");
  countdown.className = "flex items-center gap-1";
  countdown.setAttribute("dir", "ltr");
  countdown.setAttribute("aria-label", "زمان باقی‌مانده");

  const hours = document.createElement("div");
  hours.id = "hours";
  hours.className =
    "grid size-7 place-items-center rounded bg-white text-slate-900 text-xs font-bold";

  const colon1 = document.createElement("span");
  colon1.className = "font-bold text-white";
  colon1.textContent = ":";

  const minutes = document.createElement("div");
  minutes.id = "minutes";
  minutes.className =
    "grid size-7 place-items-center rounded bg-white text-slate-900 text-xs font-bold";

  const colon2 = document.createElement("span");
  colon2.className = "font-bold text-white";
  colon2.textContent = ":";

  const seconds = document.createElement("div");
  seconds.id = "seconds";
  seconds.className =
    "grid size-7 place-items-center rounded bg-white text-slate-900 text-xs font-bold";

  countdown.append(hours, colon1, minutes, colon2, seconds);

  logoTimer.append(logo, countdown);

  const viewAll = document.createElement("a");
  viewAll.href = "#";
  viewAll.className =
    "flex items-center gap-1 bg-white p-2 rounded-xl text-[#ef394e] text-xs font-bold hover:bg-slate-100 transition-all";

  const viewAllText = document.createElement("span");
  viewAllText.textContent = "مشاهده همه ";

  viewAll.append(viewAllText);

  side.append(iconWrap, logoTimer, viewAll);

  let remainingTime = 12 * 60 * 60 + 50 * 60;

  const updateCountdown = () => {
    const h = Math.floor(remainingTime / 3600);
    const m = Math.floor((remainingTime % 3600) / 60);
    const s = remainingTime % 60;

    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");

    if (remainingTime <= 0) {
      remainingTime = 12 * 60 * 60 + 50 * 60;
    } else {
      remainingTime--;
    }
  };

  updateCountdown();

  const countdownInterval = setInterval(updateCountdown, 1000);

  const observer = new MutationObserver(() => {
    if (!section.isConnected) {
      clearInterval(countdownInterval);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const sliderWrap = document.createElement("div");
  sliderWrap.className = "w-full p-5";

  const swiperEl = document.createElement("div");
  swiperEl.className = "swiper mySwiper-3";

  const swiperWrapper = document.createElement("div");
  swiperWrapper.className = "swiper-wrapper swiper-3-wrapper";

  allproducts.forEach((product) => {
    const slide = createProductSlide(product);
    swiperWrapper.appendChild(slide);
  });

  swiperEl.appendChild(swiperWrapper);
  sliderWrap.appendChild(swiperEl);

  section.append(side, sliderWrap);

  section.initSwiper = () => {
    return new Swiper(swiperEl, {
      slidesPerView: 2.2,
      spaceBetween: 8,
      freeMode: true,

      breakpoints: {
        480: { slidesPerView: 2.8, spaceBetween: 8 },
        640: { slidesPerView: 3.5, spaceBetween: 10 },
        768: { slidesPerView: 4.2, spaceBetween: 10 },
        1024: { slidesPerView: 3.2, spaceBetween: 12 },
        1280: { slidesPerView: 7, spaceBetween: 12 },
      },
    });
  };

  return section;
}
