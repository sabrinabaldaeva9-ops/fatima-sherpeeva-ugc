"""catalog_data.py → CATALOG.md + catalog.json"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from catalog_data import G

root = os.path.join(os.path.dirname(__file__), '..')
order = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
ru = {"Common": "COMMON · доступные", "Uncommon": "UNCOMMON · необычные", "Rare": "RARE · коллекционные",
      "Epic": "EPIC · впечатляющие", "Legendary": "LEGENDARY · символы Vibe"}
G.sort(key=lambda g: g["id"])

json.dump({"collection": "VIBE · FIRST LIGHT", "tagline": "Real connections only.", "gifts": G},
          open(os.path.join(root, 'catalog.json'), 'w'), ensure_ascii=False, indent=2)

L = ["# VIBE · FIRST LIGHT — каталог 30 Gifts", "",
     "Сгенерировано из `tools/catalog_data.py`. Цены — в Telegram Stars (★), рекомендация для запуска.", "",
     "## Сводка", "", "| ID | Название | RU | Редкость | ★ | Силуэт |", "|---|---|---|---|---|---|"]
for g in G:
    L.append(f"| {g['id']} | **{g['en']}** | {g['ru']} | {g['rarity']} | {g['stars']} | {g['silhouette'].split('.')[0]} |")
L += ["", "### Экономика по тирам", "", "| Тир | Кол-во | ★ диапазон | Рекомендуемый тираж* |", "|---|---|---|---|"]
sup = {"Common": "без лимита на сезон", "Uncommon": "до 50 000", "Rare": "до 10 000", "Epic": "до 2 000", "Legendary": "до 250"}
for r in order:
    s = [g['stars'] for g in G if g['rarity'] == r]
    L.append(f"| {r} | {len(s)} | {min(s)}–{max(s)} | {sup[r]} |")
L += ["", "\\* тираж — рекомендация для обсуждения, не продуктовое обязательство.", ""]

for r in order:
    L += [f"## {ru[r]}", ""]
    for g in [x for x in G if x['rarity'] == r]:
        L += [f"### {g['id']} — {g['en'].upper()} · {g['ru']}",
              f"`{g['rarity']}` · **{g['stars']} ★**", "",
              f"- **Силуэт (1 секунда):** {g['silhouette']}",
              f"- **Концепция:** {g['concept']}",
              f"- **Визуальный объект:** {g['obj']}",
              f"- **Материалы:** {g['materials']}",
              f"- **Палитра:** {g['palette']}",
              f"- **Анимация:** {g['anim']}",
              f"- **Эмоция:** {g['emotion']}",
              f"- **Почему подарят:** {g['why']}",
              f"- **Карточка (RU):** «{g['card_ru']}»",
              f"- **Card (EN):** “{g['card_en']}”",
              f"- **Сезонные варианты:** {g['season']}", ""]
open(os.path.join(root, 'CATALOG.md'), 'w').write("\n".join(L))
print(len(G), 'gifts')
