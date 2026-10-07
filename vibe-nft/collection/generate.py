"""catalog.py → metadata/*.json, collection/collection.json, prompts/*.md, docs/CATALOG.md, docs/ATTRIBUTES.md

    python3 collection/generate.py                      # placeholders for URLs
    python3 collection/generate.py --base ipfs://<CID>  # after uploading assets/ (see docs/PRODUCTION.md)
"""
import json, os, sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from catalog import NFTS  # noqa: E402

BASE = sys.argv[sys.argv.index("--base") + 1].rstrip("/") if "--base" in sys.argv else "<UPLOAD_BASE_URI>"
EDITION = "Genesis 1/1"
SEASON = "Genesis"
RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]

COLLECTION = {
    "name": "VIBE — Real Connections Only",
    "description": (
        "VIBE Genesis: 30 one-of-one romantic collectibles by the Vibe dating app. "
        "Rose gold, crystal, pearl and satin objects made to be given to someone you like — "
        "symbols of mutual sympathy, trust and real human connection. Real connections only."
    ),
    "image": f"{BASE}/collection/avatar_1000.png",
    "cover_image": f"{BASE}/collection/cover_2400x800.png",
    "social_links": ["<VIBE_WEBSITE_URL>", "<VIBE_TELEGRAM_URL>"],
}


def attributes(x):
    return [
        {"trait_type": "Rarity", "value": x["rarity"]},
        {"trait_type": "Object", "value": x["obj"]},
        {"trait_type": "Category", "value": x["category"]},
        {"trait_type": "Material", "value": x["material"]},
        {"trait_type": "Metal", "value": x["metal"]},
        {"trait_type": "Color", "value": x["color"]},
        {"trait_type": "Emotion", "value": x["emotion"]},
        {"trait_type": "Connection Type", "value": x["connection"]},
        {"trait_type": "Effect", "value": x["effect"]},
        {"trait_type": "Edition", "value": EDITION},
        {"trait_type": "Season", "value": SEASON},
    ]


def metadata(x):
    m = {
        "name": f"{x['name']} #{x['n']:03d}",
        "description": x["desc"],
        "image": f"{BASE}/{x['slug']}/marketplace_1000.png",
        "attributes": attributes(x),
    }
    if x["status"] == "rendered":
        # Getgems plays content_url (video) in the item page; image stays the poster
        m["content_url"] = f"{BASE}/{x['slug']}/animation_1000.mp4"
        m["content_type"] = "video/mp4"
    return m


# ───────────── prompts ─────────────
STYLE = (
    "luxury romantic collectible object, premium jewelry campaign photography, designer accessory meets glass sculpture "
    "and luxury toy, physically plausible materials, polished rose gold with subtle micro-scratches, real reflections and "
    "refractions, soft caustics, crisp specular highlights, a few delicate four-point star sparkles on the brightest edges, "
    "soft pink-lilac glow around the object, high-end studio lighting (large overhead softbox, dusty-pink left strip, "
    "lavender right strip, warm floor bounce), centered composition, object fills 65% of the frame, generous negative space, "
    "near-black background with a soft plum-rose halo behind the object, shot on 100mm macro, f/8, ultra detailed, 8k"
)
NEGATIVE = (
    "text, letters, watermark, logo, signature, frame, border, people, hands, face, cartoon, emoji, sticker, flat illustration, "
    "neon, acid colors, crypto, bitcoin, ethereum, coins, blockchain symbols, plastic look, toy-like cheap plastic, "
    "oversaturated, blown highlights, noisy, blurry, low detail, cluttered background, multiple objects, cropped object, "
    "deformed geometry, extra parts, duplicated object"
)


def prompt_md(x):
    rendered = x["status"] == "rendered"
    return f"""# {x['n']:02d} · {x['name']} — production prompt

**Rarity:** {x['rarity']} · **Status:** {"3D-рендер готов (`assets/" + x['slug'] + "/`). Промпт — для альтернативного финального рендера." if rendered else "концепт — финальный рендер по этому промпту или 3D-модулю `engine/objects/" + x['slug'] + ".js`"}

## Master prompt (2048×2048, 1:1)

```
{x['prompt']}, {STYLE}
```

## Negative prompt

```
{NEGATIVE}
```

## Reference

Прикладывать reference image Vibe **только как style reference** (strength 0.25–0.35): материалы, свет, уровень качества. Не как composition/structure reference — композицию и предмет задаёт промпт.

## Параметры

| | |
|---|---|
| Размер | 2048×2048 master → 1000×1000 marketplace (Lanczos) |
| Фон | почти чёрный + plum-rose halo; для прозрачного мастера — генерация на однотонном фоне и вырезка (matte) |
| Seed | зафиксировать после выбора, записать в `docs/CATALOG.md` |
| Палитра | {", ".join(x['colors'])} |
| Материалы | {"; ".join(x['materials'])} |

## Animation prompt (image-to-video, {x['anim'].split(' ·')[0]})

```
subtle seamless loop, locked-off camera, {x['anim'].split('· ', 1)[-1]}, slow and elegant motion, no cuts, first and last frame identical
```

## QC перед публикацией
- [ ] силуэт читается в 64 px
- [ ] нет текста, логотипов, лишних предметов
- [ ] металл = rose/champagne gold из палитры, без жёлтого «дешёвого» золота
- [ ] объект по центру, не обрезан, ≥14% поля по краям
- [ ] луп без скачка на стыке
"""


