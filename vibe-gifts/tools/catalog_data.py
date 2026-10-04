# VIBE · FIRST LIGHT — source of truth for the 30 gifts.
# `python3 tools/generate_catalog.py` turns this into CATALOG.md + catalog.json.
# Fields: id, en, ru, rarity, stars, silhouette, concept, obj, materials, palette,
#         anim, emotion, why, card_ru, card_en, season

G = []

def gift(**k):
    G.append(k)

# ───────────────────────── COMMON (10) ─────────────────────────
gift(id="01", en="Orbit Heart", ru="Орбитальное сердце", rarity="Common", stars=25,
     silhouette="Огранённое сердце + тонкий наклонный овал-орбита с жемчужиной. Читается как «сердце-планета».",
     concept="«Мы на одной орбите.» Hero всей коллекции: симпатия как гравитация — двое не сталкиваются, а притягиваются.",
     obj="Сердце бриллиантовой огранки из iridescent crystal; вокруг — champagne-gold орбита с хайрлайном и жемчужина-спутник; внутри — розовое «ядро» света; вокруг рождаются мини-кристальные сердечки.",
     materials="Crystal (IOR 1.4, dispersion, iridescence) · brushed/polished champagne gold · pearl · внутренний emissive-core",
     palette="lavender #C9B8FF · pearl #F7F3FF · soft pink #FFC2DD · champagne #E6CC98",
     anim="Loop 3 с. Медленное «шоу-рум» покачивание ±29° + float; два удара сердца за цикл (lub-dub) → вспышка ядра и glow; жемчужина делает ровно один оборот по орбите; 6 мини-сердец всплывают, растут и тают со сдвигом фаз.",
     emotion="Лёгкое притяжение, «ты в моей орбите».",
     why="Самый универсальный первый подарок: безопасно романтичный, не слишком серьёзный — «ты мне интересен(на)».",
     card_ru="Сердце на орбите. Для тех, кто на одной волне.", card_en="A heart in orbit. For people on the same wavelength.",
     season="Valentine: Rosé Orbit (rose-gold кольцо, ядро — глубокий рубиновый). Winter: Frost Orbit (ледяной кристалл, снежные мини-сердца). Summer: Sunset Orbit (peach-gold, жемчужина — коралл).")

gift(id="02", en="Key to You", ru="Ключ к тебе", rarity="Common", stars=25,
     silhouette="Вертикальный минималистичный ключ; головка — сердце-окошко. Силуэт «ключ-сердце» за 1 секунду.",
     concept="«Ты открыл(а) мне что-то настоящее.» Доверие как единственный ключ в мире, где все закрыто.",
     obj="Тонкий ключ: стержень — polished gold, головка — crystal-сердце с прозрачной полостью; бородка — три чистые грани.",
     materials="Brushed gold (стержень) · crystal (сердце) · polished chrome (кромки)",
     palette="champagne #E6CC98 · icy blue #BFE4FF · soft pink #FFC2DD",
     anim="Loop 3 с. Ключ плавно поворачивается вокруг вертикальной оси (±40°), на пике поворота сердце загорается изнутри, затем медленно гаснет; по грани стержня пробегает блик.",
     emotion="Доверие, «ты — особенный».",
     why="Подарок для момента, когда разговор стал настоящим.",
     card_ru="Ключ, который подходит только к одному сердцу.", card_en="A key that fits only one heart.",
     season="Spring: Garden Key (ключ с мятным листом). Winter: Ice Key (ледяной стержень, иней). Anniversary: Key №1 (гравировка даты как отдельный attribute).")

gift(id="05", en="Love Letter", ru="Любовное письмо", rarity="Common", stars=30,
     silhouette="Горизонтальный конверт с клапаном-«V» и круглой печатью-сердцем по центру.",
     concept="Слова, которые не отправили бы в сторис. Письмо — как личный жест среди бесконечных чатов.",
     obj="Конверт из pearl paper (мягкая бумажная фактура + жемчужный перелив), золотая восковая печать в форме сердца, внутри — мягкий свет.",
     materials="Pearlescent paper · gold wax seal (polished) · soft internal glow",
     palette="pearl #F7F3FF · champagne #E6CC98 · soft pink #FFC2DD",
     anim="Loop 3 с. Конверт слегка парит, клапан приоткрывается на 15°, изнутри нарастает тёплый свет и поднимается уголок письма; к концу цикла клапан мягко закрывается. Печать при этом остаётся целой.",
     emotion="Нежность, искренность.",
     why="Когда хочется сказать больше, чем «привет».",
     card_ru="Несколько слов — и всё меняется.", card_en="A few words, and everything changes.",
     season="Valentine: Rosé Letter (розовая бумага, красная печать). Autumn: Amber Letter (янтарный воск). New Year: Starlight Letter (звёздная пыль из конверта).")

