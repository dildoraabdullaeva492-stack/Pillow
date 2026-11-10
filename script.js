function calculatePillowRecommendation(input) {
  const baseLoftByPos = {
    side: 13.5,
    back: 10.5,
    stomach: 7.5,
  };

  const shoulderDelta = Math.max(
    -2.5,
    Math.min(3.5, (input.shoulderWidthCm - 44) * 0.22),
  );
  const firmnessDelta = {
    soft: -0.8,
    medium: 0,
    firm: 1.1,
  };

  const rawLoft =
    baseLoftByPos[input.position] +
    shoulderDelta +
    firmnessDelta[input.firmness];
  const recommendedLoftCm =
    Math.round(Math.max(6.5, Math.min(17.5, rawLoft)) * 10) / 10;

  const baseGsmByFilling = {
    goose_down: 850,
    memory_foam: 1120,
    mulberry_silk: 940,
    organic_cotton: 990,
  };

  const firmnessGsmBonus = {
    soft: -70,
    medium: 0,
    firm: 95,
  };

  const recommendedGsm = Math.round(
    baseGsmByFilling[input.filling] +
      firmnessGsmBonus[input.firmness] +
      (recommendedLoftCm - 10) * 18,
  );

  const coolingByFilling = {
    mulberry_silk: 99,
    goose_down: 95,
    organic_cotton: 93,
    memory_foam: 91,
  };

  const spinalScore = Math.min(
    99,
    Math.max(
      91,
      Math.round(
        94 +
          (input.position === "side" && input.firmness !== "soft" ? 3 : 1) +
          (input.position === "stomach" && input.firmness === "soft" ? 3 : 1) +
          (input.filling === "memory_foam" || input.filling === "goose_down"
            ? 1
            : 0),
      ),
    ),
  );

  const productMap = {
    goose_down: {
      id: "siberian-cloud-900",
      title: "AURA Bulutli Sibir Momigʻi 900",
      price: 2450000,
    },
    memory_foam: {
      id: "cervical-sculpt-pro",
      title: "AURA Ortopedik Boʻyin Konturi Pro",
      price: 1980000,
    },
    mulberry_silk: {
      id: "bukhara-imperial-silk",
      title: "AURA Buxoro Shohona Tut Ipagi",
      price: 2890000,
    },
    organic_cotton: {
      id: "alps-botanical-chamber",
      title: "AURA Uch Qavatli Organik Kamera",
      price: 1750000,
    },
  };

  const matched = productMap[input.filling] || productMap.goose_down;
  const posLabel = {
    side: "yonboshlab uxlash",
    back: "chalqancha uxlash",
    stomach: "qorinda uxlash",
  };

  const summaryText = `${posLabel[input.position]} va ${input.shoulderWidthCm} sm yelka kengligi uchun ${recommendedLoftCm} sm balandlikdagi ${matched.title} umurtqa pogʻonasini ideal gorizontal chiziqda ushlab turadi.`;

  return {
    recommendedLoftCm,
    recommendedGsm,
    spinalScore,
    coolingIndex: coolingByFilling[input.filling] || 95,
    matchedProductId: matched.id,
    matchedTitle: matched.title,
    unitPriceUzs: matched.price,
    summaryText,
  };
}

function calculateCartTotals(items) {
  const totalCount = items.reduce(
    (acc, item) => acc + Math.max(0, item.qty),
    0,
  );
  const subtotalUzs = items.reduce(
    (acc, item) => acc + Math.max(0, item.qty) * item.priceUzs,
    0,
  );
  const shippingUzs = subtotalUzs === 0 || subtotalUzs >= 2000000 ? 0 : 65000;
  return {
    totalCount,
    subtotalUzs,
    shippingUzs,
    grandTotalUzs: subtotalUzs + shippingUzs,
  };
}

