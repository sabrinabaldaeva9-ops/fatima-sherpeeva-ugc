# 22 · Attraction — production prompt

**Rarity:** Rare · **Status:** концепт — финальный рендер по этому промпту или 3D-модулю `engine/objects/22-attraction.js`

## Master prompt (2048×2048, 1:1)

```
a thick-walled pink crystal perfume bottle with a heart-shaped hollow inside the glass, shimmering liquid, a polished rose-gold sphere cap, luxury romantic collectible object, premium jewelry campaign photography, designer accessory meets glass sculpture and luxury toy, physically plausible materials, polished rose gold with subtle micro-scratches, real reflections and refractions, soft caustics, crisp specular highlights, a few delicate four-point star sparkles on the brightest edges, soft pink-lilac glow around the object, high-end studio lighting (large overhead softbox, dusty-pink left strip, lavender right strip, warm floor bounce), centered composition, object fills 65% of the frame, generous negative space, near-black background with a soft plum-rose halo behind the object, shot on 100mm macro, f/8, ultra detailed, 8k
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
| Палитра | Dusty Pink, Rose Gold, Lilac |
| Материалы | thick pink crystal; shimmering liquid; rose gold cap |

## Animation prompt (image-to-video, 3 с)

```
subtle seamless loop, locked-off camera, шиммер медленно кружится внутри, флакон дышит, блик скользит., slow and elegant motion, no cuts, first and last frame identical
```

## QC перед публикацией
- [ ] силуэт читается в 64 px
- [ ] нет текста, логотипов, лишних предметов
- [ ] металл = rose/champagne gold из палитры, без жёлтого «дешёвого» золота
- [ ] объект по центру, не обрезан, ≥14% поля по краям
- [ ] луп без скачка на стыке
