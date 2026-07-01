import { DEFAULT_CHRONICLE_DATA } from "./chronicle-default-data.js";

const STORAGE_KEY = "aiChronicleDraftV1";
const PUBLIC_DATA_URL = "./chronicle-data.json";

const saveStatus = document.querySelector("#save-status");
const statusNote = document.querySelector(".status-note");
const eventList = document.querySelector("#event-list");
const metaForm = document.querySelector("#meta-form");
const eventForm = document.querySelector("#event-form");
const previewCard = document.querySelector("#preview-card");
const imagePreview = document.querySelector("#image-preview");

const addEventButton = document.querySelector("#add-event-button");
const moveUpButton = document.querySelector("#move-up-button");
const moveDownButton = document.querySelector("#move-down-button");
const deleteEventButton = document.querySelector("#delete-event-button");
const exportButton = document.querySelector("#export-button");
const publishButton = document.querySelector("#publish-button");
const importButton = document.querySelector("#import-button");
const resetButton = document.querySelector("#reset-button");
const previewLinkButton = document.querySelector("#preview-link");
const uploadImageButton = document.querySelector("#upload-image-button");
const clearImageButton = document.querySelector("#clear-image-button");
const importFileInput = document.querySelector("#import-file-input");
const imageFileInput = document.querySelector("#image-file-input");

let publishedData = null;
let draftData = null;
let selectedEventId = null;
let projectDirectoryHandle = null;

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

function updateStatus(text) {
  saveStatus.textContent = text;
}

function updatePublishingHints() {
  if (!publishButton || !statusNote) {
    return;
  }

  if ("showDirectoryPicker" in window) {
    statusNote.textContent = "Черновик хранится локально в браузере. Кнопка публикации лучше всего работает в Chrome или Edge, после неё остаются только git commit и git push.";
    return;
  }

  publishButton.title = "Во встроенном браузере Codex запись в папку проекта может быть недоступна";
  statusNote.textContent = "Во встроенном браузере Codex кнопка публикации может не записывать файлы проекта. Для публикации откройте editor.html в Chrome или Edge, либо используйте экспорт JSON.";
}

function isAutoFormatLabel(value) {
  return !value || /^\d+\s+карточ/i.test(String(value).trim());
}

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function byRank(left, right) {
  return Number(left.rank ?? 0) - Number(right.rank ?? 0);
}

function normalizeEvent(event, index) {
  return {
    event_id: event.event_id || `event-${Date.now()}-${index + 1}`,
    rank: Number(event.rank ?? index + 1),
    month: event.month || "",
    event_type: event.event_type || "",
    theme: event.theme || "",
    title: event.title || "",
    description: event.description || "",
    chronicle_tone: event.chronicle_tone || "",
    image_caption: event.image_caption || "",
    image_alt: event.image_alt || "",
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

  if (!meta.formatLabel) {
    meta.formatLabel = `${events.length} карточек-событий`;
  }

  return { meta, events };
}

async function fetchPublishedData() {
  const response = await fetch(PUBLIC_DATA_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load published data");
  }
  return response.json();
}

async function loadPublishedData() {
  try {
    const remoteData = await fetchPublishedData();
    return normalizeChronicleData(remoteData);
  } catch (error) {
    console.warn("Using embedded fallback chronicle data in editor.", error);
    return normalizeChronicleData(DEFAULT_CHRONICLE_DATA);
  }
}

function loadDraftFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeChronicleData(JSON.parse(raw)) : null;
  } catch (error) {
    console.warn("Draft chronicle data is unavailable.", error);
    return null;
  }
}

function saveDraft(reason = "Черновик сохранён локально") {
  updateRanks();

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    updateStatus(`${reason} в ${formatTime()}`);
  } catch (error) {
    console.error(error);
    updateStatus("Не удалось сохранить черновик локально");
  }
}

function updateRanks() {
  draftData.events.forEach((event, index) => {
    event.rank = index + 1;
  });

  if (isAutoFormatLabel(draftData.meta.formatLabel)) {
    draftData.meta.formatLabel = `${draftData.events.length} карточек-событий`;
    metaForm.elements.formatLabel.value = draftData.meta.formatLabel;
  }
}

function serializeDraft() {
  updateRanks();
  return JSON.stringify(draftData, null, 2);
}

