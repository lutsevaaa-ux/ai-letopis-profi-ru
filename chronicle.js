import { DEFAULT_CHRONICLE_DATA } from "./chronicle-default-data.js";
import { applyMedievalEventStyle } from "./chronicle-style.js";

const STORAGE_KEY = "aiChronicleDraftV1";
const PUBLIC_DATA_URL = "./chronicle-data.json";

const timeline = document.querySelector("#timeline");
const monthFilter = document.querySelector("#month-filter");
const typeFilter = document.querySelector("#type-filter");

const projectName = document.querySelector("#project-name");
const headline = document.querySelector("#headline");
const footerNote = document.querySelector("#footer-note");
const statMonths = document.querySelector("#stat-months");
const statEvents = document.querySelector("#stat-events");
const statImages = document.querySelector("#stat-images");
const statSources = document.querySelector("#stat-sources");

let chronicleData = null;

const EVENT_TYPE_MIGRATIONS = {
  "рабочее": "Для советников короны",
  "релиз": "📜 Новые свитки",
  "командное": "🏰 Хроника двора",
  "правило": "👥 Глас королевства",
  "рынок": "👥 Глас королевства",
  "культура": "🏰 Хроника двора",
  "для сотрудников": "Для советников короны",
  "релизы": "📜 Новые свитки",
  "внутренние движухи": "🏰 Хроника двора",
  "для пользователей": "👥 Глас королевства",
};

const EVENT_TYPE_ORDER = [
  "📜 Новые свитки",
  "🏰 Хроника двора",
  "👥 Глас королевства",
  "Для советников короны",
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function byRank(left, right) {
  return Number(left.rank ?? 0) - Number(right.rank ?? 0);
}

function normalizeEventType(value) {
  const normalizedValue = String(value ?? "").trim();
  const lookupKey = normalizedValue.toLocaleLowerCase("ru-RU");

  return EVENT_TYPE_MIGRATIONS[lookupKey] || normalizedValue || "Для советников короны";
}

function normalizeEvent(event, index) {
  return applyMedievalEventStyle({
    event_id: event.event_id || `event-${index + 1}`,
    rank: Number(event.rank ?? index + 1),
    month: event.month || "Без месяца",
    event_type: normalizeEventType(event.event_type),
    theme: event.theme || "Без темы",
    title: event.title || "Без названия",
    description: event.description || "",
    chronicle_tone: event.chronicle_tone || "",
    image_caption: event.image_caption || "",
    image_alt: event.image_alt || "Иллюстрация к событию летописи",
    image_src: event.image_src || "",
    source_url: event.source_url || "",
  });
}

function normalizeChronicleData(data) {
  const fallback = deepClone(DEFAULT_CHRONICLE_DATA);
  const meta = { ...fallback.meta, ...(data?.meta ?? {}) };
  const events = Array.isArray(data?.events)
    ? data.events.map(normalizeEvent).sort(byRank)
    : fallback.events.map(normalizeEvent).sort(byRank);

  events.forEach((event, index) => {
    event.rank = index + 1;
  });

  return { meta, events };
}

async function fetchPublicData() {
  const response = await fetch(PUBLIC_DATA_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load public chronicle data");
  }
  return response.json();
}

function loadDraftFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Draft chronicle data is unavailable.", error);
    return null;
  }
}

function loadPreviewFromOpener() {
  return new Promise((resolve) => {
    let resolved = false;

    const finish = (data) => {
      if (resolved) {
        return;
      }

      resolved = true;
      window.removeEventListener("message", handleMessage);
      resolve(data);
    };

    const handleMessage = (event) => {
      if (event.data?.type !== "chronicle-preview-data") {
        return;
      }

      finish(normalizeChronicleData(event.data.payload));
    };

    window.addEventListener("message", handleMessage);

    try {
      window.opener?.postMessage({ type: "chronicle-preview-ready" }, "*");
    } catch (error) {
      console.warn("Preview opener is unavailable.", error);
    }

    window.setTimeout(() => {
      const draft = loadDraftFromStorage();
      finish(draft ? normalizeChronicleData(draft) : normalizeChronicleData(DEFAULT_CHRONICLE_DATA));
    }, 1800);
  });
}

async function loadChronicleData() {
  const params = new URLSearchParams(window.location.search);
  const sourceMode = params.get("source");

  if (sourceMode === "preview") {
    return loadPreviewFromOpener();
  }

  if (sourceMode === "draft") {
    const draft = loadDraftFromStorage();
    if (draft) {
      return normalizeChronicleData(draft);
    }
  }

  try {
    const remoteData = await fetchPublicData();
    return normalizeChronicleData(remoteData);
  } catch (error) {
    console.warn("Using embedded fallback chronicle data.", error);
    return normalizeChronicleData(DEFAULT_CHRONICLE_DATA);
  }
}

function setTextContent(element, value) {
  if (element) {
    element.textContent = value || "";
  }
}

function removeClosest(selector) {
  const element = document.querySelector(selector);
  element?.remove();
}

function cleanupLegacyLayout() {
  removeClosest("#intro");
  removeClosest(".hero-meta");
  removeClosest("#period-label");
  removeClosest("#source-label");
  removeClosest("#format-label");
  removeClosest("#legend-title");
  removeClosest("#legend-text");
  document.querySelector(".sheet-intro p")?.remove();
  document.querySelector(".sheet-markers")?.remove();
  document.querySelector(".legend")?.remove();

  const themeField =
    document.querySelector("#theme-filter")?.closest(".filter-field") ||
    [...document.querySelectorAll(".filter-field")].find((field) =>
      field.querySelector(".filter-label")?.textContent?.trim().toLocaleLowerCase("ru-RU") === "тема"
    );
  themeField?.remove();
}

