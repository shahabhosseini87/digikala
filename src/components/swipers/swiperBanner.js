import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import { request } from "../../api/apiConfig";

export async function createSwiperBanner() {
  const section = document.createElement("section");
  section.className = "w-full mt-5 relative";

  const swiperEl = document.createElement("div");
  swiperEl.className = "swiper mySwiper";
  swiperEl.setAttribute("dir", "rtl");

  const swiperWrapper = document.createElement("div");
  swiperWrapper.className = "swiper-wrapper";

  const swiperImages = await request("/components");

  swiperImages.swiper_1.forEach((element) => {
    const slide = document.createElement("div");
    const img = document.createElement("img");

    slide.className = "swiper-slide";

    img.dataset.id = element.id;
    img.src = element.image;
    img.alt = element.alt;
    img.className = "h-[200px] md:h-[400px] object-cover w-full";

    slide.appendChild(img);
    swiperWrapper.appendChild(slide);
  });

  swiperEl.appendChild(swiperWrapper);
  section.appendChild(swiperEl);

  section.initSwiper = () => {
    return new Swiper(swiperEl, {
      modules: [Autoplay],

      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      grabCursor: true,

      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  };

  return section;
}   