import { request } from "../api/apiConfig";

function clearPlaceholder(el, removeSize = true) {
  const pattern = removeSize
    ? /(?<![\w-])(?:bg|h|w|size)-(?!full(?:\s|$))\S+/g
    : /(?<![\w-])bg-\S+/g;

  el.className = el.className.replace(pattern, "").replace(/\s+/g, " ").trim();
}

function fillText(el, text, extraClass = "") {
  if (!el) return;
  clearPlaceholder(el);
  if (extraClass) el.classList.add(...extraClass.split(" "));
  el.textContent = text ?? "";
}

function fillImage(el, src, alt = "") {
  if (!el) return;
  clearPlaceholder(el, false);

  const img = document.createElement("img");
  img.className = "w-full h-full object-contain";
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";

  el.replaceChildren(img);
}

function fillList(containers, items, fillOne) {
  containers.forEach((container, i) => {
    const item = items?.[i];

    if (!item) {
      container.remove();
      return;
    }

    fillOne(container, item);
  });
}

const getSlot = (root, name) => root.querySelector(`[data-slot="${name}"]`);
const getSlots = (root, name) => [
  ...root.querySelectorAll(`[data-slot="${name}"]`),
];

const SEO_CLASSES = {
  h1: "mb-3 text-lg font-bold text-slate-700",
  h2: "mt-5 mb-2 text-base font-bold text-slate-700",
  h3: "mt-4 mb-2 text-sm font-bold text-slate-700",
  p: "mb-3 text-sm leading-7 text-slate-500",
};