function getSelectedEvent() {
  return draftData.events.find((event) => event.event_id === selectedEventId) ?? null;
}

function renderEventList() {
  eventList.innerHTML = "";

  draftData.events.forEach((event) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-list-item";
    if (event.event_id === selectedEventId) {
      button.classList.add("is-active");
    }

    button.innerHTML = `
      <span class="event-list-rank">Карточка ${event.rank}</span>
      <strong class="event-list-title">${escapeHtml(event.title || "Без названия")}</strong>
      <span class="event-list-meta">${escapeHtml(event.month || "Без месяца")} · ${escapeHtml(event.event_type || "Без типа")}</span>
    `;

    button.addEventListener("click", () => {
      selectedEventId = event.event_id;
      renderEditor();
    });

    eventList.append(button);
  });
}

function fillMetaForm() {
  Object.entries(draftData.meta).forEach(([key, value]) => {
    if (metaForm.elements[key]) {
      metaForm.elements[key].value = value ?? "";
    }
  });
}

function setFormEnabled(enabled) {
  Array.from(eventForm.elements).forEach((element) => {
    element.disabled = !enabled;
  });

  [moveUpButton, moveDownButton, deleteEventButton, uploadImageButton, clearImageButton].forEach((button) => {
    button.disabled = !enabled;
  });
}

function fillEventForm(event) {
  if (!event) {
    eventForm.reset();
    imagePreview.innerHTML = `
      <div class="image-preview-placeholder">
        <div>Выберите карточку слева или добавьте новую, чтобы начать редактирование.</div>
      </div>
    `;
    setFormEnabled(false);
    return;
  }

  setFormEnabled(true);

  [
    "month",
    "event_type",
    "theme",
    "title",
    "description",
    "chronicle_tone",
    "image_caption",
    "image_alt",
    "source_url",
  ].forEach((field) => {
    eventForm.elements[field].value = event[field] ?? "";
  });

  renderImagePreview(event);
}

function renderImagePreview(event) {
  if (event?.image_src) {
    imagePreview.innerHTML = `<img src="${escapeHtml(event.image_src)}" alt="${escapeHtml(event.image_alt || event.title || "Иллюстрация")}">`;
    return;
  }

  imagePreview.innerHTML = `
    <div class="image-preview-placeholder">
      <div>Картинка ещё не добавлена. Можно загрузить её прямо здесь.</div>
    </div>
  `;
}

function renderPreviewCard() {
  const event = getSelectedEvent();

  if (!event) {
    previewCard.innerHTML = `<p class="preview-empty">Выберите карточку, чтобы увидеть живой предпросмотр.</p>`;
    return;
  }

  const imageMarkup = event.image_src
    ? `<div class="preview-image"><img src="${escapeHtml(event.image_src)}" alt="${escapeHtml(event.image_alt || event.title || "Иллюстрация")}"></div>`
    : `
      <div class="preview-image">
        <div class="preview-image-placeholder">Здесь появится вручную загруженная иллюстрация.</div>
      </div>
    `;

  previewCard.innerHTML = `
    <div class="preview-card-inner">
      <div class="preview-topline">
        <span class="preview-rank">${event.rank}</span>
        <span class="preview-month">${escapeHtml(event.month || "Без месяца")}</span>
        <span class="preview-type">${escapeHtml(event.event_type || "Без типа")}</span>
      </div>

      <h3 class="preview-title">${escapeHtml(event.title || "Без названия")}</h3>
      <span class="preview-theme">${escapeHtml(event.theme || "Без темы")}</span>
      <p class="preview-description">${escapeHtml(event.description || "Добавьте основной текст карточки.")}</p>
      <p class="preview-chronicle">${escapeHtml(event.chronicle_tone || "Добавьте летописную формулировку.")}</p>
      ${imageMarkup}
      ${event.image_caption ? `<p class="preview-caption">«${escapeHtml(event.image_caption)}»</p>` : ""}
      ${event.image_alt ? `<p class="preview-alt">${escapeHtml(event.image_alt)}</p>` : ""}
      ${
        event.source_url
          ? `<a class="preview-link" href="${escapeHtml(event.source_url)}" target="_blank" rel="noreferrer">Открыть исходный тред</a>`
          : `<p class="preview-link-note">Ссылка на исходный тред ещё не добавлена.</p>`
      }
    </div>
  `;
}

