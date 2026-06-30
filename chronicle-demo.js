const EVENTS_FALLBACK = [
  {
    event_id: "2026-03-foreign-card-esim",
    rank: 1,
    month: "Март 2026",
    title: "Квест за зарубежной картой",
    theme: "AI-быт профийцев",
    description:
      "Весной в компании развернулся настоящий бытовой техно-квест: как получить зарубежную карту, eSIM и рабочий способ оплаты иностранных сервисов. Один пост быстро превратился в коллективную инструкцию по выживанию с обходными путями, неожиданными блокировками и народной экспертизой.",
    chronicle_tone:
      "С этого началась эпоха коллективного поиска, как все-таки оплатить нужный сервис и не сойти с ума.",
    source_url: "https://mmost.x620.net/profi/pl/3y6rewh91jye7deckukr158nwy",
  },
  {
    event_id: "2026-03-profi-standard-launch",
    rank: 2,
    month: "Март 2026",
    title: "Профи-Стандарт вышел в поле",
    theme: "Новый продуктовый режим",
    description:
      "В марте запустили первые сценарии Профи-Стандарта на ограниченном наборе услуг. Для команды это был не абстрактный релиз, а живой старт: с первыми вопросами, уточнениями и быстрым переходом от теории к реальным кейсам.",
    chronicle_tone: "Новый режим появился не на бумаге, а сразу в бою.",
    source_url: "https://mmost.x620.net/support-team/pl/s89qgi6kejnkjjfe41bcfkhd8r",
  },
  {
    event_id: "2026-04-head-office-retreat",
    rank: 3,
    month: "Апрель 2026",
    title: "Утвердили летний выезд",
    theme: "Внутренняя жизнь компании",
    description:
      "Анонс летнего выезда для хэдофиса быстро вышел за рамки сухой новости. Обсуждение мгновенно заполнилось шутками, фантазиями про спа, идеями перенести туда офис и ощущением, что событие уже наполовину началось в чате.",
    chronicle_tone:
      "Едва объявили место выезда, как команда мысленно уже жила там.",
    source_url: "https://mmost.x620.net/profi/pl/pnekr15ds3dndmshcxtjd3ggjo",
  },
  {
    event_id: "2026-04-gas-rule",
    rank: 4,
    month: "Апрель 2026",
    title: "Газ без исключений",
    theme: "Упростили сложное правило",
    description:
      "Весной в поддержке вернули простое и жесткое правило: все заказы, связанные с газом и газовым оборудованием, считаются запрещенными. Для команды это стало не просто обновлением, а редким моментом облегчения, когда спорная зона наконец превратилась в ясную.",
    chronicle_tone:
      "Там, где раньше была серая зона, появилась понятная граница.",
    source_url: "https://mmost.x620.net/support-team/pl/maz7ko6dkjbwiee7s56ge5uioo",
  },
  {
    event_id: "2026-04-competitor-ad",
    rank: 5,
    month: "Апрель 2026",
    title: "Чужая реклама, наш мем",
    theme: "Рынок как зеркало",
    description:
      "В конце апреля в чат принесли рекламу конкурента с фиксированной ценой, и она мгновенно стала внутренним мемом. Но за шутками быстро проявился и второй слой: сравнение подходов, разговор о рынке и попытка понять, что все это значит для собственного продукта.",
    chronicle_tone:
      "Иногда один плакат снаружи запускает целую внутреннюю мини-стратегию.",
    source_url: "https://mmost.x620.net/profi/pl/f5npzbdxgp8izm3o8bym8hc6xy",
  },
  {
    event_id: "2026-04-funny-thursday",
    rank: 6,
    month: "Апрель 2026",
    title: "Потешный четверг перед майскими",
    theme: "Ритуалы команды",
    description:
      "Перед майскими в random снова ожил потешный четверг, и обычная мемная традиция превратилась в длинную праздничную цепочку. Это тот случай, когда сама атмосфера чата уже выглядит как готовая карточка летописи: легкость, шутки и чувство общего предвкушения выходных.",
    chronicle_tone:
      "Даже молчащий в чате в этот день смеялся вместе со всеми.",
    source_url: "https://mmost.x620.net/profi/pl/pzfos8mc4jdyj8say9t7ginoac",
  },
];