gift(id="06", en="Vibe Coffee", ru="Вайб-кофе", rarity="Common", stars=25,
     silhouette="Конический стакан с крышкой и манжетой, над ним — S-образный пар, переходящий в сердечки.",
     concept="Первое свидание, которое начинается с «пойдём за кофе». Ритуал знакомства.",
     obj="Прозрачный стакан to-go с пенкой латте, манжета pearl, маленькое сердце Vibe на стенке (единственный брендинг), крышка — frosted acrylic.",
     materials="Clear glass/acrylic · frosted acrylic lid · pearl sleeve · espresso-gradient (дымчатая карамель, не коричневая грязь)",
     palette="pearl #F7F3FF · champagne #E6CC98 · soft pink #FFC2DD · deep black #0B0A12 (кофе)",
     anim="Loop 3 с. Лёгкое «дыхание» стакана; пар поднимается спиралью и на высоте превращается в 3–4 сердечка, которые растворяются; на поверхности пенки дрожит блик.",
     emotion="Уют, лёгкое начало.",
     why="Самое лёгкое «давай встретимся».",
     card_ru="Один кофе. Одна встреча. Один вайб.", card_en="One coffee. One meet-up. One vibe.",
     season="Autumn: Pumpkin Sip (специи, тёплый янтарь). Winter: Snow Latte (иней, снежное сердце). Summer: Iced Vibe (лёд, кристаллы).")

gift(id="10", en="Matcha Love", ru="Маття-любовь", rarity="Common", stars=30,
     silhouette="Низкий широкий стакан-чаван + мягкий кристальный «облак-сердце» над ним.",
     concept="Японский минимализм × Vibe: спокойствие и осознанность в знакомстве.",
     obj="Минималистичный прозрачный стакан с matcha-градиентом; сверху поднимается облачко из кристаллических сердец; бамбуковая ложка-акцент — ультратонкий gold.",
     materials="Glass · liquid matcha (светлый мятно-зелёный, полупрозрачный) · crystal particles · thin gold",
     palette="mint #BFF3E0 · pearl #F7F3FF · champagne #E6CC98",
     anim="Loop 3 с. Лёгкая рябь на поверхности; из напитка медленно поднимается кластер кристальных сердец и распадается на искры; ложка едва качается.",
     emotion="Спокойствие, mindful-dating.",
     why="Для человека, с которым хочется тишины и лёгкости.",
     card_ru="Спокойный вайб. Медленное знакомство.", card_en="Calm vibe. A slow kind of getting to know you.",
     season="Spring: Sakura Matcha (лепестки). Winter: Hojicha Glow (тёплый янтарь). Summer: Iced Matcha (лёд, мята).")

gift(id="11", en="First Words", ru="Первые слова", rarity="Common", stars=25,
     silhouette="Облачко сообщения с «хвостиком» + три точки печати, одна из которых — сердце.",
     concept="Момент, когда ты увидел(а) «печатает…» — самый волнительный момент в dating.",
     obj="Хрустальный message bubble, три кристальные точки typing; третья точка — маленькое сердце.",
     materials="Clear crystal · frosted inner · pearl dots",
     palette="icy blue #BFE4FF · pearl #F7F3FF · soft pink #FFC2DD",
     anim="Loop 3 с. Точки по очереди пульсируют (typing-ритм), третья превращается в сердце и «хлопает» мягкой волной; bubble слегка покачивается.",
     emotion="Предвкушение, лёгкое волнение.",
     why="Чтобы сказать «я жду твоего ответа».",
     card_ru="Он(а) печатает… и ты уже улыбаешься.", card_en="Typing… and you’re already smiling.",
     season="Valentine: Secret Message (замочек на пузыре). Summer: Hello, Sun. Winter: Frost Bubble.")

