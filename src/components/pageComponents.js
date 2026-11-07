import { request } from "../api/apiConfig";

  export async function createShortcuts() {
    const container = document.createElement("div");
    container.className =
      "w-full mt-4  font-digikala grid grid-cols-4 lg:grid-cols-10 items-center justify-center gap-y-3 gap-x-2 overflow-x-auto pb-2 scrollbar-none";
    container.setAttribute("dir", "rtl");

    try {
      const data = await request("/components");
      const shortcuts = data?.shortcut;

      if (!Array.isArray(shortcuts)) {
        throw new Error("دیتای shortcut باید از نوع آرایه باشد");
      }

      shortcuts.forEach((element) => {
        if (!element.image) {
          const more = document.createElement("div");
          more.className =
            "flex flex-col items-center gap-1 shrink-0 w-[82px] select-none cursor-pointer";

          const dots = document.createElement("div");
          dots.className =
            "size-[52px] rounded-full bg-slate-100 flex justify-center items-center text-slate-800";
          dots.insertAdjacentHTML(
            "beforeend",
            `<svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>`,
          );

          const moreText = document.createElement("span");
          moreText.className = "text-xs text-slate-700 text-center";
          moreText.textContent = element.title;

          more.appendChild(dots);
          more.appendChild(moreText);
          container.appendChild(more);
          return;
        }

        const link = document.createElement("a");
        link.className =
          "flex flex-col items-center shrink-0 w-[96px] select-none";
        link.href = element.url || "#";

        const imgBox = document.createElement("div");
        imgBox.className = "size-[52px] leading-[0]";

        const img = document.createElement("img");
        img.className = "w-full h-full inline-block object-contain";
        img.width = 52;
        img.height = 52;
        img.src = element.image;
        img.alt = element.title;
        img.loading = "lazy";

        const text = document.createElement("span");
        text.className =
          "w-full mt-1 text-xs text-slate-700 text-center line-clamp-2";
        text.textContent = element.title;

        imgBox.appendChild(img);
        link.appendChild(imgBox);
        link.appendChild(text);
        container.appendChild(link);
      });
    } catch (error) {
      console.error("خطا در دریافت میانبرها:", error);
      container.textContent = "میانبری برای نمایش وجود ندارد !";
    }

    return container;
  }

export async function createGridImages() {
  const grid = document.createElement("div");
  grid.className = "w-full h-fit grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5";

  try {
    const data = await request("/components");
    const images = data?.images;

    if (!Array.isArray(images)) {
      throw new Error("دیتای تصاویر باید از نوع آرایه باشد");
    }

    images.forEach((item) => {
      const box = document.createElement("div");
      box.className = "size-fit rounded-xl overflow-hidden";

      const img = document.createElement("img");
      img.title = item.title;
      img.src = item.src;
      img.alt = item.title;

      box.appendChild(img);
      grid.appendChild(box);
    });
  } catch (error) {
    console.error("خطا در دریافت تصاویر:", error);
    grid.textContent = "تصویری برای نمایش وجود ندارد!";
  }

  return grid;
}

export async function createGridImages_2() {
  const grid = document.createElement("div");
  grid.className = "w-full h-fit grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5";

  try {
    const data = await request("/components");
    const images = data?.images;

    if (!Array.isArray(images)) {
      throw new Error("دیتای تصاویر باید از نوع آرایه باشد");
    }

    images.forEach((item) => {
      const box = document.createElement("div");
      box.className = "size-fit rounded-xl overflow-hidden";

      const img = document.createElement("img");
      img.title = item.title;
      img.src = item.src;
      img.alt = item.title;

      box.appendChild(img);
      grid.appendChild(box);
    });
  } catch (error) {
    console.error("خطا در دریافت تصاویر:", error);
    grid.textContent = "تصویری برای نمایش وجود ندارد!";
  }

  return grid;
}
export async function createMainCategory() {
  const section = document.createElement("section");
  section.className = "w-full flex flex-col items-center py-8 px-4";
  section.setAttribute("dir", "rtl");

  const titleBox = document.createElement("div");
  titleBox.className = "w-full lg:flex lg:justify-start";

  const title = document.createElement("h2");
  title.className = "pb-8 text-xl font-bold";
  title.textContent = "دسته‌بندی‌ها";

  titleBox.appendChild(title);

  const grid = document.createElement("div");
  grid.className =
    "w-full grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-6";

  try {
    const data = await request("/components");
    const categories = data?.categories;

    if (!Array.isArray(categories)) {
      throw new Error("دیتای دسته‌بندی‌ها باید از نوع آرایه باشد");
    }

    const fragment = document.createDocumentFragment();

    categories.forEach((category) => {
      if (!category || typeof category.title !== "string") {
        console.warn("Invalid category:", category);
        return;
      }

      const link = document.createElement("a");
      link.className = "flex flex-col items-center w-full lg:w-max";
      link.href = category.url || "#";
      link.dataset.id = category.id;

      const imgWrap = document.createElement("div");
      imgWrap.className = "mb-1 w-[100px] h-[100px] leading-[0]";
      imgWrap.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.className = "w-full inline-block object-contain";
      img.width = 100;
      img.height = 100;
      img.src = category.image;
      img.alt = "";
      img.loading = "lazy";

      const name = document.createElement("span");
      name.className = "text-neutral-900 line-clamp-2 text-center h-9 text-sm";
      name.textContent = category.title;

      imgWrap.appendChild(img);
      link.appendChild(imgWrap);
      link.appendChild(name);
      fragment.appendChild(link);
    });

    grid.appendChild(fragment);
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    grid.textContent = "دسته‌بندی‌ای برای نمایش وجود ندارد !";
  }

  section.appendChild(titleBox);
  section.appendChild(grid);

  return section;
}

export async function createGridImages_3() {
  const grid = document.createElement("div");
  grid.className = "w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5";

  try {
    const data = await request("/components");
    const images = data?.bannerImg;

    if (!Array.isArray(images)) {
      throw new Error("دیتای تصاویر باید از نوع آرایه باشد");
    }

    images.forEach((item) => {
      const box = document.createElement("div");
      box.className = "size-fit rounded-xl overflow-hidden";

      const img = document.createElement("img");
      img.title = item.title;
      img.src = item.src;
      img.alt = item.title;

      box.appendChild(img);
      grid.appendChild(box);
    });
  } catch (error) {
    console.error("خطا در دریافت تصاویر:", error);
    grid.textContent = "تصویری برای نمایش وجود ندارد!";
  }

  return grid;
}