function renderEditor() {
  renderEventList();
  fillMetaForm();
  fillEventForm(getSelectedEvent());
  renderPreviewCard();
}

function addNewEvent() {
  const template = draftData.events[draftData.events.length - 1];
  const newEvent = normalizeEvent(
    {
      event_id: `event-${Date.now()}`,
      month: template?.month || "",
      event_type: "",
      theme: "",
      title: "Новая карточка",
      description: "",
      chronicle_tone: "",
      image_caption: "",
      image_alt: "",
      image_src: "",
      source_url: "",
    },
    draftData.events.length
  );

  draftData.events.push(newEvent);
  selectedEventId = newEvent.event_id;
  saveDraft("Добавлена новая карточка");
  renderEditor();
}

function moveSelectedEvent(direction) {
  const currentIndex = draftData.events.findIndex((event) => event.event_id === selectedEventId);
  if (currentIndex < 0) {
    return;
  }

  const targetIndex = currentIndex + direction;
  if (targetIndex < 0 || targetIndex >= draftData.events.length) {
    return;
  }

  const [event] = draftData.events.splice(currentIndex, 1);
  draftData.events.splice(targetIndex, 0, event);
  saveDraft("Порядок карточек обновлён");
  renderEditor();
}

function deleteSelectedEvent() {
  const event = getSelectedEvent();
  if (!event) {
    return;
  }

  const confirmed = window.confirm(`Удалить карточку «${event.title || "Без названия"}»?`);
  if (!confirmed) {
    return;
  }

  draftData.events = draftData.events.filter((item) => item.event_id !== selectedEventId);
  selectedEventId = draftData.events[0]?.event_id ?? null;
  saveDraft("Карточка удалена");
  renderEditor();
}

function exportDraft() {
  const serializedDraft = serializeDraft();
  const blob = new Blob([serializedDraft], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chronicle-data.json";
  link.click();
  URL.revokeObjectURL(url);
  updateStatus(`JSON выгружен в ${formatTime()}`);
}

async function ensureProjectDirectoryHandle() {
  if (!("showDirectoryPicker" in window)) {
    throw new Error("publish-not-supported");
  }

  const handle = projectDirectoryHandle ?? await window.showDirectoryPicker({
    id: "ai-chronicle-project",
    mode: "readwrite",
  });

  const permissionState = await handle.requestPermission({ mode: "readwrite" });
  if (permissionState !== "granted") {
    throw new Error("publish-permission-denied");
  }

  try {
    await handle.getFileHandle("chronicle-data.json");
    await handle.getFileHandle("editor.html");
    await handle.getDirectoryHandle("docs");
  } catch (error) {
    throw new Error("publish-invalid-folder");
  }

  projectDirectoryHandle = handle;
  return handle;
}

async function writeTextFile(directoryHandle, fileName, contents) {
  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

async function publishDraftToProject() {
  if (!draftData) {
    return;
  }

  try {
    if (publishButton) {
      publishButton.disabled = true;
    }

    updateStatus("Готовим публикацию в проект");

    const directoryHandle = await ensureProjectDirectoryHandle();
    const docsHandle = await directoryHandle.getDirectoryHandle("docs");
    const serializedDraft = serializeDraft();

    await writeTextFile(directoryHandle, "chronicle-data.json", serializedDraft);
    await writeTextFile(docsHandle, "chronicle-data.json", serializedDraft);

    publishedData = normalizeChronicleData(JSON.parse(serializedDraft));
    updateStatus(`Опубликовано в проект в ${formatTime()}. Теперь нужно сделать git commit и git push.`);
  } catch (error) {
    console.error(error);

    if (error instanceof DOMException && error.name === "AbortError") {
      updateStatus("Выбор папки отменен");
      return;
    }

    if (error.message === "publish-not-supported") {
      updateStatus("Эта кнопка доступна в Chrome или Edge. Пока можно по-прежнему экспортировать JSON.");
      return;
    }

    if (error.message === "publish-permission-denied") {
      updateStatus("Нет доступа на запись в папку проекта");
      return;
    }

    if (error.message === "publish-invalid-folder") {
      projectDirectoryHandle = null;
      updateStatus("Нужно выбрать корневую папку проекта, где лежат editor.html и папка docs");
      return;
    }

    updateStatus("Не удалось опубликовать изменения в проект");
  } finally {
    if (publishButton) {
      publishButton.disabled = false;
    }
  }
}

function importDraft(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = normalizeChronicleData(JSON.parse(String(reader.result)));
      draftData = imported;
      selectedEventId = draftData.events[0]?.event_id ?? null;
      saveDraft("Импорт выполнен");
      renderEditor();
    } catch (error) {
      console.error(error);
      updateStatus("Не удалось прочитать JSON");
    }
  });
  reader.readAsText(file, "utf-8");
}