gift(id="12", en="Instant Match", ru="Мгновенный матч", rarity="Common", stars=35,
     silhouette="Квадратная рамка Polaroid с наклоном 6° и вылезающей наполовину из камеры карточкой.",
     concept="Знакомство, которое хочется запомнить: фото-момент, который проявляется прямо на глазах.",
     obj="Полупрозрачный Polaroid-карточка (pearl frame), внутри — проявляющийся градиент lavender→pink с силуэтами двух сердец (никаких лиц, никакого контента).",
     materials="Pearl plastic frame · crystal «фото-окно» · holographic film",
     palette="pearl #F7F3FF · lavender #C9B8FF · soft pink #FFC2DD",
     anim="Loop 3 с. Карточка выезжает на 12%, изображение медленно проявляется (blur → sharp), два сердца в окне смещаются навстречу друг другу и сливаются; затем карточка скользит обратно.",
     emotion="Ностальгия, момент, который хочется сохранить.",
     why="Подарок «давай сделаем первое фото вместе».",
     card_ru="Момент, который проявляется прямо сейчас.", card_en="A moment, developing right now.",
     season="Summer: Beach Roll. Autumn: Film Grain Amber. New Year: Flash Night.")

gift(id="13", en="Cherry Link", ru="Вишнёвая связь", rarity="Common", stars=30,
     silhouette="Две сферы на общем стебле, образующем сердце с листиком — «вишни-близнецы».",
     concept="Две вишни на одном стебле — «нас двое, но мы связаны».",
     obj="Две глянцевые вишни из liquid-glass, соединённые золотым стебельком в форме мини-сердца, один кристальный листик.",
     materials="Liquid glass (дымчатый бордо→розовый) · polished gold stem · crystal leaf",
     palette="soft pink #FFC2DD · electric violet #7B5CFF (глубокие тона) · champagne #E6CC98",
     anim="Loop 3 с. Две вишни качаются в противофазе, стебель-сердце пульсирует, по глянцу скользит блик.",
     emotion="Игривость, флирт.",
     why="Лёгкий флирт без давления.",
     card_ru="Двое. Один стебель. Ноль серьёзности.", card_en="Two of you. One stem. Zero pressure.",
     season="Summer: Cherry Pop. Valentine: Double Cherry Rosé. Spring: Blossom Cherry.")

gift(id="14", en="Cloud Nine", ru="Облако девять", rarity="Common", stars=25,
     silhouette="Мягкое облако-капля с девятью микро-звёздами; одна из звёзд — сердце.",
     concept="Состояние, когда ты влюблён — «я на облаке».",
     obj="Выпуклое облако из pearl-glass, внутри — мягкий лавандовый свет; по краю — 9 мини-звёзд.",
     materials="Pearlescent glass · frosted volume · crystal stars",
     palette="pearl #F7F3FF · icy blue #BFE4FF · lavender #C9B8FF",
     anim="Loop 3 с. Облако «дышит» (scale ±3%), звёзды по очереди вспыхивают, одна из них становится сердцем; лёгкий дрейф вверх-вниз.",
     emotion="Лёгкость, эйфория.",
     why="«Рядом с тобой я на облаке».",
     card_ru="Рядом с тобой — на девятом облаке.", card_en="With you, I’m on cloud nine.",
     season="Spring: Rain Cloud Bloom. Winter: Snow Cloud. Sunset: Peach Cloud.")

gift(id="15", en="Wrapped in You", ru="Завернут(а) в тебя", rarity="Common", stars=30,
     silhouette="Атласный бант с двумя петлями и двумя хвостами, в центре — узел-сердце.",
     concept="Ощущение подарка, которым хочется быть для кого-то. Бант как знак «это — для тебя».",
     obj="Бант из liquid-satin glass (шёлковая прозрачность), центральный узел — gold-сердце.",
     materials="Satin-glass · polished gold · pearl highlights",
     palette="soft pink #FFC2DD · pearl #F7F3FF · champagne #E6CC98",
     anim="Loop 3 с. Бант слегка развязывается и затягивается обратно (unfold), хвосты колышутся, узел-сердце пульсирует.",
     emotion="Забота, «это для тебя».",
     why="Универсальный подарок-упаковка для любого повода.",
     card_ru="Лучший подарок — быть для кого-то особенным.", card_en="The best gift is being someone’s favourite.",
     season="Valentine: Ruby Bow. Winter: Frost Ribbon. New Year: Gold Ribbon.")

