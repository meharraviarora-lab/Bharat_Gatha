import type { Zone } from '../types';

/**
 * Chapter 10 — Agra and Fatehpur Sikri.
 *
 * Two lessons. First, that the Taj is an engineering document as much as a love
 * story: a double dome, a deliberately broken symmetry, outward-leaning
 * minarets, calligraphy whose letters grow with height. Second, Akbar's
 * Ibadat Khana — a Mughal emperor convening argument between faiths and writing
 * sulh-i-kul, universal civility, into state policy.
 */
export const agra: Zone = {
  id: 'agra',
  name: 'Agra & Sikri',
  nameLocal: 'आगरा · फ़तेहपुर सीकरी',
  era: '1526–1707 CE',
  eraStart: 1526,
  eraEnd: 1707,
  chapter: 10,
  tagline: 'Marble geometry, a garden laid out as paradise, and an emperor who held debates.',
  blurb:
    'The Taj Mahal is a double-shelled dome over a plinth, set in a four-part garden, with calligraphy sized to look even from the ground. Fifty kilometres away Akbar built a whole city and left it — but not before convening scholars of several faiths to argue in front of him.',
  center: [170, -250],
  radius: 300,
  plateau: 28,
  biome: 'riverPlain',
  raga: 'yaman',
  tonic: 53,
  sealRequires: 3,
  palette: {
    ground: 0x8e9a58,
    rock: 0xa4927a,
    foliage: 0x44703a,
    stone: 0xeae3d4,
    horizon: 0xffc89a,
    zenith: 0x4a74b8,
    fog: 0xd9d2bc,
    sun: 0xfff0d2,
    sunElevation: 26,
    sunAzimuth: 286,
  },

  landmarks: [
    {
      id: 'agra-taj',
      name: 'The Taj Mahal',
      kind: 'mughalTomb',
      offset: [0, -60],
      codexId: 'taj-mahal',
      scanSeconds: 5,
      signposted: true,
      opts: { domeRadius: 17, minarets: 4, plinth: 96, iwan: 1 },
    },
    {
      id: 'agra-charbagh',
      name: 'The Charbagh',
      kind: 'charbagh',
      offset: [0, 30],
      codexId: 'charbagh',
      scanSeconds: 3,
      signposted: true,
      opts: { size: 180, channels: 1 },
    },
    {
      id: 'agra-gate',
      name: 'The Great Gate (Darwaza-i Rauza)',
      kind: 'cityGate',
      offset: [0, 126],
      codexId: 'mughal-architecture',
      scanSeconds: 3,
      signposted: true,
      opts: { width: 42, height: 30, redSandstone: 1, iwan: 1 },
    },
    {
      id: 'agra-sikri',
      name: 'Fatehpur Sikri',
      kind: 'palaceCity',
      offset: [-170, 70],
      rotation: 14,
      codexId: 'fatehpur-sikri',
      scanSeconds: 4,
      signposted: true,
      opts: { wings: 5, towerHeight: 28, courtWidth: 110, pillared: 1, redSandstone: 1, panchMahal: 1 },
    },
    {
      id: 'agra-stepwell',
      name: 'The Baoli',
      kind: 'stepwell',
      offset: [-100, 150],
      opts: { stepped: 1 },
      codexId: 'stepwells',
      scanSeconds: 3,
      signposted: true,
    },
    {
      id: 'agra-bazaar',
      name: 'The Taj Ganj Workmen’s Bazaar',
      kind: 'bazaarStreet',
      offset: [110, 100],
      rotation: 90,
      opts: { stalls: 14, length: 120 },
      codexId: 'taj-workforce',
      scanSeconds: 3,
      signposted: true,
    },
    {
      id: 'agra-village',
      name: 'The Makrana Marble Yard',
      kind: 'villageCluster',
      offset: [-120, -120],
      opts: { count: 7, workshop: 1 },
      codexId: 'pietra-dura',
      scanSeconds: 2.5,
    },
    { id: 'agra-pad', name: 'Landing Terrace', kind: 'vimanaPad', offset: [150, -150] },
  ],

  challenges: [
    {
      id: 'agra-pietradura',
      kind: 'pattern',
      name: 'The Inlay Workshop',
      brief: 'Complete the parchin kari panel. Four-fold symmetry — every quadrant must agree.',
      teaches:
        'Pietra dura (parchin kari): semi-precious stones cut and fitted into marble so tightly the joints are invisible. The geometry is fourfold, and so the craftsman only designs a quarter.',
      offset: [-112, -110],
      vidya: 170,
      quizAfter: 2,
      prompt: 'Work at the inlay bench',
      unlocks: ['pietra-dura', 'taj-mahal'],
      config: {
        gridSize: 8,
        symmetry: 'fourfold',
        palette: [0xeae3d4, 0xb5422f, 0x2f5ea8, 0x2e7a52, 0xe0b23c],
        given: [
          [0, 0, 0],
          [1, 0, 1],
          [2, 1, 2],
          [1, 2, 3],
          [0, 3, 4],
          [3, 1, 1],
          [2, 3, 2],
        ],
        hint:
          'Carnelian red, lapis blue, jade green, jasper yellow, on Makrana white. Design one quadrant and the other three follow — that is how the real workshops did it.',
      },
    },
    {
      id: 'agra-dome',
      kind: 'assembly',
      name: 'Raise the Mausoleum',
      brief: 'Build the tomb in structural order. The dome you see is not the dome you stand under.',
      teaches:
        'The double dome: an inner shell sized for the interior and an outer shell sized for the skyline, with a void between. It lets a building look tall outside and feel proportionate inside.',
      offset: [-10, -46],
      vidya: 190,
      quizAfter: 3,
      prompt: 'Direct the works',
      unlocks: ['taj-mahal', 'double-dome'],
      config: {
        ordered: true,
        hint: 'Foundations, then mass, then the two shells, then the ornament.',
        pieces: [
          { id: 'wells', label: 'Timber-and-rubble well foundations', size: [6, 1, 6], color: 0x6a5d4c },
          { id: 'plinth', label: 'The raised marble plinth', size: [7, 1.4, 7], color: 0xded6c4 },
          { id: 'cube', label: 'The chamfered cube with four iwans', size: [5, 3.4, 5], color: 0xeae3d4 },
          { id: 'drum', label: 'The cylindrical drum', size: [3.4, 1.8, 3.4], color: 0xe4ddcb },
          { id: 'inner', label: 'Inner dome shell', size: [2.8, 1.6, 2.8], color: 0xcfc7b4 },
          { id: 'outer', label: 'Outer onion dome shell', size: [3.6, 3.2, 3.6], color: 0xf2ece0 },
          { id: 'finial', label: 'The brass finial', size: [0.5, 2.2, 0.5], color: 0xc9a23c },
        ],
        sockets: [
          { id: 'd1', label: '1 · Foundations', pos: [-14, 0.5, 0], accepts: 'wells' },
          { id: 'd2', label: '2 · Plinth', pos: [-9.5, 0.7, 0], accepts: 'plinth' },
          { id: 'd3', label: '3 · Tomb chamber', pos: [-5, 1.7, 0], accepts: 'cube' },
          { id: 'd4', label: '4 · Drum', pos: [0, 0.9, 0], accepts: 'drum' },
          { id: 'd5', label: '5 · Inner shell', pos: [4.5, 0.8, 0], accepts: 'inner' },
          { id: 'd6', label: '6 · Outer shell', pos: [9, 1.6, 0], accepts: 'outer' },
          { id: 'd7', label: '7 · Finial', pos: [13.5, 1.1, 0], accepts: 'finial' },
        ],
      },
    },
    {
      id: 'agra-ibadatkhana',
      kind: 'dialogue',
      name: 'The House of Worship',
      brief: 'Akbar has called scholars of several faiths to argue in front of him. Help him set the rules.',
      teaches:
        'Sulh-i-kul — "peace with all" — as state policy: Akbar’s abolition of the pilgrim tax and jizya, his translation bureau, and the limits of his experiment.',
      offset: [-160, 56],
      vidya: 210,
      quizAfter: 3,
      prompt: 'Enter the Ibadat Khana',
      unlocks: ['akbar-sulh-i-kul', 'mughal-translation'],
      config: {
        speaker: { name: 'Jalaluddin Muhammad Akbar', role: 'Padshah, at Fatehpur Sikri', icon: '🕌' },
        nodes: [
          {
            id: 'start',
            text:
              'Thursday evenings I have them brought in: ulama, Brahmin pandits, Jain munis, Zoroastrian priests, and lately Jesuits from Goa. They argue, and I listen, and they are frequently appalling to one another. I cannot read, as you may know — I have everything read aloud to me. So. How should such a room be governed?',
            choices: [
              { label: 'Let the strongest argument win and adopt that faith.', goto: 'winner' },
              { label: 'Require that each may speak only of his own tradition, never mock another’s.', goto: 'civility', wise: true, note: 'Close to what Akbar actually formulated as sulh-i-kul.' },
              { label: 'Why hold the debates at all, Padshah?', goto: 'why' },
            ],
          },
          {
            id: 'why',
            text:
              'Because I rule a country in which most of my subjects do not share my religion, and I intend to rule it for a long time. That is the practical answer. The other answer is that I am curious, and curiosity in a king is cheaper than war. I have remitted the pilgrimage tax, and the jizya on non-Muslims, and I married into Rajput houses whose princes command my armies.',
            choices: [
              { label: 'So pluralism as statecraft.', reply: 'Statecraft and conviction are not always enemies.', goto: 'civility', wise: true },
              { label: 'Did the ulama object?', goto: 'objection' },
            ],
          },
          {
            id: 'winner',
            text:
              'I tried something near that and it went badly. When a king sits in judgement over doctrine, every scholar begins performing for the throne instead of arguing honestly. And the Mahzar of 1579, which gave me authority to decide between conflicting legal opinions, earned me enemies who have not forgiven me yet. Victory in such a room is worth very little.',
            goto: 'objection',
            next: 'objection',
          },
          {
            id: 'objection',
            text:
              'Loudly. Abdul Qadir Badauni sat in my own court writing a history that calls me a heretic — and I kept him employed, translating the Mahabharata into Persian. That is the Razmnama, and it is one of the things I am proudest of. A library where only one kind of book is allowed is a storeroom, not a library.',
            choices: [
              { label: 'What else did your translators produce?', goto: 'translate' },
              { label: 'Then set the rule for the room.', goto: 'civility' },
            ],
          },
          {
            id: 'translate',
            text:
              'The Ramayana, the Atharva Veda, the Yoga Vasistha, Lilavati for the mathematics, the Panchatantra. Abu’l Fazl has compiled the Ain-i-Akbari — revenue, ranks, customs, crop prices, the whole machinery written down. And the painters have mixed Persian line with Indian colour until the result is neither and both. Basawan, Daswanth, and later Mansur, who paints birds so exactly that naturalists still use him.',
            goto: 'civility',
            next: 'civility',
          },
          {
            id: 'civility',
            text:
              'Then let that be the rule, and let it be called sulh-i-kul — peace with all. Each may expound; none may revile. And let me be honest about the limits, since you seem to want honesty: this is my court’s policy, not a constitution. My great-grandson Aurangzeb will reimpose the jizya. A tolerance that depends on the character of one ruler is only ever on loan. Whatever you build, build it so it does not need a good king.',
            end: true,
            vidya: 130,
            unlocks: ['akbar-sulh-i-kul'],
          },
        ],
      },
    },
    {
      id: 'agra-sequence',
      kind: 'sequence',
      name: 'The Shape of a Dynasty',
      brief: 'Order the Mughal monuments and the reigns that made them.',
      teaches:
        'Mughal architecture evolves visibly: Timurid garden tomb, then Akbar’s red sandstone synthesis, then Shah Jahan’s white marble formalism.',
      offset: [60, 60],
      vidya: 150,
      quizAfter: 3,
      prompt: 'Read the chronicle',
      unlocks: ['mughal-architecture', 'fatehpur-sikri'],
      config: {
        note:
          'You can date a Mughal building almost by its material and its arches. Red sandstone with trabeate brackets and chhatris: Akbar’s period, absorbing Rajput and Gujarati idiom. White marble, pietra dura and cusped arches: Shah Jahan.',
        items: [
          { id: 'panipat', label: 'Babur wins at Panipat', when: '1526', detail: 'Artillery and field tactics against a much larger Lodi army.' },
          { id: 'humayun', label: 'Humayun’s Tomb completed', when: 'c. 1570', detail: 'Commissioned by Empress Bega Begum; the first great garden tomb in India and the Taj’s direct ancestor.' },
          { id: 'sikri', label: 'Fatehpur Sikri built', when: '1571–1585', detail: 'Akbar’s new capital in red sandstone — and abandoned within a generation, water being the usual explanation.' },
          { id: 'ain', label: 'The Ain-i-Akbari compiled', when: 'c. 1590', detail: 'Abu’l Fazl’s administrative gazetteer: ranks, revenue, crops, customs.' },
          { id: 'taj', label: 'The Taj Mahal built', when: '1632–1653', detail: 'For Mumtaz Mahal, who died in 1631. Makrana marble, a double dome, and a charbagh.' },
          { id: 'redfort', label: 'Shahjahanabad and the Red Fort', when: '1639–1648', detail: 'A new capital at Delhi, with the Jama Masjid following shortly after.' },
          { id: 'aurangzeb', label: 'Aurangzeb’s reign', when: '1658–1707', detail: 'The empire reaches its greatest extent and its deepest strain; the jizya is reimposed in 1679.' },
        ],
      },
    },
  ],

  npcs: [
    {
      id: 'agra-calligrapher',
      name: 'Amanat Khan',
      role: 'Calligrapher of the mausoleum',
      icon: '🖋️',
      offset: [-6, -44],
      color: 0xd8cdb6,
      lines: [
        'The letters grow taller as the panel rises. From the ground they read as one even size. That is the trick.',
        'I signed my work. On a building like this, that is either confidence or impertinence.',
        'Thuluth script, inlaid in black marble. Measure twice; you cannot un-cut stone.',
      ],
      unlocks: 'taj-mahal',
    },
    {
      id: 'agra-mason',
      name: 'Puran',
      role: 'Marble cutter from Makrana',
      icon: '🪚',
      offset: [-116, -114],
      color: 0xc9bca4,
      lines: [
        'Twenty thousand of us, they say, over twenty years. The ledgers have some of our names in them.',
        'Makrana marble does not yellow and it glows at dusk. That is why we hauled it four hundred kilometres.',
        'The minarets lean outward a little. Deliberately. If they ever fall, they fall away from the tomb.',
      ],
      unlocks: 'taj-workforce',
    },
  ],
};