function fillFooter(footer, data) {
  fillImage(getSlot(footer, "logo"), data.logo?.image, data.logo?.alt);

  const textClass = "text-sm text-slate-700";
  fillText(getSlot(footer, "support-phone-1"), data.support?.phone1, textClass);
  fillText(getSlot(footer, "support-phone-2"), data.support?.phone2, textClass);
  fillText(getSlot(footer, "support-text"), data.support?.text, textClass);

  fillList(getSlots(footer, "feature"), data.features, (el, item) => {
    el.href = item.url || "#";
    const [iconBox, textBox] = el.children;
    fillImage(iconBox, item.icon, item.title);
    fillText(textBox, item.title, "text-xs text-slate-700");
  });

  ["with-digikala", "customer-service", "buying-guide"].forEach((name, i) => {
    const column = data.columns?.[i];

    if (!column) {
      getSlot(footer, name + "-title")?.parentElement.remove();
      return;
    }

    fillText(
      getSlot(footer, name + "-title"),
      column.title,
      "font-bold text-slate-700",
    );

    fillList(getSlots(footer, name + "-link"), column.links, (el, link) => {
      el.href = link.url || "#";
      fillText(
        el,
        link.title,
        "text-sm text-slate-500 hover:text-red-500 transition-colors",
      );
    });
  });

  fillText(
    getSlot(footer, "social-title"),
    data.social?.title,
    "font-bold text-slate-700",
  );

  fillList(getSlots(footer, "social-icon"), data.social?.items, (el, item) => {
    el.href = item.url || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.setAttribute("aria-label", item.title);
    fillText(el, item.title, "text-xs text-slate-600 hover:text-red-500");
  });

  fillText(
    getSlot(footer, "newsletter-title"),
    data.newsletter?.title,
    "font-bold text-slate-700",
  );

  const app = data.app ?? {};

  fillImage(getSlot(footer, "app-logo"), app.logo, app.title);
  fillText(getSlot(footer, "app-title"), app.title, "font-bold text-white");

  fillList(getSlots(footer, "app-store"), app.stores, (el, store) => {
    el.href = store.url || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.title = store.title;
    fillImage(el, store.image, store.title);
  });

  const moreIcon = getSlot(footer, "app-more-icon");
  if (moreIcon) {
    moreIcon.href = app.moreUrl || "#";
    fillImage(moreIcon, app.moreIcon, app.moreText);
  }

  const moreLink = getSlot(footer, "app-more-link");
  if (moreLink) {
    moreLink.href = app.moreUrl || "#";
    fillText(moreLink, app.moreText, "text-sm text-white");
  }

  const seoBox = getSlot(footer, "seo-text");
  if (seoBox && Array.isArray(data.seo)) {
    clearPlaceholder(seoBox);

    const fragment = document.createDocumentFragment();

    data.seo.forEach((block) => {
      const tag = SEO_CLASSES[block.type] ? block.type : "p";
      const node = document.createElement(tag);
      node.className = SEO_CLASSES[tag];
      node.textContent = block.text;
      fragment.appendChild(node);
    });

    seoBox.replaceChildren(fragment);
  }

  fillList(getSlots(footer, "badge"), data.badges, (el, item) => {
    if (item.url) {
      el.href = item.url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
    fillImage(el.firstElementChild, item.image, item.title);
  });

  fillText(
    getSlot(footer, "copyright"),
    data.copyright,
    "text-xs text-slate-500 text-center",
  );

  fillList(getSlots(footer, "partner"), data.partners, (el, item) => {
    el.href = item.url || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.title = item.title;
    fillImage(el.firstElementChild, item.image, item.title);
  });
}

export async function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "w-full bg-white font-digikala border-t border-slate-200 pt-8 mt-12";
  footer.setAttribute("dir", "rtl");

  const container = document.createElement("div");
  container.className = "container mx-auto";

  const inner = document.createElement("div");
  inner.className = "px-5";

  const topRow = document.createElement("div");
  topRow.className = "flex justify-between items-center select-none";

  const logo = document.createElement("div");
  logo.dataset.slot = "logo";
  logo.className = "ml-4 w-[195px] h-[30px] bg-red-300";

  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className =
    "flex items-center justify-center px-3 sm:px-4 py-1 rounded-lg border border-slate-300 text-sm text-slate-500 cursor-pointer hover:bg-slate-50";

  const backToTopText = document.createElement("span");
  backToTopText.className = "ml-2";
  backToTopText.textContent = "بازگشت به بالا";

  backToTop.appendChild(backToTopText);
  backToTop.insertAdjacentHTML(
    "beforeend",
    `<svg class="size-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
       <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
     </svg>`,
  );
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  topRow.appendChild(logo);
  topRow.appendChild(backToTop);
  const support = document.createElement("div");
  support.className =
    "mb-8 mt-4 md:mt-3 md:mb-0 flex items-center flex-wrap lg:flex-nowrap";

  const phone1 = document.createElement("div");
  phone1.dataset.slot = "support-phone-1";
  phone1.className = "shrink-0 w-48 h-5 bg-sky-200";

  const separator1 = document.createElement("div");
  separator1.className = "px-5 text-slate-400 hidden md:block";
  separator1.textContent = "|";

  const phone2 = document.createElement("div");
  phone2.dataset.slot = "support-phone-2";
  phone2.className = "shrink-0 w-32 h-5 bg-sky-200";

  const separator2 = document.createElement("div");
  separator2.className = "px-5 text-slate-400 hidden md:block";
  separator2.textContent = "|";

  const supportText = document.createElement("div");
  supportText.dataset.slot = "support-text";
  supportText.className = "w-full mt-1 md:mt-0 h-5 bg-sky-200";

  support.appendChild(phone1);
  support.appendChild(separator1);
  support.appendChild(phone2);
  support.appendChild(separator2);
  support.appendChild(supportText);

  const features = document.createElement("div");
  features.className =
    "hidden lg:flex my-8 items-center justify-between select-none";

  for (let i = 0; i < 5; i++) {
    const item = document.createElement("a");
    item.href = "#";
    item.dataset.slot = "feature";
    item.className =
      "flex py-3 flex-col items-center justify-between text-center grow gap-2";

    const icon = document.createElement("div");
    icon.className = "size-14 rounded bg-amber-300";

    const text = document.createElement("div");
    text.className = "h-4 w-28 bg-sky-200";

    item.appendChild(icon);
    item.appendChild(text);
    features.appendChild(item);
  }

  const columnsRow = document.createElement("div");
  columnsRow.className = "flex flex-wrap w-full justify-between mb-8";

  const columnConfigs = [
    { name: "with-digikala", linkCount: 6, extraClass: "" },
    { name: "customer-service", linkCount: 5, extraClass: "" },
    { name: "buying-guide", linkCount: 3, extraClass: "hidden md:block" },
  ];

  for (const config of columnConfigs) {
    const column = document.createElement("div");
    column.className = "block lg:grow w-6/12 lg:w-auto " + config.extraClass;

    const title = document.createElement("div");
    title.dataset.slot = config.name + "-title";
    title.className = "mb-2 h-6 w-28 bg-sky-200";
    column.appendChild(title);

    for (let i = 0; i < config.linkCount; i++) {
      const link = document.createElement("a");
      link.href = "#";
      link.dataset.slot = config.name + "-link";
      link.className = "mb-2 block h-5 w-36 bg-emerald-200";
      column.appendChild(link);
    }

    columnsRow.appendChild(column);
  }

  const rightBox = document.createElement("div");
  rightBox.className = "w-full lg:w-auto shrink-0";

  const socialWrap = document.createElement("div");
  socialWrap.className =
    "w-full flex lg:block lg:flex-row justify-between items-start mt-8 sm:mt-0";

  const socialTitle = document.createElement("div");
  socialTitle.dataset.slot = "social-title";
  socialTitle.className = "mb-3 h-6 w-28 bg-sky-200";

  const social = document.createElement("div");
  social.className = "flex items-center gap-4 lg:gap-6";

  for (let i = 0; i < 5; i++) {
    const icon = document.createElement("a");
    icon.href = "#";
    icon.dataset.slot = "social-icon";
    icon.className = "size-8 rounded bg-pink-300";
    social.appendChild(icon);
  }

  socialWrap.appendChild(socialTitle);
  socialWrap.appendChild(social);

  const newsletter = document.createElement("div");
  newsletter.className = "w-full flex flex-col items-start mt-4 sm:mt-8";

  const newsletterTitle = document.createElement("div");
  newsletterTitle.dataset.slot = "newsletter-title";
  newsletterTitle.className = "hidden md:block mb-3 h-6 w-64 bg-sky-200";

  const form = document.createElement("form");
  form.className = "w-full flex";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.name = "email";
  emailInput.placeholder = "ایمیل شما";
  emailInput.className =
    "grow w-full px-4 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "mr-2 px-5 py-2 rounded-lg bg-red-500 text-white text-sm font-medium";
  submitBtn.textContent = "ثبت";

  form.appendChild(emailInput);
  form.appendChild(submitBtn);

  newsletter.appendChild(newsletterTitle);
  newsletter.appendChild(form);

  rightBox.appendChild(socialWrap);
  rightBox.appendChild(newsletter);
  columnsRow.appendChild(rightBox);

  const appSection = document.createElement("div");
  appSection.className =
    "flex flex-col lg:flex-row mb-7 lg:px-5 rounded-xl select-none py-2 items-center justify-between bg-red-500";

  const appInfo = document.createElement("div");
  appInfo.className = "flex items-center mb-4 lg:mb-0";

  const appLogo = document.createElement("div");
  appLogo.dataset.slot = "app-logo";
  appLogo.className = "shrink-0 size-11 rounded bg-red-300";

  const appTitle = document.createElement("div");
  appTitle.dataset.slot = "app-title";
  appTitle.className = "shrink-0 mr-4 h-6 w-48 bg-red-300";

  appInfo.appendChild(appLogo);
  appInfo.appendChild(appTitle);

  const appRight = document.createElement("div");
  appRight.className = "flex items-center justify-end grow";

  const appStores = document.createElement("div");
  appStores.className =
    "flex items-center justify-center lg:justify-end flex-wrap lg:grow";

  for (let i = 0; i < 3; i++) {
    const store = document.createElement("a");
    store.href = "#";
    store.dataset.slot = "app-store";
    store.className = "m-2 h-11 w-32 rounded bg-red-300";
    appStores.appendChild(store);
  }

  const appMoreIcon = document.createElement("a");
  appMoreIcon.href = "#";
  appMoreIcon.dataset.slot = "app-more-icon";
  appMoreIcon.className = "hidden lg:block mr-4 size-11 rounded bg-red-300";

  appRight.appendChild(appStores);
  appRight.appendChild(appMoreIcon);

  const appMoreLink = document.createElement("a");
  appMoreLink.href = "#";
  appMoreLink.dataset.slot = "app-more-link";
  appMoreLink.className = "lg:hidden mt-1 h-5 w-56 bg-red-300";

  appSection.appendChild(appInfo);
  appSection.appendChild(appRight);
  appSection.appendChild(appMoreLink);

  const seoRow = document.createElement("div");
  seoRow.className =
    "flex items-start justify-between border-t border-slate-200 py-8 flex-wrap lg:flex-nowrap";

  const seoBox = document.createElement("div");
  seoBox.className = "grow";

  const seoText = document.createElement("div");
  seoText.dataset.slot = "seo-text";
  seoText.className =
    "relative lg:ml-10 ml-0 overflow-hidden max-h-40 min-h-[120px] bg-violet-200";

  const seoToggle = document.createElement("button");
  seoToggle.type = "button";
  seoToggle.className = "mt-2 text-sm font-medium text-sky-700 cursor-pointer";
  seoToggle.textContent = "مشاهده بیشتر";

  let isExpanded = false;
  seoToggle.addEventListener("click", () => {
    isExpanded = !isExpanded;
    seoText.classList.toggle("max-h-40", !isExpanded);
    seoToggle.textContent = isExpanded ? "مشاهده کمتر" : "مشاهده بیشتر";
  });

  seoBox.appendChild(seoText);
  seoBox.appendChild(seoToggle);

  const badges = document.createElement("div");
  badges.className =
    "w-full lg:w-auto flex items-center mt-4 lg:mt-0 justify-center lg:justify-end";

  for (let i = 0; i < 4; i++) {
    const badge = document.createElement("a");
    badge.dataset.slot = "badge";
    badge.className =
      "p-2 lg:p-4 flex items-center justify-center border border-slate-200 rounded mr-2";

    const badgeImage = document.createElement("div");
    badgeImage.className = "size-[75px] bg-violet-200";

    badge.appendChild(badgeImage);
    badges.appendChild(badge);
  }

  seoRow.appendChild(seoBox);
  seoRow.appendChild(badges);

  const copyright = document.createElement("div");
  copyright.className =
    "flex items-center justify-center border-t border-slate-200 py-8";

  const copyrightText = document.createElement("div");
  copyrightText.dataset.slot = "copyright";
  copyrightText.className = "h-4 w-full max-w-xl bg-sky-200";

  copyright.appendChild(copyrightText);

  const partnersWrap = document.createElement("div");
  partnersWrap.className = "w-full bg-slate-100";

  const partners = document.createElement("div");
  partners.className =
    "container mx-auto flex items-start justify-end flex-wrap";

  for (let i = 0; i < 18; i++) {
    const partner = document.createElement("a");
    partner.href = "#";
    partner.dataset.slot = "partner";
    partner.className =
      "px-5 py-4 grow flex flex-col items-center justify-center border-r border-b border-slate-200";

    const partnerLogo = document.createElement("div");
    partnerLogo.className = "h-5 w-24 rounded bg-slate-400";

    partner.appendChild(partnerLogo);
    partners.appendChild(partner);
  }

  partnersWrap.appendChild(partners);

  inner.appendChild(topRow);
  inner.appendChild(support);
  inner.appendChild(features);
  inner.appendChild(columnsRow);
  inner.appendChild(appSection);
  inner.appendChild(seoRow);
  inner.appendChild(copyright);

  container.appendChild(inner);

  footer.appendChild(container);
  footer.appendChild(partnersWrap);

  try {
    const data = await request("/footer");
    fillFooter(footer, data);
  } catch (error) {
    console.error("خطا در دریافت اطلاعات فوتر:", error);
  }

  return footer;
}
