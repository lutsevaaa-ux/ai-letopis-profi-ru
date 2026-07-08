const EXACT_TITLE_MAP = {
  "Квест за зарубежной картой": "Начат поход за заморской картой",
  "Профи-Стандарт вышел в поле": "На ратное поле выведен Профи-Стандарт",
  "В Профи-Стандарте дозволен возврат за отклик своими руками": "Путь к казне в Профи-стандарт",
  "На ратное поле выведен Профи-Стандарт": "Путь к казне в Профи-стандарт",
  "Путь к казне в Профи-стандарт": "Путь к казне в Профи-стандарт",
  "Выпущен походный свиток Профи Х 2.32": "И подул ветер перемен",
  "Утвердили летний выезд": "Назначен великий летний пир",
  "Назначен великий летний пир": "И подул ветер перемен",
  "Газ без исключений": "Издан газовый указ без поблажек",
  "Начат великий отвод тарифа «Комиссия»": "Тариф «Комиссия» канул в лету на home+",
  "Издан строгий указ короны": "Тариф «Комиссия» канул в лету на home+",
  "Тариф «Комиссия» канул в лету на home+": "Тариф «Комиссия» канул в лету на home+",
  "Чужая реклама, наш мем": "Чужой глашатай, придворная потеха",
  "Потешный четверг перед майскими": "Потешный четверг возвещён перед майскими гуляниями",
  "Явлен новый свиток двора": "И подул ветер перемен",
  "И подул ветер перемен": "И подул ветер перемен",
};

const EXACT_TONE_MAP = {
  "С этого началась эпоха коллективного поиска, как всё-таки оплатить нужный сервис и не сойти с ума.":
    "С той поры двор сообща искал способ уплатить заморским купцам и не утратить рассудок.",
  "Новый режим появился не на бумаге, а сразу в бою.":
    "Новый свиток был не писан ради архива, но явился двору сразу в боевом деле.",
  "Едва объявили место выезда, как команда мысленно уже жила там.":
    "Не успел глашатай огласить место летнего похода, как весь двор уже помышлял о грядущем странствии.",
  "Там, где раньше была серая зона, появилась понятная граница.":
    "Там, где прежде тянулась серая межа, ныне воздвигнут ясный рубеж.",
  "Иногда один плакат снаружи запускает целую внутреннюю мини-стратегию.":
    "Порой один чужеземный плакат собирает при дворе целый совет о дальнейшей стезе ремесла.",
  "Даже молчащий в чате в этот день смеялся вместе со всеми.":
    "Даже те, кто хранил молчание в палатах, в тот день разделяли общий смех двора.",
};

const EXACT_CAPTION_MAP = {
  "Ещё один пропуск, милорд.": "Ещё один пропуск, милорд.",
  "Поставили. Теперь держим.": "Воздвигли. Теперь держим рубеж.",
  "Осталось только доехать.": "Оставалось лишь запрячь коней.",
  "Сегодня без исключений.": "Ныне без поблажек.",
  "Чей свиток громче?": "Чей свиток звучит громче?",
  "Пятница начинается заранее.": "Пятничные гуляния начинались загодя.",
};

const MEDIEVAL_MARKERS =
  /свитк|двор|корон|глашат|пир|ратн|указ|королевств|заморск|потех|коней|рубеж|палат|межа|гулян/i;

function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function alreadyMedieval(value) {
  return MEDIEVAL_MARKERS.test(value);
}

function buildHaystack(context) {
  return [
    context?.title,
    context?.event_type,
    context?.theme,
    context?.description,
    context?.chronicle_tone,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("ru-RU");
}

export function medievalizeEventTitle(value, context = {}) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return "Новая летописная весть";
  }

  if (EXACT_TITLE_MAP[normalized]) {
    return EXACT_TITLE_MAP[normalized];
  }

  if (alreadyMedieval(normalized)) {
    return normalized;
  }

  const haystack = buildHaystack({ ...context, title: normalized });

  if (haystack.includes("карта") || haystack.includes("esim") || haystack.includes("оплат")) {
    return "Начат поход за заморской картой";
  }

  if (
    haystack.includes("стандарт") ||
    haystack.includes("релиз") ||
    haystack.includes("запуск") ||
    haystack.includes("режим")
  ) {
    if (normalized.toLocaleLowerCase("ru-RU").includes("профи-стандарт")) {
      return "На ратное поле выведен Профи-Стандарт";
    }
    return "И подул ветер перемен";
  }

  if (haystack.includes("выезд") || haystack.includes("летн") || haystack.includes("поход")) {
    return "Назначен великий летний пир";
  }

  if (haystack.includes("газ") || haystack.includes("правил") || haystack.includes("запрет")) {
    return "Издан строгий указ короны";
  }

  if (haystack.includes("реклам") || haystack.includes("конкурент") || haystack.includes("рынок")) {
    return "Чужой глашатай, придворная потеха";
  }

  if (haystack.includes("четверг") || haystack.includes("майск") || haystack.includes("мем")) {
    return "Потешный четверг возвещён перед майскими гуляниями";
  }

  return normalized;
}

export function medievalizeChronicleTone(value, context = {}) {
  const normalized = normalizeText(value);

  if (EXACT_TONE_MAP[normalized]) {
    return EXACT_TONE_MAP[normalized];
  }

  if (normalized && alreadyMedieval(normalized)) {
    return normalized;
  }

  const haystack = buildHaystack(context);

  if (!normalized) {
    if (haystack.includes("выезд") || haystack.includes("летн")) {
      return "Не успел глашатай огласить место похода, как весь двор уже помышлял о странствии.";
    }
    if (haystack.includes("карта") || haystack.includes("esim")) {
      return "Двор ещё не раз вернётся к сей повести о заморских расчётах.";
    }
    if (haystack.includes("релиз") || haystack.includes("стандарт")) {
      return "Сей свиток ещё ждёт летописного толкования.";
    }
    return "Летописец ещё допишет сие толкование.";
  }

  return normalized;
}

export function medievalizeImageCaption(value, context = {}) {
  const normalized = normalizeText(value);

  if (EXACT_CAPTION_MAP[normalized]) {
    return EXACT_CAPTION_MAP[normalized];
  }

  if (normalized && alreadyMedieval(normalized)) {
    return normalized;
  }

  const haystack = buildHaystack(context);

  if (!normalized) {
    if (haystack.includes("выезд") || haystack.includes("летн")) {
      return "Оставалось лишь запрячь коней.";
    }
    if (haystack.includes("релиз") || haystack.includes("стандарт")) {
      return "Рубеж удержан.";
    }
    return "Свиток ждёт последней приписки.";
  }

  return normalized;
}

export function applyMedievalEventStyle(event) {
  const context = { ...event };
  const title = medievalizeEventTitle(event?.title, context);
  const chronicleTone = medievalizeChronicleTone(event?.chronicle_tone, { ...context, title });
  const imageCaption = medievalizeImageCaption(event?.image_caption, {
    ...context,
    title,
    chronicle_tone: chronicleTone,
  });

  return {
    ...event,
    title,
    chronicle_tone: chronicleTone,
    image_caption: imageCaption,
  };
}