# ───────────────────────── UNCOMMON (8) ─────────────────────────
gift(id="03", en="Eternal Bloom", ru="Вечный цветок", rarity="Uncommon", stars=90,
     silhouette="Бутон-тюльпан из 5 лепестков, симметричный, на тонком золотом стебле; в раскрытом виде — «чаша-звезда».",
     concept="«Это чувство хочется сохранить.» Цветок, который не вянет — digital-эквивалент вечной розы.",
     obj="Футуристический цветок из holographic crystal: лепестки раскрываются и закрываются; в центре появляется светящееся сердце.",
     materials="Holographic crystal (thin-film) · brushed gold стебель · inner emissive pistil",
     palette="lavender #C9B8FF · mint #BFF3E0 · soft pink #FFC2DD · champagne #E6CC98",
     anim="Loop 3 с. Лепестки плавно раскрываются (0→70%) и закрываются, в раскрытой фазе в центре появляется пульсирующее сердце; holographic shift переливает lavender→mint→pink.",
     emotion="Нежность, желание сохранить момент.",
     why="Когда хочется подарить «цветы», которые не завянут.",
     card_ru="Цветок, который не завянет.", card_en="A bloom that never fades.",
     season="Spring: Sakura Bloom. Autumn: Amber Bloom. Winter: Frost Bloom (ледяные лепестки). Valentine: Rosé Bloom.")

gift(id="09", en="Sweet Chaos", ru="Сладкий хаос", rarity="Uncommon", stars=110,
     silhouette="Мягкое «плавящееся» сердце: верх — глянцевые лопасти, низ — с каплями, как стекающая глазурь.",
     concept="Чувства — не по плану. Chaos × sweetness: в хорошем знакомстве всегда немного беспорядка.",
     obj="Сердце из glossy liquid glass, поверхность слегка стекает; на ней проявляется надпись GOOD PEOPLE / BRIGHTER DATES (часть объекта: гравировка внутри стекла).",
     materials="Liquid glass · glossy ceramic highlights · embossed text внутри материала",
     palette="soft pink #FFC2DD · lavender #C9B8FF · pearl #F7F3FF",
     anim="Loop 3 с. Медленное «течение» материала (vertex-deformation), капли стекают и втягиваются обратно, надпись проявляется и растворяется в блике.",
     emotion="Игривость, радость от неидеальности.",
     why="Для человека, который приносит яркий хаос в твою жизнь.",
     card_ru="Хорошие люди. Яркие свидания.", card_en="Good people. Brighter dates.",
     season="Summer: Melting Peach. Valentine: Ruby Chaos. Halloween: Midnight Drip.")

gift(id="16", en="Signature Scent", ru="Твой аромат", rarity="Uncommon", stars=95,
     silhouette="Высокий прямоугольный флакон со скошенными гранями и сферической золотой крышкой-«каплей».",
     concept="Запах, по которому тебя узнают. Парфюм как личный след в чужой памяти.",
     obj="Флакон из thick crystal с gradient-жидкостью lavender→pink, крышка — polished gold, микро-сердце как «акцент» на стекле (без бренда).",
     materials="Thick crystal glass · liquid gradient · polished gold",
     palette="lavender #C9B8FF · soft pink #FFC2DD · champagne #E6CC98",
     anim="Loop 3 с. Лёгкое покачивание флакона, жидкость переливается, из распылителя выходит мягкое облако шиммера, исчезающее в сердечки.",
     emotion="Чувственность, запоминающийся след.",
     why="«Хочу, чтобы ты меня запомнил(а)».",
     card_ru="Запах, который остаётся в памяти.", card_en="The scent that stays on your mind.",
     season="Autumn: Amber Oud. Winter: Cashmere Frost. Summer: Citrus Skin.")

gift(id="17", en="Shared Playlist", ru="Один плейлист", rarity="Uncommon", stars=100,
     silhouette="Кассета в трапециевидном корпусе с двумя катушками, одна — сердце.",
     concept="Музыка как язык симпатии: два человека — один плейлист.",
     obj="Прозрачная кассета, пленка — iridescent ribbon, катушки: одна круглая, вторая — в форме сердца.",
     materials="Clear acrylic · holographic tape · chrome reels",
     palette="icy blue #BFE4FF · lavender #C9B8FF · champagne #E6CC98",
     anim="Loop 3 с. Катушки вращаются синхронно, пленка перетекает от круглой катушки к сердцу, на пленке бежит lavender-пульс (эквалайзер).",
     emotion="Общность, «мы на одной волне».",
     why="Подарок для того, с кем совпал музыкальный вкус.",
     card_ru="Одна музыка на двоих.", card_en="One soundtrack for two.",
     season="Summer: Beach Tape. Autumn: Vinyl Amber. Winter: Frost Tape.")

