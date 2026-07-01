import { DEFAULT_CHRONICLE_DATA } from "./chronicle-default-data.js";

const STORAGE_KEY = "aiChronicleDraftV1";
const PUBLIC_DATA_URL = "./chronicle-data.json";

const timeline = document.querySelector("#timeline");
const monthFilter = document.querySelector("#month-filter");
const typeFilter = document.querySelector("#type-filter");
const themeFilter = document.querySelector("#theme-filter");

const projectName = document.querySelector("#project-name");
const headline = document.querySelector("#headline");
const intro = document.querySelector("#intro");
const periodLabel = document.querySelector("#period-label");
const sourceLabel = document.querySelector("#source-label");
const formatLabel = document.querySelector("#format-label");
const legendTitle = document.querySelector("#legend-title");
const legendText = document.querySelector("#legend-text");
const footerNote = document.querySelector("#footer-note");

let chronicleData = null;

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

function normalizeEvent(event, index) {
  return {
    event_id: event.event_id || `event-${index + 1}`,
    rank: Number(event.rank ?? index + 1),
    month: event.month || "Без месяца",
    event_type: event.event_type || "Без типа",
    theme: event.theme || "Без темы",
    title: event.title || "Без названия",
    description: event.description || "",
    chronicle_tone: event.chronicle_tone || "",
    image_caption: event.image_caption || "",
    image_alt: event.image_alt || "Иллюстрация к событию летописи",
    image_src: event.image_src || "",
    source_url: event.source_url || "",
  };
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
  element.textContent = value || "";
}

function populateMeta(meta, eventCount) {
  setTextContent(projectName, meta.projectName);
  setTextContent(headline, meta.headline);
  setTextContent(intro, meta.intro);
  setTextContent(periodLabel, meta.periodLabel);
  setTextContent(sourceLabel, meta.sourceLabel);
  setTextContent(formatLabel, meta.formatLabel || `${eventCount} карточек-событий`);
  setTextContent(legendTitle, meta.legendTitle);
  setTextContent(legendText, meta.legendText);
  setTextContent(footerNote, meta.footerNote);
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
  const types = [...new Set(events.map((event) => event.event_type))];
  const themes = [...new Set(events.map((event) => event.theme))];

  populateSelect(monthFilter, months, "Все месяцы");
  populateSelect(typeFilter, types, "Все типы");
  populateSelect(themeFilter, themes, "Все темы");
}

function cardMatchesFilters(card) {
  const monthMatch = monthFilter.value === "all" || card.month === monthFilter.value;
  const typeMatch = typeFilter.value === "all" || card.event_type === typeFilter.value;
  const themeMatch = themeFilter.value === "all" || card.theme === themeFilter.value;

  return monthMatch && typeMatch && themeMatch;
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

function createCardElement(card, index) {
  const article = document.createElement("article");
  article.className = "entry";
  article.style.animationDelay = `${index * 90}ms`;

  article.innerHTML = `
    <div class="entry-inner">
      <div class="entry-main">
        <div class="entry-topline">
          <span class="entry-rank">${card.rank}</span>
          <span class="entry-month">${escapeHtml(card.month)}</span>
          <span class="entry-type">${escapeHtml(card.event_type)}</span>
        </div>
        <h2>${escapeHtml(card.title)}</h2>
        <span class="entry-theme">${escapeHtml(card.theme)}</span>
        <p class="entry-description">${escapeHtml(card.description)}</p>
        <p class="entry-chronicle">${escapeHtml(card.chronicle_tone)}</p>
      </div>

      <aside class="entry-side">
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
      </aside>
    </div>
  `;

  return article;
}

function renderEmptyState() {
  timeline.innerHTML = `
    <article class="entry empty-state">
      <p>По выбранным фильтрам пока ничего не найдено. Попробуйте другой месяц, тип события или тему.</p>
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
  [monthFilter, typeFilter, themeFilter].forEach((select) => {
    select.addEventListener("change", renderTimeline);
  });
}

async function initChronicle() {
  chronicleData = await loadChronicleData();
  populateMeta(chronicleData.meta, chronicleData.events.length);
  buildFilterOptions(chronicleData.events);
  bindFilterEvents();
  renderTimeline();
}

initChronicle();
