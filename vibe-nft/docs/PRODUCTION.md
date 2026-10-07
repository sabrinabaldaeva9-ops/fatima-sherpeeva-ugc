# Production guide — from concept to Getgems

## 0. Что уже есть

| | Готово |
|---|---|
| Design System, Heroes, Catalog, Attributes | `docs/` |
| 3 реальных 3D-рендера (master 2048 прозрачный + velvet, marketplace 1000, mp4-луп) | `assets/01-vibe-heart`, `assets/02-key-to-you`, `assets/10-orbit-heart` |
| Metadata для всех 30 (TEP-64 / Getgems), URL — плейсхолдеры | `metadata/*.json` |
| Collection metadata | `collection/collection.json` |
| Production-промпты для всех 30 | `prompts/*.md` |
| Рендер-движок: студия + модули объектов | `engine/` |

Остальные 27 объектов пока существуют как спецификация и промпт. **Готовых изображений для них нет.**

---

## 1. Два пути финального рендера для остальных 27

### Путь A — 3D-модуль (рекомендуется: цельность гарантирована)

Новый объект — это файл `engine/objects/<id>.js`:

```js
export const LOOP = 3;      // секунд
export const BEATS = 2;     // ударов сердца за луп
export function build(k) {  // k = kit студии
  const { THREE, M } = k;
  const object = new THREE.Group();
  // геометрия из kit: k.puffyHeart, k.heartTube, k.brilliant, k.ribbon, k.stardust, k.glowBed …
  // материалы: M.roseGold(), M.champagne(), M.pinkGlass(), M.iridescentGlass(), M.pearl(), M.satin(), M.enamel(c) …
  const sparks = [[anchorObject3D, size, phase], …];
  function update(p, beat, w) { /* p ∈ [0,1), w = 2πp; вернуть вертикальный float */ return 0; }
  return { layers: { object }, update, sparks, glow: { size: 5.4 }, shadow: { y: -2.05, w: 2.6 } };
}
```

Затем:

```bash
# один раз: npm i playwright-core  (Chromium уже есть в /opt/pw-browsers или укажите CHROMIUM=)
pip install numpy pillow                      # ffmpeg тоже нужен
PW_REQUIRE=/path/to/package.json engine/tools/build.sh 05-match
# → assets/05-match/{master_2048.png, master_velvet_2048.png, marketplace_1000.png, animation_1000.mp4}
```

В `collection/catalog.py` поставьте объекту `status="rendered"` и перегенерируйте metadata (шаг 3). После этого в ней появятся `content_url` и `content_type`.

### Путь B — image-generation (быстрее, но цельность нужно контролировать)

1. Откройте `prompts/<id>.md` и возьмите Master prompt и Negative prompt.
2. Приложите reference image Vibe **только как style reference** (strength 0.25–0.35). Ещё лучше — `assets/10-orbit-heart/master_velvet_2048.png`: это задаст свет и материалы коллекции.
3. Сгенерируйте 8–16 вариантов, выберите один, зафиксируйте seed.
4. Прозрачный мастер: вырезать объект (matte), glow оставить мягким слоем.
5. Анимация: image-to-video по «Animation prompt» из того же файла, 3–5 с, затем проверить стык лупа.
6. Пройти QC-чеклист в конце промпт-файла.

Для смешанного пути все 30 объектов прогоняются через одну цветокоррекцию: Velvet Night фон, rose gold `#F0BBA8`, тот же уровень glow.

---

## 2. Контроль цельности

Перед публикацией соберите сетку всех 30 marketplace-изображений (5×6) и проверьте:
- одинаковый фон и ореол;
- металл одного оттенка (rose gold, а не жёлтое золото);
- размер объекта 62–72% кадра у всех;
- нет двух соседних похожих силуэтов;
- каждый объект читается в 64 px.

---

## 3. Загрузка и metadata

1. Загрузите папку `assets/` целиком в постоянное хранилище: IPFS (Pinata, nft.storage), TON Storage или собственный CDN. Структура путей должна сохраниться: `<base>/<id>/marketplace_1000.png`, `<base>/collection/avatar_1000.png`.
2. Перегенерируйте metadata с реальным адресом:

```bash
python3 collection/generate.py --base ipfs://<CID_ASSETS>
```

3. Загрузите `metadata/` и `collection/collection.json` (вторым CID или в ту же папку).
4. Проверьте, что ни в одном JSON не осталось `<UPLOAD_BASE_URI>`:

```bash
grep -rl "<UPLOAD_BASE_URI>\|<VIBE_" metadata collection/collection.json
```

`social_links` в `collection.json` заполните вручную: `<VIBE_WEBSITE_URL>`, `<VIBE_TELEGRAM_URL>`.

### Формат item metadata (TEP-64, off-chain)

```json
{
  "name": "Orbit Heart #010",
  "description": "…",
  "image": "<base>/10-orbit-heart/marketplace_1000.png",
  "content_url": "<base>/10-orbit-heart/animation_1000.mp4",
  "content_type": "video/mp4",
  "attributes": [{ "trait_type": "Rarity", "value": "Legendary" }, …]
}
```

`content_url` + `content_type` — поля, которые Getgems использует для показа видео на странице NFT. `image` остаётся постером и превью в сетке.

---

## 4. Минт на Getgems

1. Getgems → **Create collection**: имя, описание, avatar (`assets/collection/avatar_1000.png`), cover (`assets/collection/cover_2400x800.png`), royalty (рекомендация 5–7%).
2. Для 30 предметов удобнее загружать каждый NFT отдельно через интерфейс Getgems: изображение, видео, атрибуты из `metadata/<id>.json`.
3. Альтернатива для массового минта — деплой коллекции с off-chain metadata (`common_content` = base URI, у каждого item свой suffix `<id>.json`).
4. Порядок релиза: сначала Legendary (Orbit Heart) — аукцион как «афиша» коллекции, затем Epic/Rare, затем Common/Uncommon по фиксированной цене.

> Перед минтом проверьте актуальные требования Getgems к размерам и форматам. Их интерфейс и лимиты меняются, а в этом документе описано состояние на момент подготовки.

---

## 5. Сезонные дропы

Сезонный вариант — **тот же `Object`, новый материал и цвет**: Ruby Orbit, Frost Vibe… В metadata меняются `Season`, при необходимости `Color` и `Material`, а `Edition` становится `Season 1/1`. Силуэт не меняется: коллекционер должен узнавать предмет.
