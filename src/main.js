////////////////////// swiper-1 ///////////////////////////
const swiper_1 = new Swiper(".mySwiper-1", {
  slidesPerView: 4,
  spaceBetween: 15,
  watchOverflow: true,
  grabCursor: true,
  observer: true,
  observeParents: true,

  pagination: {
    el: ".mySwiper .swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
});
////////////////////// swiper-2 ///////////////////////////
const swiper_2 = new Swiper(".mySwiper-2", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
////////////////////////// discount count down //////////////////////////////////
const hoursEl = document.getElementById("hours"),
  minutesEl = document.getElementById("minutes"),
  secondsEl = document.getElementById("seconds");
let totalSeconds = 8 * 3600 + 12 * 60 + 12;
let timerInterval = null;
///////////////////////// count down /////////////////////
function updateCountdown() {
  if (totalSeconds <= 0) {
    clearInterval(timerInterval);
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  totalSeconds--;
}
updateCountdown();
timerInterval = setInterval(updateCountdown, 1000);
const API_BASE = "http://localhost:3000";
////////////////////////////////////////////////// swiper-3 ////////////////////////////////////////////////
const swiper_3 = new Swiper(".mySwiper-3", {
  slidesPerView: 3,
  spaceBetween: 30,
  observer: true,
  observeParents: true,

  navigation: {
    nextEl: ".mySwiper-3 .swiper-button-next",
    prevEl: ".mySwiper-3 .swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 7,
      spaceBetween: 5,
    },
  },
});

/////////////////////////////////////////////////  request helper ///////////////////////////////
async function request(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status}: ${message}`);
  }

  if (response.status === 204) return null;

  return await response.json();
}

//////////////// change data to number //////////////////////
function toNumber(value) {
  const cleaned = String(value ?? "")
    .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776)
    .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632)
    .replace(/٫/g, ".")
    .replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
///////////// calculate the percent ///////////
function stripPercent(value) {
  return String(value ?? "").replace(/[%٪]/g, "");
}

//////////// final price //////////////
function calcFinalPrice(prePrice, discount) {
  const price = toNumber(prePrice);
  const off = toNumber(discount);

  const discountAmount = (price * off) / 100;
  return Math.max(0, Math.round(price - discountAmount));
}

/////////////////////////////////// render cards /////////
async function renderCards() {
  const swiperWrapper = document.querySelector(".swiper-3-wrapper");
  if (!swiperWrapper) return;

  try {
    const products = (await request("/products")) || [];

    swiperWrapper.innerHTML = "";

    if (products.length === 0) console.warn("هیچ محصولی یافت نشد.");

    [...products].reverse().forEach((product) => {
      swiperWrapper.appendChild(createCard(product));
    });

    swiper_3.update();
  } catch (error) {
    console.error("خطا در بارگذاری محصولات:", error);
  }
}

///////////////////////////////////// create card /////////////////////////////
function createCard(product) {
  const swiperSlide = document.createElement("div");
  swiperSlide.className = "swiper-slide size-auto";

  const productId = document.createElement("h2");
  productId.textContent = product.id;
  productId.className = "hidden";

  const a = document.createElement("a");
  a.className =
    "min-w-[130px] overflow-hidden flex flex-col justify-between bg-white p-2 lg:p-0 styles-module-scss-module__kEiM9a__card styles-module-scss-module__kEiM9a__firstCard";
  a.href = "/product/dkp-16622211/";
  a.target = "_self";

  const div_1 = document.createElement("div");
  div_1.className = "rounded-md overflow-hidden";

  const div_1_child = document.createElement("div");
  div_1_child.style.width = "164px";
  div_1_child.style.height = "164px";
  div_1_child.style.lineHeight = "0";
  div_1_child.setAttribute("role", "img");
  div_1_child.setAttribute("aria-hidden", "false");
  div_1_child.setAttribute(
    "aria-label",
    "کپسول لیور ویت یوروویتال بسته 60 عددی",
  );

  const picture = document.createElement("picture");

  const sourceWebp = document.createElement("source");
  sourceWebp.type = "image/webp";
  sourceWebp.srcset =
    "https://dkstatics-public.digikala.com/digikala-products/217b40ae3bef3b862dc4fc12d8b89988e9466db4_1725541507.jpg?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80/format,webp";

  const sourceJpeg = document.createElement("source");
  sourceJpeg.type = "image/jpeg";
  sourceJpeg.srcset =
    "https://dkstatics-public.digikala.com/digikala-products/217b40ae3bef3b862dc4fc12d8b89988e9466db4_1725541507.jpg?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80";

  const img = document.createElement("img");
  img.className = "w-full rounded-md inline-block";
  img.width = 164;
  img.height = 164;
  img.alt = "کپسول لیور ویت یوروویتال بسته 60 عددی";
  img.src = sourceJpeg.srcset;
  img.style.objectFit = "contain";

  picture.appendChild(sourceWebp);
  picture.appendChild(sourceJpeg);
  picture.appendChild(img);

  div_1_child.appendChild(picture);
  div_1.appendChild(div_1_child);

  const details = document.createElement("div");
  details.className =
    "flex flex-col items-start justify-between w-full h-full gap-2 mt-2 lg:items-end lg:p-2 lg:pt-0 ";

  const name = document.createElement("p");
  name.className =
    "text-body1-strong-180 lg:text-body-1-180 text-neutral-650 h-10 lg:h-[50px] w-full ellipsis-2 line-clamp-2";
  name.textContent = "کپسول لیور ویت یوروویتال بسته 60 عددی";

  const priceContainer = document.createElement("div");

  const priceBox = document.createElement("div");
  priceBox.className =
    "flex items-center justify-start flex-col h-10.5 pt-0.5 !justify-start !items-start bg-blue-600";

  const discountRow = document.createElement("div");
  discountRow.className = "flex justify-start items-center gap-1 bg-teal-700";

  const discount = document.createElement("div");
  discount.className =
    "px-1 text-white bg-red-600 rounded-large flex items-center justify-center bg-hint-object-error shrink-0 !h-4";

  const discountText = document.createElement("span");
  discountText.className = "text-body2-strong ";
  discountText.textContent = "۸۰٪";

  const oldPrice = document.createElement("span");
  oldPrice.className =
    "line-through text-body-2 ml-1 text-neutral-300 !leading-[16px]";
  oldPrice.textContent = "۱,۶۵۰,۰۰۰";

  const currentPriceRow = document.createElement("div");
  currentPriceRow.className = "flex items-center justify-between";

  const currentPriceWrapper = document.createElement("div");
  currentPriceWrapper.className = "flex items-center";

  const currentPrice = document.createElement("span");
  currentPrice.className =
    "text-neutral-800 ml-0.5 text-h4 !leading-[24px] bg-green-600";
  currentPrice.textContent = "۳۳۰,۰۰۰";

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "w-full h-fit p-2 bg-green-600 flex gap-2";

  const editBtn = document.createElement("button");
  editBtn.className =
    "px-3 py-2 bg-blue-600 rounded-xl  hover:bg-blue-400 transition-all cursor-pointer ";
  editBtn.textContent = "ویرایش";

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "px-3 py-2 bg-red-600 rounded-xl  hover:bg-red-400 transition-all cursor-pointer ";
  deleteBtn.textContent = "حذف";

  //////////////////////// write this fucntion (use the function that you have written , ) /////////////////
  editBtn.addEventListener("click", (event) => {
    event.preventDefault();
    startEdit(product);
  });
  discount.appendChild(discountText);
  discountRow.appendChild(discount);
  discountRow.appendChild(oldPrice);

  currentPriceWrapper.appendChild(currentPrice);
  currentPriceRow.appendChild(currentPriceWrapper);

  priceBox.appendChild(discountRow);
  priceBox.appendChild(currentPriceRow);
  priceContainer.appendChild(priceBox);

  details.appendChild(name);
  details.appendChild(priceContainer);

  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);

  swiperSlide.appendChild(productId);
  a.appendChild(div_1);
  a.appendChild(details);
  a.appendChild(buttonContainer);
  swiperSlide.appendChild(a);

  return swiperSlide;
}

//////////////////////////// startedit function //////////////////////////
function startEdit(product) {
  if (document.body.querySelector(".popout")) return;
  const popOut = document.createElement("form");
  popOut.className =
    "size-120 bg-red-600 flex flex-col items-center gap-x-3 gap-y-8 p-5 fixed z-50 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 popout";

  const cardHeading = document.createElement("h2");
  cardHeading.textContent = `ایدی کارت : ${product.id}`;
  cardHeading.className = "text-4xl font-extrabold";

  const imageInput = document.createElement("input");
  imageInput.type = "url";
  imageInput.required = true;
  imageInput.className = "w-full border p-2 rounded-lg ";
  imageInput.placeholder = "آدرس عکس را وارد کنید : ";

  const infoInput = document.createElement("input");
  infoInput.type = "url";
  infoInput.required = true;
  infoInput.className = "w-full border p-2 rounded-lg ";
  infoInput.placeholder = "عنوان کارت را وارد کنید : ";

  const discountInfo = document.createElement("input");
  discountInfo.type = "url";
  discountInfo.required = true;
  discountInfo.className = "w-full border p-2 rounded-lg ";
  discountInfo.placeholder = "میزان تخفیف را وارد کنید : ";

  const prePriceInput = document.createElement("input");
  prePriceInput.type = "url";
  prePriceInput.required = true;
  prePriceInput.className = "w-full border p-2 rounded-lg ";
  prePriceInput.placeholder = "قیمت قبلی را وارد کنید : ";

  const submitBtn = document.createElement("button");
  submitBtn.className = "px-4 py-2 bg-green-700 ";
  submitBtn.textContent = "submit ";

  popOut.appendChild(cardHeading);
  popOut.appendChild(imageInput);
  popOut.appendChild(infoInput);
  popOut.appendChild(discountInfo);
  popOut.appendChild(prePriceInput);
  popOut.appendChild(submitBtn);

  document.body.appendChild(popOut);
}

renderCards();