function resetToPublished() {
  const confirmed = window.confirm("Сбросить локальный черновик к опубликованной версии?");
  if (!confirmed) {
    return;
  }

  draftData = deepClone(publishedData);
  selectedEventId = draftData.events[0]?.event_id ?? null;
  saveDraft("Черновик сброшен");
  renderEditor();
}

function readImageFile(file) {
  const event = getSelectedEvent();
  if (!event || !file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    event.image_src = String(reader.result || "");
    if (!event.image_alt) {
      event.image_alt = event.title ? `Иллюстрация для события «${event.title}»` : "Иллюстрация для события летописи";
      eventForm.elements.image_alt.value = event.image_alt;
    }
    saveDraft("Картинка обновлена");
    renderEditor();
  });
  reader.readAsDataURL(file);
}

function clearImage() {
  const event = getSelectedEvent();
  if (!event) {
    return;
  }

  event.image_src = "";
  saveDraft("Картинка удалена");
  renderEditor();
}

function openPreviewWindow() {
  const previewWindow = window.open("./chronicle.html?source=preview", "_blank");
  if (!previewWindow) {
    updateStatus("Не удалось открыть предпросмотр");
    return;
  }

  const payload = deepClone(draftData);
  let attempts = 0;
  let acknowledged = false;

  const sendPreviewData = () => {
    if (previewWindow.closed) {
      window.clearInterval(intervalId);
      window.removeEventListener("message", handlePreviewReady);
      return;
    }

    previewWindow.postMessage({ type: "chronicle-preview-data", payload }, "*");
    attempts += 1;

    if (acknowledged || attempts >= 6) {
      window.clearInterval(intervalId);
      window.removeEventListener("message", handlePreviewReady);
    }
  };

  const handlePreviewReady = (event) => {
    if (event.data?.type !== "chronicle-preview-ready") {
      return;
    }

    acknowledged = true;
    sendPreviewData();
  };

  window.addEventListener("message", handlePreviewReady);
  const intervalId = window.setInterval(sendPreviewData, 450);
  sendPreviewData();
}

function bindMetaForm() {
  metaForm.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    draftData.meta[target.name] = target.value;
    saveDraft();
  });
}

function bindEventForm() {
  eventForm.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    const selectedEvent = getSelectedEvent();
    if (!selectedEvent) {
      return;
    }

    selectedEvent[target.name] = target.value;
    saveDraft();
    renderEventList();
    renderPreviewCard();
  });
}

function bindButtons() {
  addEventButton.addEventListener("click", addNewEvent);
  moveUpButton.addEventListener("click", () => moveSelectedEvent(-1));
  moveDownButton.addEventListener("click", () => moveSelectedEvent(1));
  deleteEventButton.addEventListener("click", deleteSelectedEvent);
  exportButton.addEventListener("click", exportDraft);
  publishButton?.addEventListener("click", publishDraftToProject);
  importButton.addEventListener("click", () => importFileInput.click());
  resetButton.addEventListener("click", resetToPublished);
  previewLinkButton.addEventListener("click", openPreviewWindow);
  uploadImageButton.addEventListener("click", () => imageFileInput.click());
  clearImageButton.addEventListener("click", clearImage);

  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files?.[0];
    if (file) {
      importDraft(file);
      importFileInput.value = "";
    }
  });

  imageFileInput.addEventListener("change", () => {
    const file = imageFileInput.files?.[0];
    if (file) {
      readImageFile(file);
      imageFileInput.value = "";
    }
  });
}

async function initEditor() {
  publishedData = await loadPublishedData();
  draftData = loadDraftFromStorage() ?? deepClone(publishedData);
  selectedEventId = draftData.events[0]?.event_id ?? null;

  updatePublishingHints();
  bindMetaForm();
  bindEventForm();
  bindButtons();
  renderEditor();
  updateStatus("Черновик загружен");
}

initEditor();