gift(id="18", en="Two Frequencies", ru="Две частоты", rarity="Uncommon", stars=105,
     silhouette="Полноразмерные наушники: дугообразная дужка + две чаши; кабель между ними свёрнут в сердце.",
     concept="Один кабель — два наушника: поделиться треком = поделиться собой.",
     obj="Премиальные over-ear наушники из translucent acrylic и chrome; между чашами светится «кабельное» сердце.",
     materials="Translucent acrylic · polished chrome · soft metallic",
     palette="pearl #F7F3FF · icy blue #BFE4FF · lavender #C9B8FF",
     anim="Loop 3 с. Наушники покачиваются, между чашами идёт волна от левой к правой, в середине волны рождается сердце.",
     emotion="Близость, обмен вайбом.",
     why="«Послушай этот трек со мной».",
     card_ru="Две частоты. Один резонанс.", card_en="Two frequencies. One resonance.",
     season="Winter: Frost Cans. Summer: Festival Edition. Valentine: Rosé Cans.")

gift(id="19", en="Plus One", ru="Билет на двоих", rarity="Uncommon", stars=100,
     silhouette="Горизонтальный билет с вырезами-полукругами по бокам и перфорацией по центру.",
     concept="Приглашение, которое нельзя отклонить: «идём со мной».",
     obj="Золотой билет из brushed gold с перфорацией в форме сердечек, прозрачное окошко, гравировка «+1» (часть объекта).",
     materials="Brushed gold · transparent window · embossed micro-pattern",
     palette="champagne #E6CC98 · pearl #F7F3FF · lavender #C9B8FF",
     anim="Loop 3 с. Билет парит, перфорация подсвечивается волной, «+1» пульсирует, по поверхности проходит блик.",
     emotion="Приглашение, предвкушение.",
     why="Приглашение на первое свидание, концерт или поездку.",
     card_ru="Билет туда, где будет хорошо. Для двоих.", card_en="A ticket to somewhere good. For two.",
     season="Summer: Festival Pass. Winter: Premiere Night. New Year: Midnight Entry.")

gift(id="20", en="Safe With You", ru="Рядом безопасно", rarity="Uncommon", stars=110,
     silhouette="Классический навесной замок с дужкой; в замочной скважине — сердце, дужка при открытии образует сердце.",
     concept="Безопасность и доверие — главный дефицит в онлайн-знакомствах. Замок, который открывается только для тебя.",
     obj="Замок из polished chrome + crystal, скважина светится изнутри; дужка при открытии вместе с корпусом образует сердце.",
     materials="Polished chrome · crystal · inner glow",
     palette="icy blue #BFE4FF · chrome silver · soft pink #FFC2DD",
     anim="Loop 3 с. Дужка плавно поднимается (open), сердце в скважине загорается, затем закрывается с мягким «щелчком» (небольшая пружина).",
     emotion="Доверие, безопасность.",
     why="Подарок человеку, рядом с которым спокойно.",
     card_ru="Рядом с тобой — безопасно.", card_en="Safe with you.",
     season="Winter: Ice Lock. Valentine: Rosé Lock. Anniversary: Lock & Date.")

gift(id="21", en="Home for Two", ru="Дом на двоих", rarity="Uncommon", stars=115,
     silhouette="Остроконечный домик-призма с трубой, одним тёплым окном-сердцем и крохотным дымом.",
     concept="Стремление к «своему месту» — уют вдвоём.",
     obj="Маленький домик из frosted crystal, окошко светится тёплым champagne-светом, дым превращается в сердца.",
     materials="Frosted crystal · gold frame · emissive window",
     palette="pearl #F7F3FF · champagne #E6CC98 · soft pink #FFC2DD",
     anim="Loop 3 с. Окно мягко мерцает, из трубы поднимается дымок и превращается в сердечки, дом слегка «дышит».",
     emotion="Уют, «хочу домой — к тебе».",
     why="Подарок для серьёзных намерений.",
     card_ru="Уютно там, где ты.", card_en="Home is wherever you are.",
     season="Winter: Snow Cabin. Autumn: Amber Hearth. Spring: Garden Cottage.")