const MEME_IDEAS_FALLBACK = [
  {
    event_id: "2026-03-foreign-card-esim",
    meme_title: "Паломники у ворот оплаты",
    meme_caption: "Ещё один пропуск, милорд.",
    image_prompt:
      "Create an original humorous illustration in a medieval miniature or office caricature style. A medieval miniature of office scribes and travelers queuing at a guarded gate of access, holding scrolls, cards, wires, and strange tiny devices, one clerk checking documents while another points to a maze of approvals. Event title: Квест за зарубежной картой. Theme: AI-быт профийцев. Original concept only. No famous meme templates. No real people. No logos or brand marks. Visual style: medieval miniature, caricature, or office humor. Short caption in Russian.",
    image_alt: "Средневековая очередь к воротам оплаты сервиса",
  },
  {
    event_id: "2026-03-profi-standard-launch",
    meme_title: "Инженеры катят новую башню",
    meme_caption: "Поставили. Теперь держим.",
    image_prompt:
      "Create an original humorous illustration in a medieval miniature or office caricature style. A comic medieval workshop where masters in office robes roll a newly built wooden siege tower into the town square, while scribes below catch falling notes, questions, and checklists. Event title: Профи-Стандарт вышел в поле. Theme: Новый продуктовый режим. Original concept only. No famous meme templates. No real people. No logos or brand marks. Visual style: medieval miniature, caricature, or office humor. Short caption in Russian.",
    image_alt: "Мастера выкатывают новую башню на площадь",
  },
  {
    event_id: "2026-04-head-office-retreat",
    meme_title: "Картографы уже всё спланировали",
    meme_caption: "Осталось только доехать.",
    image_prompt:
      "Create an original humorous illustration in a medieval miniature or office caricature style. A warm medieval map scene on parchment, with cheerful office travelers drawing campfires, baths, worktables, and banners over a route to a distant manor. Event title: Утвердили летний выезд. Theme: Внутренняя жизнь компании. Original concept only. No famous meme templates. No real people. No logos or brand marks. Visual style: medieval miniature, caricature, or office humor. Short caption in Russian.",
    image_alt: "Старый свиток-карта с подготовкой к выезду команды",
  },
  {
    event_id: "2026-04-gas-rule",
    meme_title: "Страж запирает спорные ворота",
    meme_caption: "Сегодня без исключений.",
    image_prompt:
      "Create an original humorous illustration in a medieval miniature or office caricature style. A stern medieval guard closing heavy gates marked with dangerous symbols while relieved clerks behind him put away conflicting instructions. Event title: Газ без исключений. Theme: Упростили сложное правило. Original concept only. No famous meme templates. No real people. No logos or brand marks. Visual style: medieval miniature, caricature, or office humor. Short caption in Russian.",
    image_alt: "Страж закрывает ворота и наводит порядок",
  },
  {
    event_id: "2026-04-competitor-ad",
    meme_title: "Совет спорит у торговых щитов",
    meme_caption: "Чей свиток громче?",
    image_prompt:
      "Create an original humorous illustration in a medieval miniature or office caricature style. A satirical medieval marketplace where several office advisors inspect two rival announcement boards with magnifying glasses, arguing over tactics and positioning. Event title: Чужая реклама, наш мем. Theme: Рынок как зеркало. Original concept only. No famous meme templates. No real people. No logos or brand marks. Visual style: medieval miniature, caricature, or office humor. Short caption in Russian.",
    image_alt: "Советники спорят у двух торговых щитов",
  },
  {
    event_id: "2026-04-funny-thursday",
    meme_title: "Праздничный свиток спускается с небес",
    meme_caption: "Пятница начинается заранее.",
    image_prompt:
      "Create an original humorous illustration in a medieval miniature or office caricature style. A playful illuminated manuscript scene where a huge festive scroll floats above a square and tiny office jesters, pigeons, and clerks run toward it carrying jokes and cups. Event title: Потешный четверг перед майскими. Theme: Ритуалы команды. Original concept only. No famous meme templates. No real people. No logos or brand marks. Visual style: medieval miniature, caricature, or office humor. Short caption in Russian.",
    image_alt: "Праздничный свиток над площадью и бегущие к нему шутники",
  },
];

const MEME_IMAGE_BASE = "./generated-memes";

const timeline = document.querySelector("#timeline");
const filterButtons = document.querySelectorAll(".filter-button");

