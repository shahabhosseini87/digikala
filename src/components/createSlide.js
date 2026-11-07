const formatPrice = (n) => Number(n).toLocaleString("fa-IR");
const getFinalPrice = (product) =>
  Math.round(product.preprice * (1 - (Number(product.discount) || 0) / 100));

export function createProductSlide(product) {
  const discount = Number(product.discount) || 0;

  const slide = document.createElement("div");
  slide.className = "swiper-slide !w-auto !h-auto font-digikala";
  slide.dataset.id = product.id;

  const article = document.createElement("article");
  article.className =
    "w-[180px] lg:w-[164px] h-full min-w-[130px] overflow-hidden flex flex-col justify-between bg-white p-2 lg:p-0";
  article.setAttribute("dir", "rtl");

  const imgWrap = document.createElement("div");
  imgWrap.className = "w-[164px] h-[164px] rounded-md overflow-hidden leading-[0]";

  const img = document.createElement("img");
  img.className = "w-full h-full rounded-md inline-block object-contain";
  img.width = 164;
  img.height = 164;
  img.src = product.image;
  img.alt = product.discription;
  img.loading = "lazy";

  imgWrap.appendChild(img);

  const info = document.createElement("div");
  info.className =
    "flex flex-col items-start justify-between w-full h-full gap-2 mt-2 lg:items-end lg:p-2 lg:pt-0";

  const title = document.createElement("p");
  title.className =
    "w-full h-10 lg:h-[50px] line-clamp-2 text-xs font-semibold leading-5 text-[#424750] lg:text-sm lg:font-normal lg:leading-[25px]";
  title.textContent = product.discription;

  const priceWrap = document.createElement("div");

  const priceBox = document.createElement("div");
  priceBox.className = "flex flex-col items-start justify-start h-[42px] pt-0.5";

  if (discount > 0) {
    const discountRow = document.createElement("div");
    discountRow.className = "flex justify-start items-center gap-1";

    const badge = document.createElement("div");
    badge.className =
      "px-1 h-4 shrink-0 flex items-center justify-center rounded-full bg-[#ef394e] text-white";

    const badgeText = document.createElement("span");
    badgeText.className = "text-[11px] font-bold";
    badgeText.textContent = formatPrice(discount) + "٪";

    const oldPrice = document.createElement("span");
    oldPrice.className = "line-through text-xs ml-1 text-[#c0c2c5] leading-4";
    oldPrice.textContent = formatPrice(product.preprice);

    badge.appendChild(badgeText);
    discountRow.appendChild(badge);
    discountRow.appendChild(oldPrice);
    priceBox.appendChild(discountRow);
  } else {
    const spacer = document.createElement("div");
    spacer.className = "h-4";
    priceBox.appendChild(spacer);
  }

  const priceRow = document.createElement("div");
  priceRow.className = "flex items-center";

  const price = document.createElement("span");
  price.className = "text-[#232933] ml-0.5 text-base font-bold leading-6";
  price.textContent = formatPrice(getFinalPrice(product));

  const toman = document.createElement("span");
  toman.className = "text-[10px] text-[#232933] mr-0.5";
  toman.textContent = "تومان";

  priceRow.appendChild(price);
  priceRow.appendChild(toman);

  priceBox.appendChild(priceRow);
  priceWrap.appendChild(priceBox);

  info.appendChild(title);
  info.appendChild(priceWrap);

  article.appendChild(imgWrap);
  article.appendChild(info);
  slide.appendChild(article);

  return slide;
}
const numberFormat = new Intl.NumberFormat("fa-IR");

export function createPopularSlide(products) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide !h-auto";
  slide.setAttribute("dir", "rtl");

  const list = document.createElement("div");

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className =
      "border border-neutral-200 lg:border-none rounded mb-2 lg:mb-4 pl-3 lg:pl-0";
    item.dataset.id = product.id;

    const link = document.createElement("a");
    link.className = "block";
    link.href = product.url || "#";

    const row = document.createElement("div");
    row.className = "flex";

    const imgBg = document.createElement("div");
    imgBg.className =
      "bg-neutral-100 lg:!bg-transparent ml-3 rounded lg:rounded-none";

    const imgWrap = document.createElement("div");
    imgWrap.className =
      "w-[88px] h-[88px] rounded lg:rounded-none shrink-0 mix-blend-multiply lg:mix-blend-normal overflow-hidden leading-[0]";

    const img = document.createElement("img");
    img.className = "w-full inline-block object-contain";
    img.width = 88;
    img.height = 88;
    img.src = product.image;
    img.alt = product.title;
    img.loading = "lazy";

    imgWrap.appendChild(img);
    imgBg.appendChild(imgWrap);

    const description = document.createElement("div");
    description.className = "grow flex flex-col justify-center relative";

    const text = document.createElement("p");
    text.className =
      "text-neutral-700 text-sm overflow-hidden flex items-center";

    const number = document.createElement("span");
    number.className =
      "w-[22px] h-[22px] shrink-0 rounded-full inline-flex justify-center items-center text-white bg-[#ef394e] text-xs font-bold ml-2";
    number.textContent = numberFormat.format(product.id);

    const title = document.createElement("span");
    title.className = "line-clamp-2";
    title.textContent = product.title;

    text.appendChild(number);
    text.appendChild(title);
    description.appendChild(text);

    row.appendChild(imgBg);
    row.appendChild(description);
    link.appendChild(row);
    item.appendChild(link);
    list.appendChild(item);
  });

  slide.appendChild(list);

  return slide;
}
