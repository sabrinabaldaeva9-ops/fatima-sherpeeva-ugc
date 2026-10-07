# 10 · Orbit Heart — production prompt

**Rarity:** Legendary · **Status:** 3D-рендер готов (`assets/10-orbit-heart/`). Промпт — для альтернативного финального рендера.

## Master prompt (2048×2048, 1:1)

```
a large thick transparent iridescent glass heart pierced by a tilted polished rose-gold orbit ring with a thin champagne-gold hairline ring, the part of the ring inside the glass visibly refracted, a large faceted softly glowing pink crystal floating inside the heart, fine sparkling stardust suspended in the glass, small pearls and tiny crystals travelling along the orbit, luxury romantic collectible object, premium jewelry campaign photography, designer accessory meets glass sculpture and luxury toy, physically plausible materials, polished rose gold with subtle micro-scratches, real reflections and refractions, soft caustics, crisp specular highlights, a few delicate four-point star sparkles on the brightest edges, soft pink-lilac glow around the object, high-end studio lighting (large overhead softbox, dusty-pink left strip, lavender right strip, warm floor bounce), centered composition, object fills 65% of the frame, generous negative space, near-black background with a soft plum-rose halo behind the object, shot on 100mm macro, f/8, ultra detailed, 8k
```

## Negative prompt

```
text, letters, watermark, logo, signature, frame, border, people, hands, face, cartoon, emoji, sticker, flat illustration, neon, acid colors, crypto, bitcoin, ethereum, coins, blockchain symbols, plastic look, toy-like cheap plastic, oversaturated, blown highlights, noisy, blurry, low detail, cluttered background, multiple objects, cropped object, deformed geometry, extra parts, duplicated object
```

## Reference

Прикладывать reference image Vibe **только как style reference** (strength 0.25–0.35): материалы, свет, уровень качества. Не как composition/structure reference — композицию и предмет задаёт промпт.

## Параметры

| | |
|---|---|
| Размер | 2048×2048 master → 1000×1000 marketplace (Lanczos) |
| Фон | почти чёрный + plum-rose halo; для прозрачного мастера — генерация на однотонном фоне и вырезка (matte) |
| Seed | зафиксировать после выбора, записать в `docs/CATALOG.md` |
| Палитра | Soft Lavender, Dusty Pink, Rose Gold, Pearl White, Deep Plum |
| Материалы | thick iridescent glass (thin-film, dispersion); polished rose gold; champagne gold hairline; emissive faceted crystal; pearls; stardust |

## Animation prompt (image-to-video, 5 с)

```
subtle seamless loop, locked-off camera, три удара сердца; стекло поворачивается ±24° вместе с орбитой; кристалл делает полный оборот; спутники проходят 1–2 круга; пыль мерцает; искры вспыхивают на гранях., slow and elegant motion, no cuts, first and last frame identical
```

## QC перед публикацией
- [ ] силуэт читается в 64 px
- [ ] нет текста, логотипов, лишних предметов
- [ ] металл = rose/champagne gold из палитры, без жёлтого «дешёвого» золота
- [ ] объект по центру, не обрезан, ≥14% поля по краям
- [ ] луп без скачка на стыке