let chronicleCards = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function mergeChronicleData(events, memeIdeas) {
  const ideasById = new Map(memeIdeas.map((idea) => [idea.event_id, idea]));

  return events.map((event) => {
    const memeIdea = ideasById.get(event.event_id) ?? {};
    return {
      ...event,
      meme_title: memeIdea.meme_title ?? "Писцы обсуждают перемены",
      meme_caption: memeIdea.meme_caption ?? "Надо срочно записать.",
      image_prompt:
        memeIdea.image_prompt ??
        "Create an original humorous illustration in a medieval miniature style.",
      image_alt:
        memeIdea.image_alt ?? `Иллюстрация для события «${event.title}»`,
      image_path: `${MEME_IMAGE_BASE}/${event.event_id}.png`,
    };
  });
}

async function loadChronicleData() {
  try {
    const [events, memeIdeas] = await Promise.all([
      loadJson("./events.json"),
      loadJson("./meme_ideas.json"),
    ]);

    return mergeChronicleData(events, memeIdeas);
  } catch (error) {
    console.warn("Using embedded fallback data for chronicle demo.", error);
    return mergeChronicleData(EVENTS_FALLBACK, MEME_IDEAS_FALLBACK);
  }
}

function buildMemePlaceholder(card) {
  return `
    <div class="meme-placeholder">
      <div class="meme-placeholder-art" aria-hidden="true"></div>
      <span class="meme-placeholder-note">Иллюстрация ещё не сгенерирована</span>
      <p class="meme-placeholder-caption">«${escapeHtml(card.meme_caption)}»</p>
      <p class="meme-placeholder-prompt">${escapeHtml(card.image_prompt)}</p>
    </div>
  `;
}

function buildMemeVisual(card) {
  return `
    <div class="meme-media-frame">
      <img class="meme-image" alt="${escapeHtml(card.image_alt)}" loading="eager">
      ${buildMemePlaceholder(card)}
    </div>
    <p class="meme-figure-caption">«${escapeHtml(card.meme_caption)}»</p>
  `;
}

function hydrateMemeVisual(container, card) {
  const image = container.querySelector(".meme-image");
  const resolvedPath = new URL(card.image_path, window.location.href).href;

  image.addEventListener("load", () => {
    container.classList.remove("is-placeholder");
    container.classList.add("is-ready");
  });

  image.addEventListener("error", () => {
    container.classList.remove("is-ready");
    container.classList.add("has-error");
  });

  image.src = resolvedPath;

  if (image.complete && image.naturalWidth > 0) {
    container.classList.remove("is-placeholder");
    container.classList.add("is-ready");
  }
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
        </div>
        <h2>${escapeHtml(card.title)}</h2>
        <span class="entry-theme">${escapeHtml(card.theme)}</span>
        <p class="entry-description">${escapeHtml(card.description)}</p>
        <p class="entry-chronicle">${escapeHtml(card.chronicle_tone)}</p>
      </div>

      <aside class="entry-side">
        <div class="side-panel meme-stage">
          <span class="side-label">Мемная карточка</span>
          <div class="meme-visual is-placeholder">
            ${buildMemeVisual(card)}
          </div>
        </div>

        <div class="side-panel">
          <span class="side-label">Идея для мема</span>
          <h3 class="meme-title">${escapeHtml(card.meme_title)}</h3>
          <p class="meme-caption-line">«${escapeHtml(card.meme_caption)}»</p>
          <p class="meme-alt">${escapeHtml(card.image_alt)}</p>
        </div>

        <div class="side-panel">
          <span class="side-label">Источник</span>
          <a class="source-link" href="${escapeHtml(card.source_url)}" target="_blank" rel="noreferrer">Открыть исходный тред</a>
        </div>
      </aside>
    </div>
  `;

  const visual = article.querySelector(".meme-visual");
  hydrateMemeVisual(visual, card);

  return article;
}

function renderCards(filterValue = "all") {
  timeline.innerHTML = "";

  const filteredCards =
    filterValue === "all"
      ? chronicleCards
      : chronicleCards.filter((card) => card.month === filterValue);

  filteredCards.forEach((card, index) => {
    timeline.append(createCardElement(card, index));
  });
}

async function initChronicle() {
  timeline.innerHTML = `
    <article class="entry">
      <div class="entry-inner">
        <div class="entry-main">
          <div class="entry-topline">
            <span class="entry-month">Загрузка</span>
          </div>
          <h2>Собираем летопись и мемные идеи</h2>
          <p class="entry-description">Подтягиваем события и готовим карточки для свитка.</p>
        </div>
      </div>
    </article>
  `;

  chronicleCards = await loadChronicleData();
  renderCards();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCards(button.dataset.filter);
  });
});

initChronicle();