function populateMeta(meta) {
  setTextContent(projectName, meta.projectName);
  setTextContent(headline, meta.headline);
  setTextContent(footerNote, meta.footerNote);
}

function populateStats(events) {
  const monthCount = new Set(events.map((event) => event.month)).size;
  const imageCount = events.filter((event) => event.image_src).length;
  const sourceCount = events.filter((event) => event.source_url).length;

  setTextContent(statMonths, monthCount);
  setTextContent(statEvents, events.length);
  setTextContent(statImages, imageCount);
  setTextContent(statSources, sourceCount);
}

function populateSelect(select, values, allLabel) {
  const currentValue = select.value || "all";
  const options = ['<option value="all">' + allLabel + "</option>"];

  values.forEach((value) => {
    options.push(`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`);
  });

  select.innerHTML = options.join("");
  select.value = values.includes(currentValue) ? currentValue : "all";
}

function buildFilterOptions(events) {
  const months = [...new Set(events.map((event) => event.month))];
  const types = EVENT_TYPE_ORDER.filter((type) => events.some((event) => event.event_type === type));

  populateSelect(monthFilter, months, "Все месяцы");
  populateSelect(typeFilter, types, "Все типы");
}

function cardMatchesFilters(card) {
  const monthMatch = monthFilter.value === "all" || card.month === monthFilter.value;
  const typeMatch = typeFilter.value === "all" || card.event_type === typeFilter.value;

  return monthMatch && typeMatch;
}

function buildVisualMarkup(card) {
  if (card.image_src) {
    return `
      <div class="visual-frame">
        <img src="${escapeHtml(card.image_src)}" alt="${escapeHtml(card.image_alt)}">
      </div>
    `;
  }

  return `
    <div class="visual-frame">
      <div class="image-placeholder">
        <div>
          <strong>Иллюстрация будет добавлена</strong>
          <span>Здесь появится вручную подобранный визуал для этого события.</span>
        </div>
      </div>
    </div>
  `;
}

function getEventPresentation(card) {
  const haystack = [
    card.event_type,
    card.theme,
    card.title,
    card.description,
    card.chronicle_tone,
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes("релиз") || haystack.includes("запуск") || haystack.includes("продукт")) {
    return { icon: "🛡️", tone: "release" };
  }

  if (haystack.includes("правило") || haystack.includes("запр") || haystack.includes("границ")) {
    return { icon: "⚖️", tone: "rule" };
  }

  if (haystack.includes("команд") || haystack.includes("культура") || haystack.includes("выезд") || haystack.includes("ритуал")) {
    return { icon: "🏰", tone: "team" };
  }

  if (haystack.includes("рынок") || haystack.includes("реклама") || haystack.includes("мем")) {
    return { icon: "📰", tone: "market" };
  }

  if (haystack.includes("поиск") || haystack.includes("карта") || haystack.includes("esim") || haystack.includes("ai")) {
    return { icon: "🔮", tone: "news" };
  }

  return { icon: "🌍", tone: "news" };
}

function createCardElement(card, index) {
  const article = document.createElement("article");
  const presentation = getEventPresentation(card);
  article.className = "entry";
  article.dataset.tone = presentation.tone;
  article.style.animationDelay = `${index * 90}ms`;

  article.innerHTML = `
    <div class="entry-inner">
      <div class="entry-topline">
        <span class="entry-month">${escapeHtml(card.month)}</span>
        <span class="entry-index">${String(card.rank).padStart(2, "0")}</span>
      </div>

      <div class="entry-header">
        <div class="entry-icon" aria-hidden="true">${presentation.icon}</div>
        <div class="entry-heading">
          <h2>${escapeHtml(card.title)}</h2>
          <div class="entry-tags">
            <span class="entry-tag entry-tag-type">${escapeHtml(card.event_type)}</span>
          </div>
        </div>
      </div>

      <p class="entry-description">${escapeHtml(card.description)}</p>
      <p class="entry-chronicle">${escapeHtml(card.chronicle_tone)}</p>

      <div class="entry-side">
        <div class="side-panel">
          <span class="side-label">Иллюстрация</span>
          ${buildVisualMarkup(card)}
          ${card.image_caption ? `<p class="image-caption">«${escapeHtml(card.image_caption)}»</p>` : ""}
        </div>

        <div class="side-panel">
          <span class="side-label">Источник</span>
          ${
            card.source_url
              ? `<a class="source-link" href="${escapeHtml(card.source_url)}" target="_blank" rel="noreferrer">Открыть исходный тред</a>`
              : `<p>Ссылка не добавлена.</p>`
          }
        </div>
      </div>
    </div>
  `;

  return article;
}

function renderEmptyState() {
  timeline.innerHTML = `
    <article class="entry empty-state">
      <p>По выбранным фильтрам пока ничего не найдено. Попробуйте другой месяц или тип события.</p>
    </article>
  `;
}

function renderTimeline() {
  const filteredEvents = chronicleData.events.filter(cardMatchesFilters);
  timeline.innerHTML = "";

  if (!filteredEvents.length) {
    renderEmptyState();
    return;
  }

  filteredEvents.forEach((card, index) => {
    timeline.append(createCardElement(card, index));
  });
}

function bindFilterEvents() {
  [monthFilter, typeFilter].forEach((select) => {
    select.addEventListener("change", renderTimeline);
  });
}

async function initChronicle() {
  cleanupLegacyLayout();
  chronicleData = await loadChronicleData();
  populateMeta(chronicleData.meta);
  populateStats(chronicleData.events);
  buildFilterOptions(chronicleData.events);
  bindFilterEvents();
  renderTimeline();
}

initChronicle();