function validateConsultationForm(payload) {
  const errors = [];
  if (!payload.fullName || payload.fullName.trim().length < 3) {
    errors.push("Ism va familiyangizni toʻliq kiriting.");
  }
  const cleanedPhone = (payload.phone || "").replace(/[^0-9+]/g, "");
  if (cleanedPhone.length < 9) {
    errors.push("Telefon raqamingizni toʻgʻri kiriting (kamida 9 ta raqam).");
  }
  if (!payload.city || payload.city.trim().length < 2) {
    errors.push("Hudud yoki shaharni tanlang.");
  }
  if (!payload.message || payload.message.trim().length < 8) {
    errors.push("Murojaat mazmunini qisqacha yozing (kamida 8 ta belgi).");
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

const PRODUCTS = {
  "siberian-cloud-900": {
    id: "siberian-cloud-900",
    title: "AURA Bulutli Sibir Momigʻi 900",
    categoryLabel: "Sibir Gʻoz Momigʻi · 850+ Fill Power",
    loft: "13.5 sm",
    gsm: "900 GSM",
    size: "50×70 sm",
    priceUzs: 2450000,
    desc: "Uch kamerali shohona konstruksiya: markaziy boʻlmada boʻyin umurtqasini tutib turuvchi elastik par, ustki va ostki kameralarda esa 95% arktik oq gʻoz momigʻi joylashgan. Boshingizni qoʻygan zahoti bulutdek muloyim choʻkadi va 1.4 soniyada dastlabki shaklini tiklaydi.",
  },
  "cervical-sculpt-pro": {
    id: "cervical-sculpt-pro",
    title: "AURA Ortopedik Boʻyin Konturi Pro",
    categoryLabel: "Ortopedik Servikal Seriya · Bio-Koʻpik",
    loft: "11 / 13 sm",
    gsm: "1120 GSM",
    size: "60×40 sm",
    priceUzs: 1980000,
    desc: "Boʻyin osteoxondrozi, yelka qotishi va ertalabki bosh ogʻrigʻini bartaraf etish uchun somnologlar bilan hamkorlikda loyihalangan. Ikki xil balandlikdagi toʻlqinsimon qirra yonboshlab va chalqancha uxlashda umurtqani ideal tekislikda saqlaydi.",
  },
  "bukhara-imperial-silk": {
    id: "bukhara-imperial-silk",
    title: "AURA Buxoro Shohona Tut Ipagi",
    categoryLabel: "6A Navli Buxoro Tut Ipagi · 22 Momme",
    loft: "11.5 sm",
    gsm: "940 GSM",
    size: "50×70 sm",
    priceUzs: 2890000,
    desc: "Qoʻlda tortilgan 100% uzun tolali Buxoro tut ipagidan 42 qavat qilib yigʻilgan. Tarkibidagi tabiiy seritsin aminokislotalari yuz terisini yoshartiradi, soch tolalarini sindirmaydi va yoz oylarida tabiiy salqinlik baxsh etadi.",
  },
  "alps-botanical-chamber": {
    id: "alps-botanical-chamber",
    title: "AURA Uch Qavatli Organik Kamera",
    categoryLabel: "Alp Organik Paxtasi va Momiq · OEKO-TEX",
    loft: "12.0 sm",
    gsm: "950 GSM",
    size: "50×70 sm",
    priceUzs: 1750000,
    desc: "Kimyoviy ishlov berilmagan Shveysariya organik paxtasi va engil gʻoz momigʻi uygʻunligi. Yuqori havo oʻtkazuvchanlik va oʻrta qattiqlikni xush koʻruvchilar uchun yaratilgan.",
  },
  "nordic-graphite-latex": {
    id: "nordic-graphite-latex",
    title: "AURA Skandinaviya Tabiiy Lateks Air",
    categoryLabel: "Talalay Tabiiy Lateks · 1 200 Havo Kanali",
    loft: "12.5 sm",
    gsm: "1080 GSM",
    size: "60×40 sm",
    priceUzs: 2190000,
    desc: "Geveya daraxti sharbatidan olingan tabiiy Talalay lateksi 1 200 ta vertikal perforatsiya kanallari orqali tun boʻyi nafas oladi. Mikroblarga qarshi tabiiy himoya va 12 yillik elastiklik.",
  },
  "samarkand-cooling-king": {
    id: "samarkand-cooling-king",
    title: "AURA Samarqand Sovutuvchi King 90",
    categoryLabel: "King Size 50×90 sm · Kumush Ionli Ipak",
    loft: "14.0 sm",
    gsm: "1180 GSM",
    size: "50×90 sm",
    priceUzs: 3150000,
    desc: "Keng shohona yotoqxonalar uchun 90 sm uzunlikdagi flagman model. Kumush ionlari bilan boyitilgan ipak qoplama tungi issiqlikni oʻziga tortib, uzluksiz chuqur uyquni taʼminlaydi.",
  },
};

const ANATOMY_LAYERS = [
  {
    tag: "01-Qatlam · Yuz va teri bilan bevosita aloqa",
    title: "400 TC Misr Sateni va 22 Momme Tut Ipagi",
    desc: "Yuz terisida burishish va ishqalanish izlarini qoldirmaydigan ultra-silliq toʻqima. Buxoro tut ipagi tarkibidagi tabiiy seritsin oqsili uyqu davomida teri namligini saqlaydi va chang kanalarining kirishiga 100% toʻsqinlik qiladi.",
    airflow: 99,
    rebound: 96,
  },
  {
    tag: "02-Qatlam · Mikroiqlim va antibakterial himoya",
    title: "Kumush Ionli Gipoallergen Havo Qalqoni",
    desc: "Kumush mikro-ionlari bilan boyitilgan bio-membrana tungi terlash va namlikni 3 barobar tezroq bugʻlantiradi. Yostiq ichida yil davomida 36.4°C optimal mikroiqlim saqlanadi.",
    airflow: 98,
    rebound: 94,
  },
  {
    tag: "03-Qatlam · Bulutdek birlamchi yumshoqlik",
    title: "95% Oq Sibir Gʻoz Momigʻi (850+ Fill Power)",
    desc: "Qoʻlda saralangan yirik momiq klasterlari minglab mikroskopik havo choʻntaklarini hosil qiladi. Boshingiz yostiqqa tekkan ilk soniyada vaznsizlik va chuqur halovat hissini beradi.",
    airflow: 97,
    rebound: 99,
  },
  {
    tag: "04-Qatlam · Umurtqa pogʻonasi tayanchi",
    title: "Servikal Boʻyin Tayanchi va Elastik Yadrosi",
    desc: "Yostiqning markaziy kamerasi bosh ogʻirligi ostida yassilanib qolmaydi. U 7 ta boʻyin umurtqasini tabiiy anatomik chiziqda ushlab turib, qon tomirlari qisilishining oldini oladi.",
    airflow: 93,
    rebound: 99,
  },
  {
    tag: "05-Qatlam · Perimetr barqarorligi va ventilyatsiya",
    title: "Ikki Qatorli 3D Nafas Oluvchi Kant Hoshiyasi",
    desc: "#8FA9D6 moviy atlas ipda 18 chok/dyuym aniqlikda tikilgan 360 darajali yon devor yostiq chetlarining choʻkib ketmasligini va yon tomondan doimiy toza havo kirishini taʼminlaydi.",
    airflow: 100,
    rebound: 97,
  },
];

const SHOWROOMS = {
  tashkent: {
    cityVal: "Toshkent",
    title: "Toshkent Flagman Uyqu Galereyasi",
    address:
      "Toshkent shahri, Yunusobod tumani, Amir Temur shoh koʻchasi, 108B-uy. Maxsus sokin sinov xonalarida barcha 6 ta yostiq modelini yotib sinab koʻrish imkoniyati mavjud.",
    hours: "Har kuni 09:00 – 21:00",
    phone: "+998 71 205 88 90",
  },
  samarkand: {
    cityVal: "Samarqand",
    title: "Samarqand Shohona Ipak va Momiq Saloni",
    address:
      "Samarqand shahri, Universitet xiyoboni, 44-uy. Buxoro tut ipagi va ortopedik yostiqlarning individual oʻlchov studiyasi.",
    hours: "Har kuni 09:30 – 20:30",
    phone: "+998 66 233 41 10",
  },
  zurich: {
    cityVal: "Syurix",
    title: "Syurix Uyqu Biomekanikasi Atelyesi",
    address:
      "Bahnhofstrasse 64, 8001 Zürich, Shveysariya. Yevropa ortopedik sertifikatsiya laboratoriyasi va individual buyurtmalar markazi.",
    hours: "Dush–Shan 10:00 – 19:00",
    phone: "+41 44 580 29 10",
  },
};

function formatUzs(amount) {
  return `${Math.round(amount).toLocaleString("fr-FR")} soʻm`;
}

let toastTimer = null;
function showToast(message) {
  const toastEl = document.getElementById("aura-toast");
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2400);
}

let cartState = [
  {
    id: "siberian-cloud-900",
    title: "AURA Bulutli Sibir Momigʻi 900",
    size: "50×70 sm",
    priceUzs: 2450000,
    qty: 1,
  },
];

let configuratorState = {
  position: "side",
  shoulderWidthCm: 46,
  firmness: "medium",
  filling: "goose_down",
};

let activeModalProductId = "siberian-cloud-900";

function initOpeningCurtain() {
  const curtain = document.getElementById("pillow-curtain");
  if (!curtain) return;
  const params = new URLSearchParams(window.location.search);
  const delay = params.get("autostart") === "1" ? 20 : 1950;
  window.setTimeout(() => {
    curtain.classList.add("is-settled");
  }, delay);
}

function initStickyHeaderAndReveal() {
  const header = document.getElementById("top-header");
  const navLinks = document.querySelectorAll(
    '.primary-nav .nav-link[href^="#"]',
  );

  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 18) {
          header.classList.add("is-scrolled");
        } else {
          header.classList.remove("is-scrolled");
        }
      },
      { passive: true },
    );
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  const revealBlocks = document.querySelectorAll(".reveal-plush");
  if ("IntersectionObserver" in window && revealBlocks.length > 0) {
    revealBlocks.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.96) {
        el.classList.add("is-waiting");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("is-waiting");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );

    revealBlocks.forEach((el) => observer.observe(el));
  }
}