# ───────────────────────── RARE (6) ─────────────────────────
gift(id="04", en="Moonlight Cat", ru="Лунный кот", rarity="Rare", stars=250,
     silhouette="Силуэт кота-«буханка» на полумесяце: треугольные уши, дугой изогнутый хвост.",
     concept="Ночная нежность: независимый кот, который выбрал тебя. Не cartoon, а sculpture.",
     obj="Минималистичный стеклянный кот, свернувшийся на маленькой луне из pearl-crystal; хвост слегка двигается, вокруг мерцают звёзды.",
     materials="Smoked/clear crystal (кот) · pearl moon · gold stars · soft rim light",
     palette="lavender #C9B8FF · pearl #F7F3FF · deep black #0B0A12 · champagne #E6CC98",
     anim="Loop 3 с. «Дыхание» кота (±2%), хвост плавно машет (pendulum), уши чуть шевелятся, звёзды мерцают с разной фазой.",
     emotion="Уют, ночная нежность.",
     why="Подарок для «ночных» разговоров.",
     card_ru="Тот, кто выбрал тебя, — самый ценный.", card_en="The one who chose you is the rarest.",
     season="Winter: Snowfall Cat. Halloween: Midnight Cat. Spring: Blossom Moon.")

gift(id="07", en="Butterfly Effect", ru="Эффект бабочки", rarity="Rare", stars=280,
     silhouette="Симметричная бабочка с раскрытыми крыльями, нижние крылья — удлинённые.",
     concept="«Одно маленькое знакомство может изменить всё.»",
     obj="Хрустальная бабочка; крылья переливаются lavender → pink → mint; тончайшие золотые прожилки.",
     materials="Thin-film crystal · holographic · gold veins",
     palette="lavender #C9B8FF · soft pink #FFC2DD · mint #BFF3E0",
     anim="Loop 3 с. Взмах крыльев (scaleX/curl), за ними — particle trail; holographic shift по крыльям; лёгкий float.",
     emotion="Трепет, «всё только начинается».",
     why="Для человека, который вызывает бабочек.",
     card_ru="Одно знакомство — и всё иначе.", card_en="One hello, and everything changes.",
     season="Spring: Sakura Wings. Summer: Sunset Wings. Winter: Frost Wings.")

gift(id="22", en="Shooting Wish", ru="Падающее желание", rarity="Rare", stars=300,
     silhouette="Диагональная звезда с расширяющимся хвостом-кометой; на конце хвоста — сердце.",
     concept="Ты — моё желание. Подарок «загадай желание, пока мы вместе».",
     obj="Пятилучевая crystal-звезда с хвостом из particle-кристаллов; на хвосте — мини-сердце; снизу — тонкий gold-след.",
     materials="Crystal · gold trail · holographic particles",
     palette="champagne #E6CC98 · icy blue #BFE4FF · soft pink #FFC2DD",
     anim="Loop 3 с. Звезда пересекает кадр по диагонали и «возвращается» по кругу (seamless), частицы хвоста растворяются в искры.",
     emotion="Надежда, романтика.",
     why="Когда хочется сказать «ты — моё желание».",
     card_ru="Ты — мое самое яркое желание.", card_en="You’re my brightest wish.",
     season="New Year: Midnight Comet. Summer: Perseids Night. Valentine: Rosé Comet.")

gift(id="23", en="Mirror Match", ru="Зеркальный матч", rarity="Rare", stars=320,
     silhouette="Овальное ручное зеркало на тонкой ручке; внутри — два совпадающих сердца.",
     concept="«Мы так похожи.» Зеркало, в котором отражается тот, кто тебя понимает.",
     obj="Ручное зеркало с gold-рамой, в «стекле» — два сердца, одно — реальное, второе — отражение.",
     materials="Polished chrome mirror · gold frame · crystal handle",
     palette="chrome silver · champagne #E6CC98 · lavender #C9B8FF",
     anim="Loop 3 с. Зеркало качается, отражение сердца догоняет оригинал и сливается в одно (flip), по зеркалу проходит блик.",
     emotion="Узнавание, совпадение.",
     why="«Мы удивительно похожи».",
     card_ru="Два отражения — один вайб.", card_en="Two reflections. One vibe.",
     season="Winter: Ice Mirror. Valentine: Rosé Mirror. Halloween: Midnight Glass.")

