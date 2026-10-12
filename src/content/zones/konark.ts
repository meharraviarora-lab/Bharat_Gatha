import type { Zone } from '../types';

/**
 * Chapter 8 — Konark and the observatory: Indian astronomy and mathematics.
 *
 * The point of this zone is to replace "ancient India knew everything" and
 * "ancient India knew nothing" with something far more interesting: a traceable
 * chain of named people who made specific, checkable claims — some right, some
 * wrong, all argued in writing.
 */
export const konark: Zone = {
  id: 'konark',
  name: 'Konark & the Observatory',
  nameLocal: 'कोणार्क · जन्तर मन्तर',
  era: 'c. 499 CE – 1734 CE',
  eraStart: 499,
  eraEnd: 1734,
  chapter: 8,
  tagline: 'A temple built as a chariot, and instruments that tell the time by shadow.',
  blurb:
    'Konark is a temple shaped like the sun’s chariot — twenty-four stone wheels, seven horses, and wheels that work as sundials. Six centuries later Sawai Jai Singh II built masonry instruments at Jaipur accurate to a couple of seconds.',
  center: [860, 250],
  radius: 300,
  plateau: 20,
  biome: 'coastalDune',
  raga: 'kalyan',
  tonic: 52,
  sealRequires: 3,
  palette: {
    ground: 0xa39b6c,
    rock: 0x8f8470,
    foliage: 0x4b7a3c,
    stone: 0x6f655a,
    horizon: 0xffe0b0,
    zenith: 0x3d74bd,
    fog: 0xd2cfa8,
    sun: 0xfff6d8,
    sunElevation: 62,
    sunAzimuth: 178,
  },

  landmarks: [
    {
      id: 'konark-temple',
      name: 'The Sun Temple',
      kind: 'konarkTemple',
      offset: [0, -50],
      codexId: 'konark-temple',
      scanSeconds: 4.5,
      signposted: true,
      opts: { wheels: 12, horses: 7, jagamohanaHeight: 34 },
    },
    {
      id: 'konark-jantar',
      name: 'Jantar Mantar',
      kind: 'jantarMantar',
      offset: [-120, 90],
      rotation: 0,
      codexId: 'jantar-mantar',
      scanSeconds: 4,
      signposted: true,
      opts: { gnomonHeight: 27 },
    },
    {
      id: 'konark-nagara',
      name: 'The Lingaraja-style Deul',
      kind: 'nagaraTemple',
      offset: [120, 70],
      rotation: 12,
      codexId: 'kalinga-style',
      scanSeconds: 3,
      signposted: true,
      opts: { shikharaHeight: 40, kalinga: 1 },
    },
    {
      id: 'konark-village',
      name: 'The Astronomers’ Quarter',
      kind: 'villageCluster',
      offset: [-40, 170],
      opts: { count: 8 },
      codexId: 'siddhanta-tradition',
      scanSeconds: 2.5,
    },
    {
      id: 'konark-tank',
      name: 'The Observation Tank',
      kind: 'stepwell',
      offset: [60, 130],
      opts: { large: 1 },
    },
    { id: 'konark-pad', name: 'Landing Terrace', kind: 'vimanaPad', offset: [130, -130] },
  ],

  challenges: [
    {
      id: 'konark-wheel',
      kind: 'pattern',
      name: 'The Chariot Wheel Sundial',
      brief: 'Complete the wheel. Eight major spokes, eight minor — the symmetry is the clock.',
      teaches:
        'Konark’s wheels are dials: eight major spokes divide the day into three-hour parts, with minor spokes halving them again. Symmetry is not decoration here; it is calibration.',
      offset: [-16, -36],
      vidya: 170,
      quizAfter: 2,
      prompt: 'Study the wheel',
      unlocks: ['konark-temple', 'shadow-timekeeping'],
      config: {
        gridSize: 9,
        symmetry: 'rotational',
        palette: [0x6f655a, 0xb8a27a, 0xe8b44b, 0x8f8470],
        given: [
          [4, 0, 2],
          [5, 1, 0],
          [6, 2, 1],
          [7, 3, 0],
          [3, 1, 0],
          [2, 2, 1],
        ],
        hint: 'A dial that is not symmetric tells a different time on each side. Rotate what is given around the hub.',
      },
    },
    {
      id: 'konark-instruments',
      kind: 'scriptMatch',
      name: 'What Does This Instrument Measure?',
      brief: 'Match each masonry instrument at Jantar Mantar to the quantity it reads.',
      teaches:
        'Pre-telescopic observational astronomy: each instrument is a purpose-built analogue computer, and bigger means more precise.',
      offset: [-112, 78],
      vidya: 160,
      quizAfter: 3,
      prompt: 'Walk the instruments',
      unlocks: ['jantar-mantar', 'observational-astronomy'],
      config: {
        note:
          'Jai Singh II built five observatories — Delhi, Jaipur, Ujjain, Mathura and Varanasi. He had Euclid and Ptolemy translated, obtained European tables and telescopes, and then built in stone anyway: a 27-metre gnomon resolves a shadow far more finely than a small brass instrument can.',
        left: [
          { id: 'samrat', glyph: 'Samrat Yantra', caption: 'A giant right-triangle gnomon with curved quadrant scales' },
          { id: 'jaiprakash', glyph: 'Jai Prakash Yantra', caption: 'Two complementary hemispherical bowls sunk in the ground' },
          { id: 'ram', glyph: 'Ram Yantra', caption: 'Open cylinders with a central pillar and graduated floor' },
          { id: 'rashivalaya', glyph: 'Rashivalaya Yantra', caption: 'Twelve separate instruments, each tilted differently' },
          { id: 'narivalaya', glyph: 'Narivalaya Yantra', caption: 'Two flat dials, one facing north, one south' },
          { id: 'chakra', glyph: 'Chakra Yantra', caption: 'A metal ring that can rotate about a polar axis' },
        ],
        right: [
          { id: 'samrat', label: 'Local time from the sun’s shadow, to within a couple of seconds' },
          { id: 'jaiprakash', label: 'The sun’s position mapped onto a sky-bowl, for cross-checking' },
          { id: 'ram', label: 'Altitude and azimuth of a celestial body' },
          { id: 'rashivalaya', label: 'Ecliptic coordinates — one instrument per zodiac sign' },
          { id: 'narivalaya', label: 'Time, with each dial used for half the year either side of the equinox' },
          { id: 'chakra', label: 'Declination and hour angle of a star or planet' },
        ],
      },
    },
    {
      id: 'konark-aryabhata',
      kind: 'dialogue',
      name: 'The Earth Does Not Stand Still',
      brief: 'Argue cosmology with a twenty-three-year-old in 499 CE.',
      teaches:
        'Aryabhata argued that the apparent rotation of the heavens is caused by the Earth’s own rotation, and that eclipses are shadows — and he labelled his value of π as approximate.',
      offset: [-90, 130],
      vidya: 190,
      quizAfter: 3,
      prompt: 'Debate with the astronomer',
      unlocks: ['aryabhata', 'zero-and-place-value'],
      config: {
        speaker: { name: 'Aryabhata', role: 'Astronomer, Kusumapura, 499 CE', icon: '🌑' },
        nodes: [
          {
            id: 'start',
            text:
              'I am twenty-three and I have finished the book. One hundred and twenty-one verses, four chapters, and in it I say something my teachers will not enjoy: that the stars do not go round us. We turn. Just as a man in a moving boat sees the bank slide backwards, so a man on a turning Earth sees the fixed stars slide west.',
            choices: [
              { label: 'Everyone can see the sky move. Why complain?', goto: 'boat' },
              { label: 'How would you ever test such a thing?', goto: 'test', wise: true, note: 'The right question to ask any claim.' },
              { label: 'What do you say about eclipses?', goto: 'eclipse' },
            ],
          },
          {
            id: 'boat',
            text:
              'Everyone can see the bank move, too. Appearance is the thing to be explained, not the explanation. And note what my model buys: one Earth turning once accounts for the daily motion of every star at once, instead of each sphere being pushed separately. The simpler account that predicts the same sky is the better account.',
            goto: 'test',
            next: 'test',
          },
          {
            id: 'test',
            text:
              'By prediction. I give the length of the sidereal day as 23 hours, 56 minutes and about 4.1 seconds. Check it against the stars for a year; if I am wrong, the error accumulates and you will catch me. That is the whole discipline: commit to a number, then let the sky audit you. Later astronomers — Brahmagupta among them — attacked parts of my system hard, and some of their corrections were right.',
            choices: [
              { label: 'You accept being corrected?', reply: 'I would rather be corrected than consulted.', goto: 'eclipse', wise: true, note: 'Self-correction is the mark of a scientific tradition.' },
              { label: 'And the eclipses?', goto: 'eclipse' },
            ],
          },
          {
            id: 'eclipse',
            text:
              'The moon has no light of its own; it shines by the sun. A lunar eclipse is the Earth’s shadow falling across it; a solar eclipse is the moon’s shadow falling on us. No demon, no serpent swallowing anything. And because it is geometry, it can be computed in advance — I give methods for the size and duration of the shadow.',
            choices: [
              { label: 'And your value for the circle?', goto: 'pi' },
              { label: 'What about this new way of writing numbers?', goto: 'zero' },
            ],
          },
          {
            id: 'pi',
            text:
              'Add four to one hundred, multiply by eight, add sixty-two thousand: for a diameter of twenty thousand, the circumference is 62,832. That is 3.1416. And I attach one word to it — asanna, approximate. I do not claim it is exact, because I have not shown that it can be exact. The word matters as much as the number.',
            goto: 'zero',
            next: 'zero',
          },
          {
            id: 'zero',
            text:
              'As for notation: we write in words and in a place-value system where each position is ten times the last, and we need a mark for an empty place. Brahmagupta, a century and a bit after me, will write down the arithmetic of that mark and of debts — what you would call negative numbers — including the rule that dividing by it gives nothing usable. Through Baghdad and then al-Andalus, those ten signs become the ones the whole world writes with.',
            end: true,
            vidya: 110,
            unlocks: ['zero-and-place-value'],
          },
        ],
      },
    },
    {
      id: 'konark-sequence',
      kind: 'sequence',
      name: 'A Thousand Years of Reckoning',
      brief: 'Order the mathematicians and astronomers.',
      teaches:
        'Indian mathematics is a continuous, named, dated tradition — including infinite series in Kerala two centuries before Newton.',
      offset: [40, 90],
      vidya: 150,
      quizAfter: 3,
      prompt: 'Order the manuscripts',
      unlocks: ['kerala-school', 'siddhanta-tradition'],
      config: {
        note:
          'Notice the geography: Pataliputra, Ujjain, Bhinmal, the Karnataka Deccan, then a cluster of villages in Kerala, then Jaipur. There is no single centre — there is a conversation carried on across the subcontinent for over a millennium.',
        items: [
          { id: 'aryabhata', label: 'Aryabhata — Aryabhatiya', when: '499 CE', detail: 'Earth’s rotation, eclipse geometry, a sine table, π ≈ 3.1416 marked "approximate".' },
          { id: 'varahamihira', label: 'Varahamihira — Pancha-siddhantika', when: 'c. 550 CE', detail: 'Surveys five existing astronomical systems; also the encyclopaedic Brihat Samhita.' },
          { id: 'brahmagupta', label: 'Brahmagupta — Brahmasphutasiddhanta', when: '628 CE', detail: 'Arithmetic of zero and negative numbers; cyclic-quadrilateral theorems.' },
          { id: 'mahavira', label: 'Mahavira — Ganita Sara Sangraha', when: 'c. 850 CE', detail: 'A Jain mathematician’s systematic textbook, written in Karnataka.' },
          { id: 'bhaskara', label: 'Bhaskara II — Siddhanta Shiromani', when: '1150 CE', detail: 'Lilavati and Bijaganita; instantaneous motion and an early form of Rolle’s theorem.' },
          { id: 'madhava', label: 'Madhava of Sangamagrama', when: 'c. 1400 CE', detail: 'Infinite series for π, sine and cosine — calculus-adjacent results, in Kerala.' },
          { id: 'yuktibhasha', label: 'Jyeshthadeva — Yuktibhasha', when: 'c. 1530 CE', detail: 'Written in Malayalam, and it gives *proofs*, not just results.' },
          { id: 'jaisingh', label: 'Sawai Jai Singh II — the Jantar Mantars', when: '1724–1734 CE', detail: 'Masonry instruments built after comparing Indian, Islamic and European tables.' },
        ],
      },
    },
  ],

  npcs: [
    {
      id: 'konark-sculptor',
      name: 'Bisu Maharana',
      role: 'Temple sculptor',
      icon: '🪨',
      offset: [-10, -32],
      color: 0x8c8172,
      lines: [
        'Twenty-four wheels, seven horses. The whole temple is the sun’s chariot, and it is meant to be read as one.',
        'Put your finger at the hub and watch the shadow cross the spokes. That is the time.',
        'The great tower fell. The porch stands. Sand and salt are patient enemies.',
      ],
      unlocks: 'konark-temple',
    },
    {
      id: 'konark-observer',
      name: 'Jagannatha Samrat',
      role: 'Court astronomer to Jai Singh',
      icon: '🔭',
      offset: [-108, 96],
      color: 0x6f86b8,
      lines: [
        'His Highness had Euclid translated, and Ptolemy, and the tables from Samarkand. Then he built in stone.',
        'Why so large? Because a shadow on a 27-metre gnomon can be read to seconds. Small instruments lie politely.',
        'We compared our tables with the European ones and published where we differed. That is the job.',
      ],
      unlocks: 'jantar-mantar',
    },
  ],
};