function initTactilePillowSimulator() {
  const pillowBtn = document.getElementById("interactive-pillow-btn");
  const pillowText = document.getElementById("interactive-pillow-text");
  const readout = document.getElementById("tactile-status-readout");
  const modeButtons = document.querySelectorAll("[data-loft-mode]");

  if (!pillowBtn || !pillowText || !readout) return;

  const modeConfig = {
    cloud: {
      rebound: "Qaytish vaqti: 1.4 soniya",
      label: "Bulutli 850 FP — bosganda 38% yumshoq choʻkadi",
    },
    balanced: {
      rebound: "Qaytish vaqti: 1.1 soniya",
      label: "Oʻrta Muvozanat — 3 kamerali barqaror tayanch",
    },
    ortho: {
      rebound: "Qaytish vaqti: 0.8 soniya",
      label: "Ortopedik — boʻyin umurtqasini mahkam tutadi",
    },
  };

  pillowBtn.addEventListener("click", () => {
    pillowBtn.classList.add("is-pressed");
    pillowText.textContent = "Yostiq boʻyin shaklini olmoqda...";
    showToast("Yostiq elastiklik sinovi: 850 FP qaytish faol");
    window.setTimeout(() => {
      pillowBtn.classList.remove("is-pressed");
      pillowText.textContent = "Shakl 100% tiklandi — umurtqa tekis holatda";
    }, 850);
  });

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-loft-mode") || "cloud";
      modeButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const info = modeConfig[mode] || modeConfig.cloud;
      readout.textContent = info.rebound;
      pillowText.textContent = info.label;
      pillowBtn.classList.add("is-pressed");
      showToast(`Tayanch rejimi: ${btn.textContent.trim()}`);
      window.setTimeout(() => {
        pillowBtn.classList.remove("is-pressed");
      }, 600);
    });
  });
}

