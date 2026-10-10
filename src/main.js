////////////////////// swiper-2 ///////////////////////////
const swiper_2 = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

///// discount count down //////////////////////////////////
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

///////////////////////////////// amazing swiper ///////////////////////
const swiper = new Swiper(".amzing-swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  watchOverflow: true,
  observer: true,
  observeParents: true,
  grabCursor: true,
  breakpoints: {
    640: { slidesPerView: 4, spaceBetween: 20 },
    1024: { slidesPerView: 7, spaceBetween: 12 },
  },
});

/**
 * دریافت لیست کارت‌ها از سرور به روش حرفه‌ای
 * @param {AbortSignal} [signal] - برای لغو درخواست در صورت نیاز
 * @returns {Promise<Array>} آرایه محصولات
 */
async function fetchCards(signal) {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`خطا در سرور: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const products = result.data || result;

    renderCards(products);
  } catch (error) {
    if (error.name === "AbortError") {
      console.info("درخواست دریافت کارت‌ها لغو شد.");
      return;
    }
    console.error("خطا در دریافت کارت‌ها:", error.message);
  }
}

//////////////////////////////////////////////////////////////////////////
// ----------------------- rendering cards -----------------
//////////////////////////////////////////////////////////////////////////
function renderCards(cards) {
  if (!cards || cards.length === 0) {
    console.warn("هیچ محصولی برای نمایش وجود ندارد.");
    return;
  }

  cards.forEach((cardData) => {
    // ۱. ساخت اسلاید استاندارد برای سوایپر
    const slide = document.createElement("div");
    slide.className = "swiper-slide crud-swiper-slide";
    slide.setAttribute("data-id", cardData.id);

    // ۲. ساخت محتوای داخل کارت با استفاده از تابع createCard
    const cardContent = createCard(cardData);
    slide.appendChild(cardContent);

    // ۳. اضافه کردن تمیز اسلاید به سوایپر
    swiper.appendSlide(slide);
  });
}

//////////////////////////////////////////////////////////////////////////
// ----------------------- creating cards -----------------
//////////////////////////////////////////////////////////////////////////
function createCard(card) {
  const container = document.createElement("div");
  container.className = "card-content p-2 bg-red-900 border rounded shadow flex flex-col items-center gap-y-2";

  const image = document.createElement("img"); // اصلاح تگ image به img
  image.src = card.image || "default.jpg";
  image.className = "w-32 h-32 object-cover mb-2";

  const title = document.createElement("h3");
  title.textContent = card.title || "محصول بدون نام";
  title.className = " mb-2";

  const prePricesContainer = document.createElement("div");
  prePricesContainer.className = "w-full bg-blue-600 p-2 flex justify-between items-center text-white";

  const prePrice = document.createElement("span");
  prePrice.textContent = `${card.preprice} `;
  prePrice.className = "line-through text-gray-200";

  const discountContainer = document.createElement("div");
  discountContainer.className = "bg-red-600 px-2 py-1 rounded text-xs";
  discountContainer.textContent = `${card.discount}% `;

  prePricesContainer.appendChild(discountContainer);
  prePricesContainer.appendChild(prePrice);

  const lastPriceContainer = document.createElement("div");
  lastPriceContainer.className = "w-full gap-5  bg-yellow-600 text-white flex justify-center ";
  
  const finalPrice = card.preprice - (card.preprice * (card.discount / 100));
  const lastPrice = document.createElement("span");
  lastPrice.textContent = ` ${finalPrice} تومان`;
  


  const btnContainer = document.createElement("div")
  btnContainer.className="w-full bg-teal-600 flex justify-center gap-x-5"


  const editBtn = document.createElement("button")
  editBtn.className="p-2 bg-yellow-600 rounded-xl hover:bg-yellow-900 transition-all cursor-pointer"
  editBtn.textContent="ویرایش"


  

  const deleteBtn = document.createElement("button")
  deleteBtn.className="p-2 bg-red-600 rounded-xl hover:bg-red-900 transition-all cursor-pointer"
  deleteBtn.textContent="حذف "
  
  btnContainer.appendChild(editBtn)
  btnContainer.appendChild(deleteBtn)





  lastPriceContainer.appendChild(lastPrice);

  // سرهم کردن اجزای کارت درون کانتینر اصلی
  container.appendChild(image);
  container.appendChild(title);
  container.appendChild(prePricesContainer);
  container.appendChild(lastPriceContainer);
  container.appendChild(btnContainer);


  return container;
}

// اجرای اولیه برای دریافت و نمایش محصولات
const controller = new AbortController();
fetchCards(controller.signal);



/*
 when edit btn and delete btn are clicked there would be a pop out and if the user hadnt logged in , he cant edit or delete the card .
 
*/