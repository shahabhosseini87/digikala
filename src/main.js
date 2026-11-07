import {
  createShortcuts,
  createGridImages,
  createGridImages_2,
  createGridImages_3,
  createMainCategory
} from "./components/pageComponents.js";
import { createHeader } from "./components/header.js";
import { createAmazingProducts } from "./components/swipers/amazingProducts.js";
import { createCategorisedSwiper } from "./components/swipers/categorisedSwiper.js";
import { createSwiperBanner } from "./components/swipers/swiperBanner.js";
import { createPopularSection } from "./components/swipers/lastSwiper.js";
import { createFooter } from "./components/footer.js";


const app = document.getElementById("app");
async function init() {
  const banner = await createSwiperBanner();

document.body.insertAdjacentElement("afterbegin", banner);

banner.initSwiper();
  
  document.body.insertAdjacentElement("afterbegin", await createHeader());
  app.insertAdjacentElement("beforeend", await createShortcuts());
  const amazing = await createAmazingProducts();
  app.insertAdjacentElement("beforeend", amazing);
  amazing.initSwiper();
  app.insertAdjacentElement("beforeend", await createGridImages());
  const categorised = await createCategorisedSwiper();
  app.insertAdjacentElement("beforeend", categorised);
  categorised.initSwiper();
  app.insertAdjacentElement("beforeend", await createGridImages_2());
  app.insertAdjacentElement("beforeend", await createMainCategory());
  app.insertAdjacentElement("beforeend", await createGridImages_3());
  app.insertAdjacentElement("beforeend", await createPopularSection());
  document.body.insertAdjacentElement("beforeend", await createFooter());



}

init();