function renderConfiguratorOutput() {
  const matchedTitleEl = document.getElementById("lab-matched-title");
  const summaryEl = document.getElementById("lab-summary-text");
  const loftEl = document.getElementById("lab-loft-val");
  const gsmEl = document.getElementById("lab-gsm-val");
  const spineEl = document.getElementById("lab-spine-val");
  const priceEl = document.getElementById("lab-price-val");
  const addBtn = document.getElementById("lab-add-to-cart-btn");

  if (
    !matchedTitleEl ||
    !summaryEl ||
    !loftEl ||
    !gsmEl ||
    !spineEl ||
    !priceEl
  )
    return;

  const result = calculatePillowRecommendation(configuratorState);
  matchedTitleEl.textContent = result.matchedTitle;
  summaryEl.textContent = result.summaryText;
  loftEl.textContent = `${result.recommendedLoftCm} sm`;
  gsmEl.textContent = `${result.recommendedGsm} GSM`;
  spineEl.textContent = `${result.spinalScore}%`;
  priceEl.textContent = formatUzs(result.unitPriceUzs);

  if (addBtn) {
    addBtn.setAttribute("data-matched-id", result.matchedProductId);
    addBtn.setAttribute("data-matched-loft", `${result.recommendedLoftCm} sm`);
  }
}