gift(id="24", en="Promise Ring", ru="Кольцо-обещание", rarity="Rare", stars=350,
     silhouette="Тонкое кольцо в 3/4 с парящим кристаллом-сердцем над ним (как на пьедестале).",
     concept="Не помолвка, а обещание: «я серьёзно».",
     obj="Тонкое gold-кольцо, над которым парит crystal-сердце (без касания), на ободке — тонкая гравировка.",
     materials="Polished gold · crystal heart · diamond-like facets",
     palette="champagne #E6CC98 · pearl #F7F3FF · lavender #C9B8FF",
     anim="Loop 3 с. Сердце левитирует и медленно вращается над кольцом, кольцо «дышит», по ободку бежит блик.",
     emotion="Серьёзность, надёжность.",
     why="Для сильного «я выбрал(а) тебя».",
     card_ru="Обещание, которое светится.", card_en="A promise that glows.",
     season="Valentine: Rosé Promise. Anniversary: Date Engraved. New Year: Midnight Promise.")

gift(id="25", en="Spark", ru="Искра", rarity="Rare", stars=330,
     silhouette="Компактная зажигалка-сердце с откидной крышкой и пламенем в форме капли-сердца.",
     concept="Химия. Искра, с которой начинается всё.",
     obj="Зажигалка в форме сердца из polished chrome + crystal, пламя — мягкий светящийся «светлячок» (без символики курения).",
     materials="Polished chrome · crystal · soft emissive flame",
     palette="chrome silver · soft pink #FFC2DD · champagne #E6CC98",
     anim="Loop 3 с. Крышка откидывается, пламя вспыхивает и рождает искры-сердечки, затем гаснет и крышка закрывается (seamless).",
     emotion="Химия, влечение.",
     why="«Между нами что-то вспыхнуло».",
     card_ru="Между нами — искра.", card_en="There’s a spark between us.",
     season="Valentine: Ruby Spark. Winter: Ice Flame. Halloween: Midnight Flame.")

# ───────────────────────── EPIC (4) ─────────────────────────
gift(id="08", en="Star Sign", ru="Знак судьбы", rarity="Epic", stars=600,
     silhouette="Миниатюрная планета в двойных кольцах, из кольцевых плоскостей — «звёздное» сердце.",
     concept="Звёзды сходятся не случайно. Астрологический объект, ощущаемый как артефакт.",
     obj="Сфера-планета из crystal с сердцем внутри; вокруг вращаются 2 кольца разной толщины; рядом — созвездие.",
     materials="Crystal · gold rings · holographic stars",
     palette="lavender #C9B8FF · electric violet #7B5CFF · champagne #E6CC98",
     anim="Loop 3 с. Кольца вращаются в противоположные стороны, сердце пульсирует, на кольцах проявляются микро-созвездия.",
     emotion="Судьба, космическое совпадение.",
     why="Подарок для «мы сошлись по звёздам».",
     card_ru="Звёзды сошлись. Мы тоже.", card_en="The stars aligned. So did we.",
     season="Winter: Aurora Sign. Summer: Zenith Sign. New Year: Midnight Sign.")

gift(id="26", en="Found You", ru="Нашёл(а) тебя", rarity="Epic", stars=700,
     silhouette="Спутник с двумя панелями-крыльями и антенной, из которой выходят кольцевые сигналы-сердца.",
     concept="Спутник, нашедший сигнал среди миллионов. Real connections, found.",
     obj="Спутник из chrome + crystal с раскрывающимися солнечными панелями, тонкая gold-антенна, сигналы идут кольцами.",
     materials="Polished chrome · crystal panels · gold antenna",
     palette="icy blue #BFE4FF · chrome silver · champagne #E6CC98 · soft pink #FFC2DD",
     anim="Loop 3 с. Панели разворачиваются (unfold), антенна поворачивается, сигнальные кольца расходятся и превращаются в сердца; орбитальное покачивание.",
     emotion="Находка, «наконец-то нашёл(ла) тебя».",
     why="Для эпичного «я искал(а) именно тебя».",
     card_ru="Из миллионов сигналов — твой.", card_en="Out of millions of signals — yours.",
     season="Winter: Frost Station. Summer: Solar Edition. Valentine: Rosé Signal.")

