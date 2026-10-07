# Attribute system (Getgems / TON)

Формат — массив `attributes` в off-chain metadata каждого item (TEP-64): `{"trait_type": ..., "value": ...}`.
Getgems строит по ним фильтры коллекции и показывает редкость значения (% items с этим значением).

| Trait | Зачем | Значения |
|---|---|---|
| **Rarity** | тир и цена | Common (10), Uncommon (8), Rare (6), Epic (4), Legendary (2) |
| **Object** | что это за предмет | Pendant (1), Key (1), Padlock (1), Envelope (1), Twin Crystals (1), Ring (1), Butterfly (1), Café Table (1), Folded Note (1), Orbit Heart (1), Clover Charm (1), Phone Handset (1), Flask (1), Flower (1), Cassette (1), Coffee Dripper (1), Shooting Star (1), Locket (1), Instant Photo (1), Luggage Tag (1), Compass (1), Perfume Bottle (1), Snow Globe (1), Fortune Cookie (1), Astrolabe (1), Mirror Ball (1), Hourglass (1), Music Box (1), Seal Stamp (1), Twin Rings & Thread (1) |
| **Category** | тематика (jewelry, music, travel…) | Connection (3), Jewelry (2), Secret Symbols (2), Attraction (2), First Meeting (2), Luck (2), Music (2), Stars (2), Travel (2), Memories (2), Love Letters (1), Dating (1), Messages (1), Night Conversations (1), Chemistry (1), Flowers (1), Coffee (1), Moon (1), Photography (1) |
| **Material** | главный материал | Pink Crystal (7), Iridescent Crystal (5), Pearl Paper (3), Glossy Ceramic (3), Glossy Enamel (3), Optical Crystal (3), Lavender Glass (2), Liquid Glass (1), Translucent Acrylic (1), Pearlescent (1), Satin & Crystal (1) |
| **Metal** | фурнитура | Rose Gold (19), Champagne Gold (9), None (1), Silver Chrome (1) |
| **Color** | доминирующий цвет | Dusty Pink (7), Soft Lavender (6), Pearl White (4), Champagne (3), Lilac (3), Rose Gold (2), Soft Mint (2), Deep Plum (2), Icy Blue (1) |
| **Emotion** | что чувствует получатель | Nostalgia (2), Destiny (2), Tenderness (1), Trust (1), Safety (1), Anticipation (1), Recognition (1), Devotion (1), Excitement (1), Nervous Joy (1), Sweetness (1), Gravity (1), Hope (1), Intimacy (1), Attraction (1), Admiration (1), Comfort (1), Wonder (1), Longing (1), Adventure (1), Certainty (1), Desire (1), Belonging (1), Playfulness (1), Joy (1), Presence (1), Romance (1), Loyalty (1) |
| **Connection Type** | этап/тип связи — ключевой для Vibe | First Spark (3), Same Wavelength (2), First Words (2), First Meeting (2), Night Talks (2), Shared Taste (2), Memories (2), Destiny (2), Trust (1), Commitment (1), Mutual (1), Promise (1), Chemistry (1), Courtship (1), Slow Dating (1), Wish (1), Plans Together (1), Direction (1), Attraction (1), Time Together (1), Secret Code (1) |
| **Effect** | главное действие анимации | Opening (3), Spin (2), Heartbeat Glow (1), Inner Glow (1), Light Bridge (1), Levitation (1), Particles (1), Steam Heart (1), Unfolding (1), Orbit (1), Pulse (1), Liquid Merge (1), Blooming (1), Liquid Drop (1), Trail (1), Developing (1), Swing (1), Needle Seek (1), Liquid Shimmer (1), Snowfall (1), Reveal (1), Rings Rotation (1), Light Spots (1), Sand Flow (1), Rotation (1), Imprint (1), Glowing Thread (1) |
| **Edition** | тираж | Genesis 1/1 (30) |
| **Season** | сезон релиза | Genesis (30) |

## Правила
- Значения — **Title Case на английском**, одинаковое написание во всех items (иначе фильтры Getgems расколются).
- 11 трейтов на item: достаточно для фильтров, без шума.
- Сезонные дропы меняют только `Season` и, при необходимости, `Color` / `Material`; `Object` остаётся — коллекционер узнаёт предмет.
- `Edition: Genesis 1/1` — все 30 предметов уникальны. Если позже будут тиражи (например 1/50 для Common), значение меняется на `Genesis 1/50`.
