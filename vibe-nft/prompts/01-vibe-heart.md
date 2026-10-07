# 01 · Vibe Heart — production prompt

**Rarity:** Uncommon · **Status:** 3D-рендер готов (`assets/01-vibe-heart/`). Промпт — для альтернативного финального рендера.

## Master prompt (2048×2048, 1:1)

```
a luxury designer pendant: a puffy transparent pink-lavender glass heart set in a thin polished rose-gold bezel, a small faceted glowing pink crystal floating inside the glass with a hair-thin rose-gold orbit ring and a tiny pearl bead around it, fine sparkling stardust suspended in the glass, a rose-gold bail, jump ring and bolt-ring clasp at the top, luxury romantic collectible object, premium jewelry campaign photography, designer accessory meets glass sculpture and luxury toy, physically plausible materials, polished rose gold with subtle micro-scratches, real reflections and refractions, soft caustics, crisp specular highlights, a few delicate four-point star sparkles on the brightest edges, soft pink-lilac glow around the object, high-end studio lighting (large overhead softbox, dusty-pink left strip, lavender right strip, warm floor bounce), centered composition, object fills 65% of the frame, generous negative space, near-black background with a soft plum-rose halo behind the object, shot on 100mm macro, f/8, ultra detailed, 8k
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
| Палитра | Dusty Pink, Soft Lavender, Rose Gold, Pearl White |
| Материалы | pink-lavender glass (transmission, IOR 1.48); polished rose gold with micro-scratches; emissive faceted crystal; pearl bead; metallic stardust |

## Animation prompt (image-to-video, 3 с)

```
subtle seamless loop, locked-off camera, кулон поворачивается на кольце (±29°) и чуть качается маятником; два удара сердца → вспышка кристалла; мини-орбита делает оборот, бусина — два в обратную сторону; пыль мерцает., slow and elegant motion, no cuts, first and last frame identical
```

## QC перед публикацией
- [ ] силуэт читается в 64 px
- [ ] нет текста, логотипов, лишних предметов
- [ ] металл = rose/champagne gold из палитры, без жёлтого «дешёвого» золота
- [ ] объект по центру, не обрезан, ≥14% поля по краям
- [ ] луп без скачка на стыке