function initSleepLabConfigurator() {
  const posBtns = document.querySelectorAll("[data-config-pos]");
  const firmBtns = document.querySelectorAll("[data-config-firm]");
  const fillBtns = document.querySelectorAll("[data-config-fill]");
  const shoulderInput = document.getElementById("shoulder-width-input");
  const shoulderDisplay = document.getElementById("shoulder-width-display");
  const labAddBtn = document.getElementById("lab-add-to-cart-btn");

  if (posBtns.length === 0) return;

  posBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      posBtns.forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      configuratorState.position =
        btn.getAttribute("data-config-pos") || "side";
      renderConfiguratorOutput();
      showToast("Uxlash holati boʻyicha balandlik yangilandi");
    });
  });

  firmBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      firmBtns.forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      configuratorState.firmness =
        btn.getAttribute("data-config-firm") || "medium";
      renderConfiguratorOutput();
      showToast("Yostiq qattiqlik darajasi yangilandi");
    });
  });

  fillBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      fillBtns.forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      configuratorState.filling =
        btn.getAttribute("data-config-fill") || "goose_down";
      renderConfiguratorOutput();
      showToast("Tabiiy toʻldiruvchi tarkib tanlandi");
    });
  });

  if (shoulderInput && shoulderDisplay) {
    shoulderInput.addEventListener("input", () => {
      const val = Number(shoulderInput.value) || 46;
      configuratorState.shoulderWidthCm = val;
      shoulderDisplay.textContent = `${val} sm`;
      renderConfiguratorOutput();
    });
  }

  if (labAddBtn) {
    labAddBtn.addEventListener("click", () => {
      const result = calculatePillowRecommendation(configuratorState);
      addProductToCart(
        result.matchedProductId,
        `50×70 sm · ${result.recommendedLoftCm} sm`,
      );
      openCartDrawer();
      showToast(`${result.matchedTitle} savatga qoʻshildi`);
    });
  }

  renderConfiguratorOutput();
}

function initCatalogAndModal() {
  const filterBtns = document.querySelectorAll("[data-filter-cat]");
  const cards = document.querySelectorAll("[data-product-card]");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-filter-cat") || "all";
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      cards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (cat === "all" || cardCat === cat) {
          card.removeAttribute("hidden");
        } else {
          card.setAttribute("hidden", "true");
        }
      });
      showToast(`Kolleksiya filtri: ${btn.textContent.trim()}`);
    });
  });

  const modalBackdrop = document.getElementById("product-modal-backdrop");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalAddBtn = document.getElementById("modal-add-cart-btn");

  document.querySelectorAll(".inspect-product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-product-id") || "siberian-cloud-900";
      const prod = PRODUCTS[id];
      if (!prod || !modalBackdrop) return;
      activeModalProductId = id;

      const catEl = document.getElementById("modal-product-cat");
      const titleEl = document.getElementById("modal-product-title");
      const descEl = document.getElementById("modal-product-desc");
      const loftEl = document.getElementById("modal-product-loft");
      const gsmEl = document.getElementById("modal-product-gsm");
      const sizeEl = document.getElementById("modal-product-size");
      const priceEl = document.getElementById("modal-product-price");

      if (catEl) catEl.textContent = prod.categoryLabel;
      if (titleEl) titleEl.textContent = prod.title;
      if (descEl) descEl.textContent = prod.desc;
      if (loftEl) loftEl.textContent = prod.loft;
      if (gsmEl) gsmEl.textContent = prod.gsm;
      if (sizeEl) sizeEl.textContent = prod.size;
      if (priceEl) priceEl.textContent = formatUzs(prod.priceUzs);

      modalBackdrop.removeAttribute("hidden");
    });
  });

  if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener("click", () => {
      modalBackdrop.setAttribute("hidden", "true");
    });
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.setAttribute("hidden", "true");
      }
    });
  }

  if (modalAddBtn && modalBackdrop) {
    modalAddBtn.addEventListener("click", () => {
      addProductToCart(activeModalProductId);
      modalBackdrop.setAttribute("hidden", "true");
      openCartDrawer();
      showToast("Yostiq savatga qoʻshildi");
    });
  }

  document.querySelectorAll(".quick-add-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-product-id") || "siberian-cloud-900";
      const prod = PRODUCTS[id] || PRODUCTS["siberian-cloud-900"];
      addProductToCart(id);
      openCartDrawer();
      showToast(`${prod.title} savatga qoʻshildi`);
    });
  });
}