gift(id="27", en="Fate Sphere", ru="Шар судьбы", rarity="Epic", stars=750,
     silhouette="Идеальная сфера на золотой подставке-кольце; внутри — две световые частицы, движущиеся навстречу.",
     concept="Два света внутри шара, которые обязательно встретятся.",
     obj="Crystal orb на gold-подставке; внутри — туман lavender, две светящиеся частицы, которые сближаются и сливаются.",
     materials="Optical crystal · gold base · volumetric light",
     palette="lavender #C9B8FF · soft pink #FFC2DD · champagne #E6CC98 · mint #BFF3E0",
     anim="Loop 3 с. Две частицы по спирали сближаются, сливаются в сердце-вспышку, расходятся; туман внутри переливается; на сфере живой блик.",
     emotion="Предназначение, предвкушение.",
     why="Для «мы просто обязаны были встретиться».",
     card_ru="Двум светам суждено встретиться.", card_en="Two lights, meant to meet.",
     season="Winter: Snow Globe Edition. New Year: Midnight Orb. Spring: Bloom Orb.")

gift(id="28", en="Cheers to Us", ru="За нас", rarity="Epic", stars=850,
     silhouette="Тонкий бокал-флюте, чуть наклонённый, с цепочкой пузырьков, образующих сердце.",
     concept="Первый тост за «мы». Игристое без алкоголя как темы — сияющая жидкость.",
     obj="Бокал из crystal с игристым lavender→champagne градиентом; пузырьки поднимаются и складываются в сердце; на ободке — искра.",
     materials="Optical crystal · liquid gold-pearl · gold-rimmed",
     palette="champagne #E6CC98 · pearl #F7F3FF · lavender #C9B8FF",
     anim="Loop 3 с. Бокал покачивается, пузырьки поднимаются спиралью и на поверхности рождают сердце, искры по ободку.",
     emotion="Праздник, радость.",
     why="Для особого момента — первого свидания, годовщины, победы.",
     card_ru="Первый тост — за нас.", card_en="The first toast is to us.",
     season="New Year: Midnight Toast. Valentine: Rosé Toast. Summer: Sunset Spritz (безалкогольный).")

# ───────────────────────── LEGENDARY (2) ─────────────────────────
gift(id="29", en="Match Moment", ru="Момент матча", rarity="Legendary", stars=2000,
     silhouette="Вертикальный смартфон-монолит из crystal, парящий под углом; на экране — два света, сливающиеся в сердце.",
     concept="Символ самого Vibe: момент, когда двое увидели друг друга. Это не «телефон» — это артефакт.",
     obj="Смартфон-скульптура из цельного crystal и deep-black glass, без UI и бренда; на «экране» — два шара света, движущиеся навстречу и вспыхивающие.",
     materials="Optical crystal · deep-black glass · gold edge · volumetric screen light",
     palette="deep black #0B0A12 · electric violet #7B5CFF · soft pink #FFC2DD · champagne #E6CC98",
     anim="Loop 5 с. Телефон левитирует, два света сходятся → вспышка → кольцо света расходится по граням, мини-сердца взлетают; «подсветка» грани переливается holographic.",
     emotion="Трепет «это взаимно».",
     why="Подарок-символ. Для самых важных людей и ключевых моментов.",
     card_ru="Тот самый момент, когда это взаимно.", card_en="That exact moment it becomes mutual.",
     season="Valentine: Rosé Match (rose-gold + ruby light). New Year: Midnight Match. Anniversary: Date-Engraved Match.")

gift(id="30", en="True North", ru="Мой север", rarity="Legendary", stars=2500,
     silhouette="Круглый компас на золотом кольце с игольчатой стрелкой, замкнутой в сердце.",
     concept="«Real connections only»: ориентир, который ведёт к тому, что настоящее. Стрелка всегда указывает на тебя.",
     obj="Компас из crystal + deep-black dial + brushed gold; стрелка — тонкая gold с маленьким сердцем-острием; по циферблату — созвездия.",
     materials="Optical crystal · brushed gold · deep-black dial · holographic constellations",
     palette="champagne #E6CC98 · deep black #0B0A12 · lavender #C9B8FF · soft pink #FFC2DD",
     anim="Loop 5 с. Стрелка колеблется и находит север (damped spring), загорается сердце, по циферблату разбегаются созвездия, корпус слегка вращается.",
     emotion="Ориентир, «ты — мой север».",
     why="Подарок-клятва. Для самого настоящего.",
     card_ru="Все пути ведут к тебе.", card_en="All paths lead to you.",
     season="Winter: Polar Edition. Valentine: Rosé North. New Year: Midnight North.")

assert len(G) == 30
from collections import Counter
c = Counter(g["rarity"] for g in G)
assert c == {"Common": 10, "Uncommon": 8, "Rare": 6, "Epic": 4, "Legendary": 2}, c
assert sorted(g["id"] for g in G) == [f"{i:02d}" for i in range(1, 31)]
