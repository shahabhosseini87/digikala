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
const timerInterval = setInterval(updateCountdown, 1000);

const API_BASE = "http://localhost:3000";
let currentProducts = [];
let currentCategoryProducts = [];

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

/////////////////////////////////////////////////  my fetch cards ///////////////////////////////
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

/////////////  using request function ///////////////////
// await request("/users", { method: "POST", body: { name: "سارا" } });

/////////////////////////////////// render cards ///////////////////
async function renderCards() {
  try {
    const products = await request("/products");

    if (!products || products.length === 0) {
      console.warn("هیچ محصولی یافت نشد.");
      return;
    }

    const swiperWrapper = document.querySelector(".swiper-3-wrapper");

    if (swiperWrapper) {
      swiperWrapper.innerHTML = "";

      products.forEach((product) => {
        const cardElement = createCard(product);
        swiperWrapper.appendChild(cardElement);
      });

      swiper_3.update();
    }
  } catch (error) {
    console.error("خطا در بارگذاری محصولات:", error);
  }
}

///////////////////////////////////// create card /////////////////////////////
function createCard(product) {
  const swiperSlide = document.createElement("div");
  swiperSlide.className = "swiper-slide";

  const cardDiv = document.createElement("div");
  cardDiv.className =
    "w-full bg-white border border-slate-100  p-2 flex flex-col items-stretch gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer";
  const imgContainer = document.createElement("div");
  imgContainer.className =
    "w-full h-40 flex justify-center items-center relative";

  const img = document.createElement("img");
  img.src = product.image || "./public/image/product.jpg";
  img.alt = product.title || "تصویر محصول";
  img.className = "w-full h-full object-contain";

  imgContainer.appendChild(img);

  const titleH3 = document.createElement("h3");
  titleH3.className =
    "text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed min-h-[4rem]";
  titleH3.textContent = product.title;

  const priceSection = document.createElement("div");
  priceSection.className = "flex flex-col gap-1 mt-auto bg-amber-300";

  const discountRow = document.createElement("div");
  discountRow.className =
    "flex items-center justify-end bg-blue-600 gap-4 bg-amber-900";

  const discountBadge = document.createElement("span");
  discountBadge.className =
    "bg-[#ef394e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full";
  discountBadge.textContent = `${product.discount}`;

  const oldPriceSpan = document.createElement("span");
  oldPriceSpan.className = "text-slate-400 text-xs line-through font-normal";
  oldPriceSpan.textContent = product.preprice;

  discountRow.appendChild(discountBadge);
  discountRow.appendChild(oldPriceSpan);

  const finalPriceRow = document.createElement("div");
  finalPriceRow.className =
    "flex items-center justify-end bg-red-600 gap-1 text-slate-900";

  const priceSpan = document.createElement("span");
  priceSpan.className = "text-xl";
  priceSpan.textContent = +oldPriceSpan - +discountBadge;

  const currencySpan = document.createElement("span");
  currencySpan.className = "text-lg font-bold text-slate-600";
  currencySpan.textContent = "تومان";

  const btnContainers = document.createElement("div");
  btnContainers.className = "w-full h-fit bg-red-600 p-1 flex gap-3";

  const editBtn = document.createElement("button");
  editBtn.className =
    "p-2 bg-green-600 cursor-pointer rounded-xl hover:bg-green-400 transition-all";
  editBtn.textContent = "ویرایش";

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "p-2 bg-pink-600 cursor-pointer rounded-xl hover:bg-pink-400 transition-all";
  deleteBtn.textContent = "حذف";

  editBtn.addEventListener("click", () => startEdit(product));
  deleteBtn.addEventListener("click", () => startDelete());

  finalPriceRow.appendChild(priceSpan);
  finalPriceRow.appendChild(currencySpan);

  priceSection.appendChild(discountRow);
  priceSection.appendChild(finalPriceRow);

  btnContainers.appendChild(editBtn);
  btnContainers.appendChild(deleteBtn);

  cardDiv.appendChild(imgContainer);
  cardDiv.appendChild(titleH3);
  cardDiv.appendChild(priceSection);
  cardDiv.appendChild(btnContainers);

  swiperSlide.appendChild(cardDiv);

  return swiperSlide;
}
//////////////////////// start edit function /////////////////////////////
function startEdit(product) {
  const makeSure = document.querySelector(".popout");
  if (makeSure) return;

  const popOut = document.createElement("form");
  popOut.className =
    "w-120 h-fit bg-red-600 flex flex-col justify-center gap-y-5 p-8 fixed top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 z-50 popout";
  document.body.appendChild(popOut);

  const imageLabel = document.createElement("label"),
    imageUrl = document.createElement("input"),
    titleLabel = document.createElement("label"),
    titleInput = document.createElement("input"),
    discountLabel = document.createElement("label"),
    discountInput = document.createElement("input"),
    prePriceLabel = document.createElement("label"),
    prePrice = document.createElement("input"),
    mainPriceLabel = document.createElement("label"),
    mainPriceInput = document.createElement("input"),
    submitBtn = document.createElement("button");

  imageLabel.textContent = "آدرس تصویر : ";
  titleLabel.textContent = "عنوان : ";
  discountLabel.textContent = "مقدار تخفیف : ";
  prePriceLabel.textContent = "قیمت قبلی : ";
  mainPriceLabel.textContent = " محاسبه ی قیمت محصول :   ";

  imageLabel.htmlFor = "imageUrl";
  titleLabel.htmlFor = "titleInput";
  discountLabel.htmlFor = "discountInput";
  prePriceLabel.htmlFor = "prePrice";
  mainPriceLabel.htmlFor = "mainPriceInput";

  imageUrl.type = "url";
  titleInput.type = "text";
  discountInput.type = "text";
  prePrice.type = "text";
  mainPriceInput.type = "text";
  submitBtn.type = "submit";

  imageUrl.id = "imageUrl";
  titleInput.id = "titleInput";
  discountInput.id = "discountInput";
  prePrice.id = "prePrice";
  mainPriceInput.id = "mainPriceInput";

  imageUrl.className = "w-full border p-2 rounded-xl bg-white";
  titleInput.className = "w-full border p-2 rounded-xl bg-white";
  discountInput.className = "w-full border p-2 rounded-xl bg-white";
  prePrice.className = "w-full border p-2 rounded-xl bg-white";
  mainPriceInput.className = "w-full border p-2 rounded-xl bg-slate-100";

  submitBtn.className =
    "bg-green-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-green-100 transition-all ";

  imageUrl.value = product.image || "";
  titleInput.value = product.title || "";
  discountInput.value = product.discount || "";
  prePrice.value = product.preprice || "";

  function updateFinalPrice() {
    const rawPrePrice = Number(String(prePrice.value || 0).replace(/,/g, ""));
    const rawDiscount = Number(String(discountInput.value || 0).replace(/[%٪]/g, "").replace(/,/g, ""));
    
    const discountAmount = (rawPrePrice * rawDiscount) / 100;
    const calculatedPrice = rawPrePrice - discountAmount;
    
    mainPriceInput.value = isNaN(calculatedPrice) ? 0 : Math.round(calculatedPrice);
  }

  updateFinalPrice();

  prePrice.addEventListener("input", updateFinalPrice);
  discountInput.addEventListener("input", updateFinalPrice);

  submitBtn.textContent = "تایید";
  
  popOut.appendChild(imageLabel);
  popOut.appendChild(imageUrl);
  popOut.appendChild(titleLabel);
  popOut.appendChild(titleInput);
  popOut.appendChild(discountLabel);
  popOut.appendChild(discountInput);
  popOut.appendChild(prePriceLabel);
  popOut.appendChild(prePrice);
  popOut.appendChild(mainPriceLabel);
  popOut.appendChild(mainPriceInput);
  popOut.appendChild(submitBtn);
}

renderCards();
