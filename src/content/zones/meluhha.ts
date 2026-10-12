import type { Zone } from '../types';

/**
 * Chapter 2 — Sumer & Dilmun, reached across the sea from the Indus coast.
 *
 * This zone exists for one reason: contrast. Mesopotamia and the Indus were
 * contemporaries and trading partners, but Mesopotamia left a readable archive
 * and the Indus did not. Playing the same matching mini-game in both zones —
 * once with real translations, once with honest "we cannot read this" — teaches
 * what decipherment actually requires.
 */
export const meluhha: Zone = {
  id: 'meluhha',
  name: 'Sumer & Dilmun',
  nameLocal: 'सुमेर · दिलमुन',
  era: 'c. 3200–1750 BCE',
  eraStart: -3200,
  eraEnd: -1750,
  chapter: 2,
  tagline: 'Across the Gulf: the neighbours who wrote everything down.',
  blurb:
    'Mud-brick terraces climbing to a ziggurat, courtyards full of clay tablets, and a harbour where Indus carnelian is traded for Sumerian silver. Mesopotamian scribes called a far eastern land Meluhha — most scholars think they meant the Indus.',
  center: [-1320, 170],
  radius: 250,
  plateau: 14,
  island: true,
  biome: 'mesopotamianDelta',
  raga: 'bhairav',
  tonic: 46,
  sealRequires: 2,
  palette: {
    ground: 0xd3b579,
    rock: 0xc2a271,
    foliage: 0x8f9a52,
    stone: 0xc29a62,
    horizon: 0xffcf92,
    zenith: 0x6b8cc0,
    fog: 0xe6c99a,
    sun: 0xfff0c0,
    sunElevation: 34,
    sunAzimuth: 140,
  },

  landmarks: [
    {
      id: 'meluhha-ziggurat',
      name: 'The Great Ziggurat',
      kind: 'ziggurat',
      offset: [0, -20],
      codexId: 'ziggurat-ur',
      scanSeconds: 3.5,
      signposted: true,
      opts: { tiers: 3, base: 62, height: 40 },
    },
    {
      id: 'meluhha-scribes',
      name: 'The Tablet House (Edubba)',
      kind: 'scribeYard',
      offset: [-62, 46],
      codexId: 'cuneiform',
      scanSeconds: 3,
      signposted: true,
    },
    {
      id: 'meluhha-gate',
      name: 'The City Gate of Ur',
      kind: 'cityGate',
      offset: [0, 82],
      rotation: 0,
      codexId: 'mesopotamian-law',
      scanSeconds: 2.5,
      signposted: true,
      opts: { width: 36, height: 16, mud: 1 },
    },
    {
      id: 'meluhha-harbour',
      name: 'The Gulf Harbour',
      kind: 'harbour',
      offset: [120, 150],
      rotation: -20,
      codexId: 'meluhha-trade',
      scanSeconds: 3,
      signposted: true,
    },
    {
      id: 'meluhha-dhow',
      name: 'A Dilmun Trader',
      kind: 'dhow',
      offset: [150, 172],
      rotation: 40,
    },
    {
      id: 'meluhha-village',
      name: 'Reed Houses of the Marsh',
      kind: 'villageCluster',
      offset: [-130, 110],
      opts: { count: 9, reed: 1 },
      codexId: 'mesopotamia-rivers',
      scanSeconds: 2.5,
    },
    { id: 'meluhha-pad', name: 'Landing Terrace', kind: 'vimanaPad', offset: [70, -90] },
  ],

  challenges: [
    {
      id: 'meluhha-cuneiform',
      kind: 'scriptMatch',
      name: 'The Scribe’s Examination',
      brief: 'Match each cuneiform sign to its meaning — these ones we really can read.',
      teaches:
        'Cuneiform was deciphered because of trilingual royal inscriptions and long administrative texts; the Indus script has neither.',
      offset: [-58, 52],
      vidya: 140,
      quizAfter: 2,
      prompt: 'Sit the scribe’s examination',
      unlocks: ['cuneiform', 'decipherment'],
      config: {
        note:
          'Each sign below began as a picture pressed into wet clay with a reed stylus, which is why the strokes are wedge-shaped (Latin cuneus = wedge). Decipherment worked because of the Behistun inscription — the same royal text in Old Persian, Elamite and Babylonian — plus tens of thousands of receipts, letters and school exercises. Compare the Indus seals: about five signs each, no bilingual text, no known language.',
        left: [
          { id: 'lugal', glyph: 'LUGAL', caption: 'Originally "big man" — two signs combined' },
          { id: 'an', glyph: 'AN / DINGIR', caption: 'An eight-pointed star shape' },
          { id: 'e2', glyph: 'É', caption: 'A ground plan of a building' },
          { id: 'kur', glyph: 'KUR', caption: 'Three stacked triangles, like peaks' },
          { id: 'a', glyph: 'A', caption: 'Two parallel wavy strokes' },
          { id: 'ninda', glyph: 'NINDA', caption: 'A loaf-shaped wedge' },
        ],
        right: [
          { id: 'lugal', label: 'King' },
          { id: 'an', label: 'Sky, or a god' },
          { id: 'e2', label: 'House or temple' },
          { id: 'kur', label: 'Mountain, or a foreign land' },
          { id: 'a', label: 'Water' },
          { id: 'ninda', label: 'Bread, or food rations' },
        ],
      },
    },
    {
      id: 'meluhha-barter',
      kind: 'trade',
      name: 'The Meluhha Consignment',
      brief: 'Make up a shekel-weight consignment of Indus goods for the Sumerian merchant.',
      teaches: 'Mesopotamia counted in base 60 (60 shekels = 1 mina); the Indus used a binary weight series. Trade meant converting between standards.',
      offset: [112, 134],
      vidya: 130,
      quizAfter: 2,
      prompt: 'Trade with the Sumerian merchant',
      unlocks: ['base-sixty'],
      config: {
        goods: [
          { id: 'carnelian', label: 'Etched carnelian beads', unitMass: 1, glyph: '🔶' },
          { id: 'ivory', label: 'Worked ivory combs', unitMass: 5, glyph: '🦴' },
          { id: 'timber', label: 'Sissoo timber', unitMass: 10, glyph: '🪵' },
          { id: 'lapis', label: 'Lapis lazuli (via Shortugai)', unitMass: 3, glyph: '🔵' },
        ],
        weights: [1, 5, 10, 30, 60],
        target: 60,
        note:
          'Sixty shekels made one mina. Base 60 divides neatly by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30 — convenient before fractions were easy to write. You still use it: 60 seconds, 60 minutes, 360 degrees.',
      },
    },
    {
      id: 'meluhha-sequence',
      kind: 'sequence',
      name: 'How Writing Began',
      brief: 'Put the stages of early writing in order.',
      teaches: 'Writing evolved from accounting tokens to pictures to phonetic signs — it was invented to count, not to tell stories.',
      offset: [-40, 20],
      vidya: 120,
      quizAfter: 1,
      prompt: 'Study the tablet sequence',
      unlocks: ['writing-origins'],
      config: {
        note:
          'The earliest tablets from Uruk are almost entirely administrative: quantities of barley, beer, sheep and labour. Literature came much later. The same is true of Linear B in Greece and of early Egyptian records.',
        items: [
          { id: 'tokens', label: 'Clay tokens in sealed envelopes', when: 'c. 4000 BCE', detail: 'Small shaped tokens stood for commodities and were sealed inside clay balls as a tamper-proof record.' },
          { id: 'pictograph', label: 'Pictographic tablets at Uruk', when: 'c. 3200 BCE', detail: 'Pictures of a jar, a head, a sheaf — plus number signs. Readable as accounts, not as sentences.' },
          { id: 'wedge', label: 'Wedge-shaped (cuneiform) strokes', when: 'c. 2900 BCE', detail: 'A reed stylus pressed rather than drawn: faster, and it does not tear wet clay.' },
          { id: 'phonetic', label: 'Signs used for sounds, not just things', when: 'c. 2600 BCE', detail: 'Rebus writing lets scribes spell names and grammar. Now you can write a sentence.' },
          { id: 'literature', label: 'Literary texts — hymns, then the Gilgamesh cycle', when: 'c. 2100 BCE onward', detail: 'Sumerian poems about Gilgamesh are copied in schools; the long Akkadian epic is later still.' },
        ],
      },
    },
  ],

  npcs: [
    {
      id: 'meluhha-scribe',
      name: 'Nin-shubur',
      role: 'Junior scribe of the Edubba',
      icon: '📜',
      offset: [-50, 60],
      color: 0xd8c188,
      lines: [
        'I have copied the sign for barley nine hundred times. My teacher says nine hundred more.',
        'Clay is patient. Dry it, and the receipt outlives the merchant, the king and the city.',
        'They bring seals from Meluhha. Pretty animals. Nobody here can read the signs either.',
      ],
      unlocks: 'cuneiform',
    },
    {
      id: 'meluhha-merchant',
      name: 'Ea-nasir',
      role: 'Copper merchant of Ur',
      icon: '🪙',
      offset: [104, 128],
      color: 0xbf8f55,
      lines: [
        'Copper from Magan, beads from Meluhha, silver from the north. I take my cut from all three.',
        'A customer once wrote me a tablet of complaints about my copper. People still talk about it.',
        'Sixty shekels to the mina. Learn it or be cheated.',
      ],
    },
  ],
};