function initAnatomyExplorer() {
  const layerBtns = document.querySelectorAll("[data-layer-idx]");
  if (layerBtns.length === 0) return;

  layerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-layer-idx")) || 0;
      const data = ANATOMY_LAYERS[idx] || ANATOMY_LAYERS[0];

      layerBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const tagEl = document.getElementById("layer-detail-tag");
      const titleEl = document.getElementById("layer-detail-title");
      const descEl = document.getElementById("layer-detail-desc");
      const airVal = document.getElementById("layer-airflow-val");
      const airBar = document.getElementById("layer-airflow-bar");
      const rebVal = document.getElementById("layer-rebound-val");
      const rebBar = document.getElementById("layer-rebound-bar");

      if (tagEl) tagEl.textContent = data.tag;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (airVal) airVal.textContent = `${data.airflow}%`;
      if (airBar) airBar.style.width = `${data.airflow}%`;
      if (rebVal) rebVal.textContent = `${data.rebound}%`;
      if (rebBar) rebBar.style.width = `${data.rebound}%`;
      showToast(data.tag);
    });
  });
}

function initFaqAccordion() {
  const triggers = document.querySelectorAll(".faq-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const body = trigger.nextElementSibling;
      const symbol = trigger.querySelector(".tabular-nums");

      trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (body) {
        if (expanded) {
          body.setAttribute("hidden", "true");
        } else {
          body.removeAttribute("hidden");
        }
      }
      if (symbol) {
        symbol.textContent = expanded ? "+" : "−";
      }
    });
  });
}

function addProductToCart(productId, customSizeLabel) {
  const prod = PRODUCTS[productId] || PRODUCTS["siberian-cloud-900"];
  const sizeLabel = customSizeLabel || prod.size;
  const existing = cartState.find(
    (item) => item.id === prod.id && item.size === sizeLabel,
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({
      id: prod.id,
      title: prod.title,
      size: sizeLabel,
      priceUzs: prod.priceUzs,
      qty: 1,
    });
  }
  renderCart();
}

function renderCart() {
  const badge = document.getElementById("cart-count-badge");
  const container = document.getElementById("cart-items-container");
  const shippingEl = document.getElementById("cart-shipping-val");
  const totalEl = document.getElementById("cart-total-val");

  const totals = calculateCartTotals(cartState);
  if (badge) {
    badge.textContent = `(${totals.totalCount})`;
  }
  if (!container) return;

  container.innerHTML = "";

  if (cartState.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.style.padding = "24px 14px";
    emptyDiv.style.textAlign = "center";
    emptyDiv.style.color = "var(--ink-muted)";
    emptyDiv.textContent =
      "Savatingiz hozircha boʻsh. Kolleksiyadan oʻzingizga mos yostiqni tanlang.";
    container.appendChild(emptyDiv);
  } else {
    cartState.forEach((item, index) => {
      const row = document.createElement("div");
      row.style.background = "var(--surface-mist)";
      row.style.border = "1px solid var(--border-hairline)";
      row.style.borderRadius = "14px";
      row.style.padding = "12px 14px";
      row.style.display = "flex";
      row.style.flexDirection = "column";
      row.style.gap = "8px";

      const topLine = document.createElement("div");
      topLine.style.display = "flex";
      topLine.style.justifyContent = "space-between";
      topLine.style.gap = "8px";

      const titleSpan = document.createElement("strong");
      titleSpan.style.fontSize = "0.88rem";
      titleSpan.textContent = item.title;

      const sizeSpan = document.createElement("span");
      sizeSpan.style.fontSize = "0.74rem";
      sizeSpan.style.color = "var(--ink-muted)";
      sizeSpan.textContent = item.size;

      topLine.appendChild(titleSpan);
      topLine.appendChild(sizeSpan);

      const bottomLine = document.createElement("div");
      bottomLine.style.display = "flex";
      bottomLine.style.alignItems = "center";
      bottomLine.style.justifyContent = "space-between";

      const priceSpan = document.createElement("span");
      priceSpan.className = "tabular-nums";
      priceSpan.style.fontWeight = "700";
      priceSpan.style.fontSize = "0.86rem";
      priceSpan.textContent = formatUzs(item.priceUzs * item.qty);

      const controls = document.createElement("div");
      controls.style.display = "flex";
      controls.style.alignItems = "center";
      controls.style.gap = "6px";

      const minusBtn = document.createElement("button");
      minusBtn.type = "button";
      minusBtn.className = "btn-secondary";
      minusBtn.style.padding = "3px 9px";
      minusBtn.style.minHeight = "28px";
      minusBtn.setAttribute("aria-label", `${item.title} sonini kamaytirish`);
      minusBtn.textContent = "−";
      minusBtn.addEventListener("click", () => {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          cartState.splice(index, 1);
        }
        renderCart();
      });

      const qtySpan = document.createElement("span");
      qtySpan.className = "tabular-nums";
      qtySpan.style.fontWeight = "600";
      qtySpan.textContent = String(item.qty);

      const plusBtn = document.createElement("button");
      plusBtn.type = "button";
      plusBtn.className = "btn-secondary";
      plusBtn.style.padding = "3px 9px";
      plusBtn.style.minHeight = "28px";
      plusBtn.setAttribute("aria-label", `${item.title} sonini oshirish`);
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () => {
        item.qty += 1;
        renderCart();
      });

      controls.appendChild(minusBtn);
      controls.appendChild(qtySpan);
      controls.appendChild(plusBtn);

      bottomLine.appendChild(priceSpan);
      bottomLine.appendChild(controls);

      row.appendChild(topLine);
      row.appendChild(bottomLine);
      container.appendChild(row);
    });
  }

  if (shippingEl) {
    shippingEl.textContent =
      totals.shippingUzs === 0 ? "Bepul" : formatUzs(totals.shippingUzs);
  }
  if (totalEl) {
    totalEl.textContent = formatUzs(totals.grandTotalUzs);
  }
}

