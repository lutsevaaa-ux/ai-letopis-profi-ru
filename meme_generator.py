from __future__ import annotations

import json
from pathlib import Path
from typing import Any


STYLE_RULES = (
    "Original concept only.",
    "No famous meme templates.",
    "No real people.",
    "No logos or brand marks.",
    "Visual style: medieval miniature, caricature, or office humor.",
    "Short caption in Russian.",
)


PROFILE_RULES: list[dict[str, Any]] = [
    {
        "keywords": ("карта", "esim", "оплат", "зарубеж", "ai"),
        "title": "Паломники у ворот оплаты",
        "caption": "Ещё один пропуск, милорд.",
        "scene": (
            "A medieval miniature of office scribes and travelers queuing at a guarded gate of access, "
            "holding scrolls, cards, wires, and strange tiny devices, one clerk checking documents while another points to a maze of approvals"
        ),
        "alt": "Средневековая очередь к воротам оплаты сервиса",
    },
    {
        "keywords": ("стандарт", "запуск", "режим", "релиз", "сценари"),
        "title": "Инженеры катят новую башню",
        "caption": "Поставили. Теперь держим.",
        "scene": (
            "A comic medieval workshop where masters in office robes roll a newly built wooden siege tower into the town square, "
            "while scribes below catch falling notes, questions, and checklists"
        ),
        "alt": "Мастера выкатывают новую башню на площадь",
    },
    {
        "keywords": ("выезд", "летн", "поезд", "ретрит", "спа"),
        "title": "Картографы уже всё спланировали",
        "caption": "Осталось только доехать.",
        "scene": (
            "A warm medieval map scene on parchment, with cheerful office travelers drawing campfires, baths, worktables, and banners over a route to a distant manor"
        ),
        "alt": "Старый свиток-карта с подготовкой к выезду команды",
    },
    {
        "keywords": ("газ", "правил", "запрещ", "оборудован"),
        "title": "Страж запирает спорные ворота",
        "caption": "Сегодня без исключений.",
        "scene": (
            "A stern medieval guard closing heavy gates marked with dangerous symbols while relieved clerks behind him put away conflicting instructions"
        ),
        "alt": "Страж закрывает ворота и наводит порядок",
    },
    {
        "keywords": ("реклама", "конкурент", "рынок", "фиксирован", "цена"),
        "title": "Совет спорит у торговых щитов",
        "caption": "Чей свиток громче?",
        "scene": (
            "A satirical medieval marketplace where several office advisors inspect two rival announcement boards with magnifying glasses, arguing over tactics and positioning"
        ),
        "alt": "Советники спорят у двух торговых щитов",
    },
    {
        "keywords": ("четверг", "мем", "ритуал", "майск", "выходн"),
        "title": "Праздничный свиток спускается с небес",
        "caption": "Пятница начинается заранее.",
        "scene": (
            "A playful illuminated manuscript scene where a huge festive scroll floats above a square and tiny office jesters, pigeons, and clerks run toward it carrying jokes and cups"
        ),
        "alt": "Праздничный свиток над площадью и бегущие к нему шутники",
    },
]


DEFAULT_PROFILE = {
    "title": "Писцы обсуждают перемены",
    "caption": "Надо срочно записать.",
    "scene": (
        "A humorous medieval office scene with scribes around a large desk, actively debating a fresh decree while one clerk writes and another gestures toward a parchment board"
    ),
    "alt": "Средневековые писцы обсуждают новое событие",
}


def load_events(path: Path) -> list[dict[str, Any]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise ValueError("events.json must contain a JSON array")
    return raw


def keyword_score(text: str, keywords: tuple[str, ...]) -> int:
    return sum(1 for keyword in keywords if keyword in text)


def pick_profile(text: str) -> dict[str, str]:
    lowered = text.lower()
    best_profile: dict[str, Any] | None = None
    best_score = 0

    for profile in PROFILE_RULES:
        score = keyword_score(lowered, profile["keywords"])
        if score > best_score:
            best_profile = profile
            best_score = score

    if best_profile is None:
        return DEFAULT_PROFILE

    return {
        "title": best_profile["title"],
        "caption": best_profile["caption"],
        "scene": best_profile["scene"],
        "alt": best_profile["alt"],
    }


def build_prompt(event: dict[str, Any], profile: dict[str, str]) -> str:
    event_context = f"Event title: {event['title']}. Theme: {event['theme']}."
    style = (
        "Create an original humorous illustration in a medieval miniature or office caricature style."
    )
    constraints = " ".join(STYLE_RULES)
    return f"{style} {profile['scene']}. {event_context} {constraints}"


def build_meme_idea(event: dict[str, Any]) -> dict[str, str]:
    search_text = " ".join(
        [
            str(event.get("title", "")),
            str(event.get("theme", "")),
            str(event.get("description", "")),
            str(event.get("chronicle_tone", "")),
        ]
    )
    profile = pick_profile(search_text)
    return {
        "event_id": event["event_id"],
        "meme_title": profile["title"],
        "meme_caption": profile["caption"],
        "image_prompt": build_prompt(event, profile),
        "image_alt": profile["alt"],
    }


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    events_path = base_dir / "events.json"
    output_path = base_dir / "meme_ideas.json"

    events = load_events(events_path)
    ideas = [build_meme_idea(event) for event in events]
    output_path.write_text(
        json.dumps(ideas, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Generated {len(ideas)} meme ideas -> {output_path.name}")


if __name__ == "__main__":
    main()