# ───────────── docs ─────────────
def catalog_md():
    L = ["# VIBE Genesis — каталог 30 NFT", "",
         "Сгенерировано из `collection/catalog.py` (`python3 collection/generate.py`). Цены — рекомендация в TON для первичной продажи на Getgems.", "",
         "| # | Name | RU | Rarity | TON | Object | Status |", "|---|---|---|---|---|---|---|"]
    for x in NFTS:
        st = "✅ 3D render" if x["status"] == "rendered" else "концепт + prompt"
        L.append(f"| {x['n']:02d} | **{x['name']}** | {x['ru']} | {x['rarity']} | {x['price']} | {x['obj']} | {st} |")
    L += ["", "| Rarity | Кол-во | TON |", "|---|---|---|"]
    for r in RARITIES:
        ps = [x["price"] for x in NFTS if x["rarity"] == r]
        L.append(f"| {r} | {len(ps)} | {min(ps)}–{max(ps)} |")
    L += [f"| **Итого** | 30 | **{sum(x['price'] for x in NFTS)} TON** при полной продаже |", ""]
    for r in RARITIES:
        L += [f"## {r.upper()}", ""]
        for x in [y for y in NFTS if y["rarity"] == r]:
            L += [f"### {x['n']:02d} — {x['name']} · {x['ru']}", f"`{x['rarity']}` · **{x['price']} TON** · `{x['slug']}`", "",
                  f"- **Concept:** {x['concept']}",
                  f"- **Object design:** {x['design']}",
                  f"- **Silhouette:** {x['silhouette']}",
                  f"- **Materials:** {'; '.join(x['materials'])}",
                  f"- **Colors:** {', '.join(x['colors'])}",
                  f"- **Emotion:** {x['emotion']}",
                  f"- **Meaning:** {x['meaning']}",
                  f"- **Animation:** {x['anim']}",
                  f"- **Marketplace description:** “{x['desc']}”",
                  f"- **Attributes:** " + " · ".join(f"{a['trait_type']}: {a['value']}" for a in attributes(x)),
                  f"- **Seasonal variant:** {x['season']}", ""]
    return "\n".join(L)


def attributes_md():
    traits = defaultdict(Counter)
    for x in NFTS:
        for a in attributes(x):
            traits[a["trait_type"]][a["value"]] += 1
    L = ["# Attribute system (Getgems / TON)", "",
         "Формат — массив `attributes` в off-chain metadata каждого item (TEP-64): `{\"trait_type\": ..., \"value\": ...}`.",
         "Getgems строит по ним фильтры коллекции и показывает редкость значения (% items с этим значением).", "",
         "| Trait | Зачем | Значения |", "|---|---|---|"]
    why = {
        "Rarity": "тир и цена", "Object": "что это за предмет", "Category": "тематика (jewelry, music, travel…)",
        "Material": "главный материал", "Metal": "фурнитура", "Color": "доминирующий цвет",
        "Emotion": "что чувствует получатель", "Connection Type": "этап/тип связи — ключевой для Vibe",
        "Effect": "главное действие анимации", "Edition": "тираж", "Season": "сезон релиза",
    }
    for t, c in traits.items():
        L.append(f"| **{t}** | {why.get(t, '')} | " + ", ".join(f"{v} ({n})" for v, n in sorted(c.items(), key=lambda kv: -kv[1])) + " |")
    L += ["", "## Правила",
          "- Значения — **Title Case на английском**, одинаковое написание во всех items (иначе фильтры Getgems расколются).",
          "- 11 трейтов на item: достаточно для фильтров, без шума.",
          "- Сезонные дропы меняют только `Season` и, при необходимости, `Color` / `Material`; `Object` остаётся — коллекционер узнаёт предмет.",
          "- `Edition: Genesis 1/1` — все 30 предметов уникальны. Если позже будут тиражи (например 1/50 для Common), значение меняется на `Genesis 1/50`.", ""]
    return "\n".join(L)


def main():
    os.makedirs(os.path.join(ROOT, "metadata"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "prompts"), exist_ok=True)
    for x in NFTS:
        with open(os.path.join(ROOT, "metadata", f"{x['slug']}.json"), "w") as f:
            json.dump(metadata(x), f, ensure_ascii=False, indent=2)
            f.write("\n")
        with open(os.path.join(ROOT, "prompts", f"{x['slug']}.md"), "w") as f:
            f.write(prompt_md(x))
    with open(os.path.join(ROOT, "collection", "collection.json"), "w") as f:
        json.dump(COLLECTION, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with open(os.path.join(ROOT, "docs", "CATALOG.md"), "w") as f:
        f.write(catalog_md())
    with open(os.path.join(ROOT, "docs", "ATTRIBUTES.md"), "w") as f:
        f.write(attributes_md())
    print(f"30 metadata · 30 prompts · collection.json · CATALOG.md · ATTRIBUTES.md  (base: {BASE})")


if __name__ == "__main__":
    main()
