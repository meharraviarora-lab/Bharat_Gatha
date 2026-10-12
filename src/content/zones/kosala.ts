import type { Zone } from '../types';

/**
 * Chapter 3 — Kosala and the Dandaka forest (the Ramayana).
 *
 * Treated as literature and living culture, not as a dig site. The headline
 * lesson is that there is no single Ramayana: the story has been retold for two
 * thousand years in dozens of languages across South and Southeast Asia, and
 * the retellings disagree with each other on purpose.
 */
export const kosala: Zone = {
  id: 'kosala',
  name: 'Kosala & Dandaka',
  nameLocal: 'कोसल · दण्डक',
  era: 'Epic tradition · text c. 500 BCE – 300 CE',
  eraStart: -500,
  eraEnd: 300,
  chapter: 3,
  tagline: 'One story, three hundred tellings, half a continent.',
  blurb:
    'The city of Ayodhya on the Sarayu, and beyond it the forest where the story really happens. Valmiki’s Sanskrit poem runs to seven books; Tulsidas, Kamban, the Thai Ramakien and the Javanese Kakawin each tell it differently — and each is loved by someone.',
  center: [330, -690],
  radius: 320,
  plateau: 26,
  biome: 'sal_forest',
  raga: 'bhupali',
  tonic: 50,
  sealRequires: 3,
  palette: {
    ground: 0x77883f,
    rock: 0x9a8a63,
    foliage: 0x3f6b2e,
    stone: 0xd9c38a,
    horizon: 0xffd9a6,
    zenith: 0x4f84c4,
    fog: 0xc8d6a8,
    sun: 0xfff2c8,
    sunElevation: 42,
    sunAzimuth: 70,
  },

  landmarks: [
    {
      id: 'kosala-ayodhya',
      name: 'Ayodhya on the Sarayu',
      kind: 'palaceCity',
      offset: [0, -50],
      codexId: 'ramayana-overview',
      scanSeconds: 3.5,
      signposted: true,
      opts: { wings: 3, towerHeight: 34, courtWidth: 90 },
    },
    {
      id: 'kosala-gate',
      name: 'The Northern Gate',
      kind: 'cityGate',
      offset: [0, 24],
      codexId: 'ramayana-kandas',
      scanSeconds: 2.5,
      signposted: true,
      opts: { width: 34, height: 20 },
    },
    {
      id: 'kosala-temple',
      name: 'Shrine of the Sarayu Ghat',
      kind: 'nagaraTemple',
      offset: [-86, -14],
      rotation: 20,
      codexId: 'nagara-style',
      scanSeconds: 3,
      signposted: true,
      opts: { shikharaHeight: 26 },
    },
    {
      id: 'kosala-ashram',
      name: 'Valmiki’s Ashram',
      kind: 'hermitage',
      offset: [140, 110],
      codexId: 'valmiki',
      scanSeconds: 3,
      signposted: true,
      opts: { huts: 5 },
    },
    {
      id: 'kosala-panchavati',
      name: 'Panchavati Clearing',
      kind: 'hermitage',
      offset: [-120, 150],
      rotation: 35,
      opts: { huts: 2, open: 1 },
      codexId: 'forest-exile',
      scanSeconds: 2.5,
      signposted: true,
    },
    {
      id: 'kosala-village',
      name: 'Shabari’s Settlement',
      kind: 'villageCluster',
      offset: [60, 176],
      opts: { count: 7 },
      codexId: 'shabari',
      scanSeconds: 2.5,
      signposted: true,
    },
    {
      id: 'kosala-stepwell',
      name: 'The Sarayu Ghat Steps',
      kind: 'stepwell',
      offset: [-40, 70],
      rotation: 10,
    },
    { id: 'kosala-pad', name: 'Landing Terrace', kind: 'vimanaPad', offset: [90, -150] },
  ],

  challenges: [
    {
      id: 'kosala-archery',
      kind: 'archery',
      name: 'The Ashram Archery Ground',
      brief: 'Score 70 or more with eight arrows. Small rings are worth more.',
      teaches:
        'Archery in the epics is a disciplined craft with named bows, stances and schools — Rama trains under Vishvamitra before he is a hero.',
      offset: [128, 86],
      vidya: 130,
      quizAfter: 2,
      prompt: 'Take up the bow',
      unlocks: ['epic-archery'],
      config: {
        arrows: 8,
        passScore: 70,
        targets: [
          { pos: [-8, 3.2, -22], radius: 2.4, points: 5, label: 'Outer straw butt' },
          { pos: [0, 3.6, -26], radius: 1.6, points: 10, label: 'Centre butt' },
          { pos: [8, 3.2, -22], radius: 2.4, points: 5, label: 'Outer straw butt' },
          { pos: [-5, 6.4, -34], radius: 1.1, points: 15, label: 'High ring' },
          { pos: [6, 6.8, -36], radius: 0.9, points: 20, label: 'Far ring' },
          { pos: [0, 9.2, -40], radius: 0.7, points: 25, label: 'The bird’s eye', moving: true },
        ],
      },
    },
    {
      id: 'kosala-herbs',
      kind: 'collect',
      name: 'The Forest Pharmacy',
      brief: 'Gather the four genuine medicinal plants. Leave the look-alikes alone.',
      teaches:
        'Indian medical texts (Charaka and Sushruta Samhitas) catalogue hundreds of plants; identification is the first skill a healer learns.',
      offset: [-100, 132],
      vidya: 150,
      quizAfter: 2,
      prompt: 'Begin the herb walk',
      unlocks: ['ayurveda-plants'],
      config: {
        need: 4,
        note:
          'Each of the four real plants below is named in classical Indian medical literature and is still in use. The decoys are plants that look similar but are inert or toxic — which is exactly why classical texts spend so many verses on identification.',
        items: [
          { id: 'tulsi', label: 'Tulsi (holy basil)', pos: [-14, 0, -8], glyph: '🌿' },
          { id: 'ashwagandha', label: 'Ashwagandha root', pos: [12, 0, -18], glyph: '🪴' },
          { id: 'neem', label: 'Neem leaf', pos: [22, 0, 10], glyph: '🍃' },
          { id: 'haridra', label: 'Haridra (turmeric) rhizome', pos: [-20, 0, 16], glyph: '🟡' },
          { id: 'decoy1', label: 'Oleander (kaner) — toxic', pos: [4, 0, 22], glyph: '🌺', decoy: true },
          { id: 'decoy2', label: 'Datura — dangerous in untrained hands', pos: [-28, 0, -20], glyph: '🤍', decoy: true },
          { id: 'decoy3', label: 'Ornamental basil — no medical use', pos: [28, 0, -4], glyph: '🌱', decoy: true },
        ],
      },
    },
    {
      id: 'kosala-sequence',
      kind: 'sequence',
      name: 'The Seven Books',
      brief: 'Put the seven kandas of Valmiki’s Ramayana in order.',
      teaches: 'The Ramayana’s structure: seven kandas, with the first and last generally regarded as later additions.',
      offset: [20, 34],
      vidya: 120,
      quizAfter: 2,
      prompt: 'Read the manuscript leaves',
      unlocks: ['ramayana-kandas'],
      config: {
        note:
          'Most Sanskritists consider Bala Kanda and Uttara Kanda to be later additions to a core of five books. That is normal for epic literature — it grew by accretion over centuries, like a city grows by layers.',
        items: [
          { id: 'bala', label: 'Bala Kanda', when: 'Book 1', detail: 'Childhood and training; the breaking of the bow at Mithila; marriage to Sita. Widely held to be a later addition.' },
          { id: 'ayodhya', label: 'Ayodhya Kanda', when: 'Book 2', detail: 'Kaikeyi’s boons, Dasharatha’s promise, and the exile. The most intensely human book.' },
          { id: 'aranya', label: 'Aranya Kanda', when: 'Book 3', detail: 'The forest years, Jatayu, and Sita’s abduction.' },
          { id: 'kishkindha', label: 'Kishkindha Kanda', when: 'Book 4', detail: 'Alliance with Sugriva and Hanuman; Vali’s death.' },
          { id: 'sundara', label: 'Sundara Kanda', when: 'Book 5', detail: 'Hanuman’s leap to Lanka and his meeting with Sita. Recited on its own in many households.' },
          { id: 'yuddha', label: 'Yuddha Kanda', when: 'Book 6', detail: 'The war, Ravana’s defeat, and the return to Ayodhya.' },
          { id: 'uttara', label: 'Uttara Kanda', when: 'Book 7', detail: 'Later events including Sita’s second ordeal and Lava and Kusha. Also generally regarded as a later addition.' },
        ],
      },
    },
    {
      id: 'kosala-manyramayanas',
      kind: 'dialogue',
      name: 'Three Hundred Ramayanas',
      brief: 'Ask the bard which version is the true one.',
      teaches:
        'The Ramayana is a tradition of retellings across many languages and countries; disagreement between versions is a feature, not an error.',
      offset: [132, 100],
      vidya: 140,
      quizAfter: 2,
      prompt: 'Speak with the bard',
      unlocks: ['many-ramayanas', 'ramayana-abroad'],
      config: {
        speaker: { name: 'Kavi Sumant', role: 'Travelling bard', icon: '🪕' },
        nodes: [
          {
            id: 'start',
            text:
              'You want the true Ramayana? Careful what you ask a bard. I have sung it in Awadhi for farmers, heard it chanted in Tamil at a temple, and watched it danced in masks on an island where nobody speaks a word of Sanskrit. Which of those was false?',
            choices: [
              { label: 'Surely Valmiki’s Sanskrit version is the original.', goto: 'valmiki' },
              { label: 'Tell me about the ones outside India.', goto: 'abroad' },
              { label: 'Do the versions actually disagree?', goto: 'disagree' },
            ],
          },
          {
            id: 'valmiki',
            text:
              'It is the oldest we have, yes — seven kandas, some twenty-four thousand verses, composed and reshaped over centuries. But "oldest surviving" is not the same as "the one everyone means". When a child in Varanasi says Ramayana she usually means Tulsidas’s Ramcharitmanas, written in Awadhi in the sixteenth century, and she is not making a mistake.',
            choices: [
              { label: 'So different communities hold different versions as central.', reply: 'Now you are listening like a scholar.', goto: 'disagree', wise: true, note: 'Literary traditions have many centres, not one.' },
              { label: 'Name a few of those retellings.', goto: 'retellings' },
            ],
          },
          {
            id: 'retellings',
            text:
              'Kamban’s Ramavataram in Tamil, around the twelfth century. Molla’s Telugu Ramayanam, by a potter’s daughter. Krittibas in Bengali. Ezhuthachan in Malayalam. Madhava Kandali in Assamese. Sant Eknath in Marathi. The Jain Paumacariya, which makes Ravana a tragic, dignified figure. Each poet chose what to expand and what to leave out.',
            goto: 'abroad',
            next: 'abroad',
          },
          {
            id: 'abroad',
            text:
              'Thailand sings the Ramakien and paints it along the walls of the royal temple in Bangkok. Java has the Kakawin Ramayana in Old Javanese and a shadow-puppet tradition that runs all night. Cambodia has the Reamker, Laos the Phra Lak Phra Lam, Malaysia the Hikayat Seri Rama, Myanmar the Yama Zatdaw. The story crossed the Bay of Bengal with traders and monks, long before passports.',
            choices: [
              { label: 'That makes it a shared Asian inheritance.', reply: 'It does. And every place made it their own.', goto: 'disagree', wise: true, note: 'Cultural exchange, not export.' },
              { label: 'How differently do they end?', goto: 'disagree' },
            ],
          },
          {
            id: 'disagree',
            text:
              'Sharply. In some tellings Ravana is a learned king brought down by one fatal flaw; in the Jain version he is almost noble. Some retellings centre Sita’s suffering and judge Rama for it. Some end at the return to Ayodhya and refuse to tell the Uttara Kanda at all. The scholar A. K. Ramanujan wrote a famous essay about this and called them many Ramayanas. The right question is never "which is true", but "what is this particular telling trying to say?"',
            end: true,
            vidya: 70,
            unlocks: ['many-ramayanas'],
          },
        ],
      },
    },
  ],

  npcs: [
    {
      id: 'kosala-potter',
      name: 'Revati',
      role: 'Potter of Ayodhya',
      icon: '🏺',
      offset: [-30, 10],
      color: 0xb9794f,
      lines: [
        'Fourteen years the city kept its lamps lit, they say. My grandmother’s grandmother made those lamps.',
        'A city is not its palace. A city is its potters, its weavers and its drains.',
        'Diwali? We have lit lamps for the returning for as long as anyone remembers.',
      ],
    },
    {
      id: 'kosala-forester',
      name: 'Guha',
      role: 'Boatman of the Sarayu',
      icon: '🛶',
      offset: [-52, 56],
      color: 0x6f8f55,
      lines: [
        'I ferried a prince across this river once. He paid me nothing and I asked for nothing.',
        'The forest is not empty. It is full of people the city forgets to count.',
        'Follow the birds to water. They know the fords better than the maps.',
      ],
      unlocks: 'forest-exile',
    },
  ],
};