function openCartDrawer() {
  const backdrop = document.getElementById("cart-drawer-backdrop");
  if (backdrop) {
    backdrop.removeAttribute("hidden");
  }
}

function initCartDrawer() {
  const openBtn = document.getElementById("open-cart-btn");
  const closeBtn = document.getElementById("close-cart-btn");
  const backdrop = document.getElementById("cart-drawer-backdrop");
  const checkoutForm = document.getElementById("drawer-checkout-form");
  const feedback = document.getElementById("checkout-feedback");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      openCartDrawer();
    });
  }

  if (closeBtn && backdrop) {
    closeBtn.addEventListener("click", () => {
      backdrop.setAttribute("hidden", "true");
    });
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.setAttribute("hidden", "true");
      }
    });
  }

  if (checkoutForm && feedback) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("checkout-name");
      const phoneInput = document.getElementById("checkout-phone");
      const fullName = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";

      if (cartState.length === 0) {
        feedback.hidden = false;
        feedback.className = "form-alert is-error";
        feedback.textContent =
          "Buyurtma berish uchun avval savatga yostiq qoʻshing.";
        return;
      }

      if (fullName.length < 3 || phone.replace(/[^0-9+]/g, "").length < 9) {
        feedback.hidden = false;
        feedback.className = "form-alert is-error";
        feedback.textContent =
          "Iltimos, ismingiz va telefon raqamingizni toʻliq kiriting.";
        return;
      }

      const totals = calculateCartTotals(cartState);
      feedback.hidden = false;
      feedback.className = "form-alert is-success";
      feedback.textContent = `Buyurtma #AU-2048 qabul qilindi, ${fullName}! Jami: ${formatUzs(totals.grandTotalUzs)}. Somnolog-kuratorimiz 10 daqiqada bogʻlanadi.`;
      cartState = [];
      renderCart();
      checkoutForm.reset();
      showToast("Buyurtmangiz muvaffaqiyatli tasdiqlandi!");
    });
  }

  renderCart();
}

let savedFooterNode = null;
let footerParentNode = null;
let footerNextSibling = null;

