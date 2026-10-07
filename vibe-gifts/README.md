# VIBE · FIRST LIGHT — Telegram Gifts

> **Real connections only.**

| Файл | Что внутри |
|---|---|
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Название, brand concept, art direction, цвет, материалы, свет, анимация, редкость, идентичность, сезоны |
| [`CATALOG.md`](CATALOG.md) | 30 gifts: силуэт, концепция, объект, материалы, палитра, анимация, эмоция, цена в ★, сезонные варианты |
| [`catalog.json`](catalog.json) | то же, машинно (для карточек/бота — текст *не* в картинке) |
| `orbit-heart/` | **01 Orbit Heart** — hero-gift: 3D-сцена, превью, экспорты |
| `orbit-heart/*-charm*` | Orbit Heart в стиле **Charm** (rose gold · jelly · satin bow) — см. раздел 14 Design System |

## Orbit Heart — что получилось

Не картинка, а процедурный 3D-объект (three.js, `orbit-heart/orbit-heart.js`):

- сердце бриллиантовой огранки (`gemHeart()`, flat-shaded зигзаг-фасеты) из iridescent crystal (transmission + dispersion + thin-film);
- champagne-gold орбита (наклонное кольцо + хайрлайн) и жемчужина-спутник;
- розовое «ядро» света внутри, бьётся на heartbeat;
- 6 мини-кристальных сердец, рождающихся вокруг;
- студийный свет из soft-box’ов (lavender / ice / pink / champagne / white).

**Loop — 3 с, бесшовный.** Покачивание ±29° и float; два удара сердца (lub-dub) → вспышка ядра и glow; жемчужина — ровно один оборот по орбите; мини-сердца: появление → рост → исчезновение со сдвигом фаз.

### Посмотреть вживую

```bash
cd vibe-gifts && python3 -m http.server 8080
# → http://localhost:8080/orbit-heart/preview.html   (нужен WebGL; ES-модули не работают с file://)
```

### Экспорты — `orbit-heart/exports/`

| Файл | Назначение |
|---|---|
| `orbit-heart_master_2048.png` | master 2048×2048, RGBA, прозрачный фон (объект + glow + тень) |
| `orbit-heart_on-dark_2048.png` | то же на студийном фоне — для лендинга/hero |
| `layers/heart_2048.png`, `ring_2048.png`, `minis_2048.png`, `glow-shadow_2048.png` | слои для анимации/пересборки |
| `orbit-heart_loop_1024_alpha.webm` | 3 с loop, VP9 + alpha, 1024 |
| `orbit-heart_telegram_512.webm` | под спецификацию Telegram video sticker: 512, ≤3 с, 30 fps, VP9 alpha |
| `orbit-heart_loop_1024_dark.mp4` | loop на тёмном фоне (hero лендинга) |

### Пересобрать

```bash
# нужны: node + playwright-core, chromium, python3 (numpy, pillow), ffmpeg
PW_REQUIRE=/path/to/dir-with-node_modules/package.json vibe-gifts/tools/build-orbit-heart.sh /tmp/orbit-build
```

Рендер идёт в headless Chromium (SwiftShader). Альфа строится матированием: цвет рендерится на студийном фоне, маска силуэта даёт alpha, фон «вычитается» из краёв, glow и тень лежат отдельным слоем.

### Каталог

```bash
python3 vibe-gifts/tools/generate_catalog.py   # catalog_data.py → CATALOG.md + catalog.json
```

> Папка лежит рядом с `src/` и **не деплоится** (Vercel Root Directory = `src`).