function switchPageView(mode, targetHash) {
  const homeView = document.getElementById("home-page-view");
  const contactView = document.getElementById("contact-page-view");
  const backHomeBtn = document.getElementById("back-home-btn");
  const navLinks = document.querySelectorAll(".primary-nav .nav-link");
  const navContactLink = document.getElementById("nav-contact-link");

  if (!homeView || !contactView) return;

  if (!savedFooterNode) {
    const footerEl = document.getElementById("main-site-footer");
    if (footerEl && footerEl.parentNode) {
      savedFooterNode = footerEl;
      footerParentNode = footerEl.parentNode;
      footerNextSibling = footerEl.nextSibling;
    }
  }

  if (mode === "contact") {
    homeView.hidden = true;
    contactView.hidden = false;
    if (savedFooterNode && savedFooterNode.parentNode) {
      savedFooterNode.parentNode.removeChild(savedFooterNode);
    }
    if (backHomeBtn) {
      backHomeBtn.hidden = false;
    }
    navLinks.forEach((l) => l.classList.remove("is-active"));
    if (navContactLink) {
      navContactLink.classList.add("is-active");
    }
    document.title = "Bogʻlanish va Shaxsiy Maslahat — AURA YOSTIQ";
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Bogʻlanish va somnolog maslahati sahifasi");
  } else {
    contactView.hidden = true;
    homeView.hidden = false;
    if (savedFooterNode && footerParentNode && !savedFooterNode.parentNode) {
      footerParentNode.insertBefore(savedFooterNode, footerNextSibling);
    }
    if (backHomeBtn) {
      backHomeBtn.hidden = true;
    }
    document.title = "AURA YOSTIQ — Shohona Ortopedik va Ipak Yostiqlar";
    navLinks.forEach((l) => l.classList.remove("is-active"));
    const matchingNav = targetHash
      ? document.querySelector(`.primary-nav .nav-link[href="${targetHash}"]`)
      : document.querySelector('.primary-nav .nav-link[href="#kolleksiya"]');
    if (matchingNav) {
      matchingNav.classList.add("is-active");
    }
    if (targetHash && targetHash.startsWith("#")) {
      const targetSec = document.querySelector(targetHash);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

function initPageRouterAndFallbacks() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  const switchLinks = document.querySelectorAll("[data-page-switch]");
  switchLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const homeView = document.getElementById("home-page-view");
      const contactView = document.getElementById("contact-page-view");
      if (!homeView || !contactView) return;

      e.preventDefault();
      const targetMode = link.getAttribute("data-page-switch") || "home";
      const href = link.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      const targetHash = hashIndex >= 0 ? href.slice(hashIndex) : "";
      switchPageView(targetMode, targetHash);
    });
  });

  if (window.location.hash === "#contact") {
    switchPageView("contact", "");
  }
}

function initContactPage() {
  const showroomBtns = document.querySelectorAll("[data-showroom-btn]");
  const citySelect = document.getElementById("contact-city");

  if (showroomBtns.length > 0) {
    showroomBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-showroom-btn") || "tashkent";
        const info = SHOWROOMS[key] || SHOWROOMS.tashkent;
        showroomBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const titleEl = document.getElementById("showroom-title");
        const addrEl = document.getElementById("showroom-address");
        const hoursEl = document.getElementById("showroom-hours");
        const phoneEl = document.getElementById("showroom-phone");

        if (titleEl) titleEl.textContent = info.title;
        if (addrEl) addrEl.textContent = info.address;
        if (hoursEl) hoursEl.textContent = info.hours;
        if (phoneEl) phoneEl.textContent = info.phone;
        if (citySelect && info.cityVal) {
          citySelect.value = info.cityVal;
        }
        showToast(`${info.title} tanlandi`);
      });
    });
  }

  const contactForm = document.getElementById("contact-consultation-form");
  const alertBox = document.getElementById("contact-form-alert");

  if (contactForm && alertBox) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("contact-fullname")?.value || "";
      const phone = document.getElementById("contact-phone")?.value || "";
      const city = document.getElementById("contact-city")?.value || "";
      const pillowType =
        document.getElementById("contact-pillow-type")?.value || "";
      const message = document.getElementById("contact-message")?.value || "";

      const validation = validateConsultationForm({
        fullName,
        phone,
        city,
        message,
      });

      if (!validation.valid) {
        alertBox.hidden = false;
        alertBox.className = "form-alert is-error";
        alertBox.textContent = validation.errors.join(" ");
        return;
      }

      alertBox.hidden = false;
      alertBox.className = "form-alert is-success";
      alertBox.textContent = `Hurmatli ${fullName.trim()}, ${city} shourumimizga (${pillowType}) boʻyicha murojaatingiz #MS-914 raqami bilan tasdiqlandi! Bosh somnologimiz 15 daqiqa ichida ${phone.trim()} raqamiga qoʻngʻiroq qiladi.`;
      contactForm.reset();
      showToast("Murojaatingiz #MS-914 raqami bilan qabul qilindi!");
    });
  }
}

function initAll() {
  initOpeningCurtain();
  initPageRouterAndFallbacks();
  initStickyHeaderAndReveal();
  initTactilePillowSimulator();
  initSleepLabConfigurator();
  initCatalogAndModal();
  initAnatomyExplorer();
  initFaqAccordion();
  initCartDrawer();
  initContactPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
