import type { Zone } from '../types';

/**
 * Chapter 7 — the Chola country.
 *
 * Three things make this zone worth a chapter: an 80-tonne capstone 66 metres
 * up with no mortar, a bronze-casting technique still practised in the same
 * district today, and village assemblies that drew lots from a pot to choose
 * their own officers in the tenth century.
 */
export const chola: Zone = {
  id: 'chola',
  name: 'The Chola Country',
  nameLocal: 'சோழ நாடு',
  era: 'c. 850–1279 CE',
  eraStart: 850,
  eraEnd: 1279,
  chapter: 7,
  tagline: 'Granite, bronze, and village ballots drawn from a pot.',
  blurb:
    'Rajaraja I’s temple at Thanjavur rises 66 metres of interlocking granite with no mortar holding it together. Down the road, bronze-casters still use the lost-wax method their ancestors used — and the village assembly at Uttaramerur left its election rules carved on a wall.',
  center: [320, 830],
  radius: 320,
  plateau: 18,
  biome: 'coastalPalm',
  raga: 'bhupali',
  tonic: 52,
  sealRequires: 3,
  palette: {
    ground: 0x6f8c42,
    rock: 0x9a8d74,
    foliage: 0x2f6b39,
    stone: 0xb9a888,
    horizon: 0xffd2a0,
    zenith: 0x3f7cc0,
    fog: 0xc6d4a6,
    sun: 0xfff0c6,
    sunElevation: 56,
    sunAzimuth: 196,
  },

  landmarks: [
    {
      id: 'chola-temple',
      name: 'Brihadeeswarar Temple',
      kind: 'dravidaTemple',
      offset: [0, -40],
      codexId: 'brihadeeswarar',
      scanSeconds: 4.5,
      signposted: true,
      opts: { tiers: 13, gopuram: 1, vimanaHeight: 60, courtWidth: 120 },
    },
    {
      id: 'chola-foundry',
      name: 'The Bronze Foundry',
      kind: 'bronzeFoundry',
      offset: [-96, 56],
      rotation: 18,
      codexId: 'chola-bronzes',
      scanSeconds: 3,
      signposted: true,
    },
    {
      id: 'chola-harbour',
      name: 'The Coromandel Harbour',
      kind: 'harbour',
      offset: [150, 170],
      rotation: -28,
      codexId: 'chola-navy',
      scanSeconds: 3,
      signposted: true,
      opts: { ships: 3 },
    },
    {
      id: 'chola-dhow',
      name: 'A Chola Trading Ship',
      kind: 'dhow',
      offset: [182, 196],
      rotation: 55,
      opts: { large: 1 },
    },
    {
      id: 'chola-assembly',
      name: 'The Village Assembly Hall',
      kind: 'bazaarStreet',
      offset: [-60, 140],
      rotation: 6,
      codexId: 'uttaramerur',
      scanSeconds: 3,
      signposted: true,
      opts: { stalls: 8, hall: 1 },
    },
    {
      id: 'chola-tank',
      name: 'The Temple Tank',
      kind: 'stepwell',
      offset: [70, 30],
      opts: { large: 1 },
      codexId: 'water-management',
      scanSeconds: 2.5,
    },
    {
      id: 'chola-village',
      name: 'A Brahmadeya Village',
      kind: 'villageCluster',
      offset: [-150, -90],
      opts: { count: 10 },
      codexId: 'chola-society',
      scanSeconds: 2.5,
    },
    { id: 'chola-pad', name: 'Landing Terrace', kind: 'vimanaPad', offset: [120, -120] },
  ],

  challenges: [
    {
      id: 'chola-lostwax',
      kind: 'assembly',
      name: 'Cast a Bronze',
      brief: 'Work through the lost-wax process in the correct order. Get it wrong and the mould cracks.',
      teaches:
        'Madhuchchhishta vidhana (lost-wax casting): wax model, clay investment, burn-out, pour, break out, finish. Each Chola bronze is therefore unique — the mould is destroyed.',
      offset: [-88, 48],
      vidya: 180,
      quizAfter: 3,
      prompt: 'Work at the foundry',
      unlocks: ['chola-bronzes', 'lost-wax'],
      config: {
        ordered: true,
        hint: 'The wax has to leave before the metal arrives.',
        pieces: [
          { id: 'wax', label: 'Beeswax model of the figure', size: [1.2, 2.2, 1.2], color: 0xe0c070 },
          { id: 'clay', label: 'Fine clay investment coat', size: [1.8, 2.6, 1.8], color: 0x8d6a4c },
          { id: 'bake', label: 'Fire the mould — wax burns out', size: [2.2, 2.4, 2.2], color: 0xc45a2a },
          { id: 'pour', label: 'Pour the molten bronze', size: [1.4, 1.4, 1.4], color: 0xffa23a },
          { id: 'break', label: 'Break away the mould', size: [2, 1.4, 2], color: 0x6d6155 },
          { id: 'chase', label: 'Chase and polish the surface', size: [1.2, 2.2, 1.2], color: 0xa9793c },
        ],
        sockets: [
          { id: 'b1', label: '1 · Model', pos: [-12, 1.1, 0], accepts: 'wax' },
          { id: 'b2', label: '2 · Invest', pos: [-7, 1.3, 0], accepts: 'clay' },
          { id: 'b3', label: '3 · Burn out', pos: [-2, 1.2, 0], accepts: 'bake' },
          { id: 'b4', label: '4 · Pour', pos: [3, 0.7, 0], accepts: 'pour' },
          { id: 'b5', label: '5 · Break out', pos: [8, 0.7, 0], accepts: 'break' },
          { id: 'b6', label: '6 · Finish', pos: [13, 1.1, 0], accepts: 'chase' },
        ],
      },
    },
    {
      id: 'chola-ballot',
      kind: 'dialogue',
      name: 'The Pot Ballot',
      brief: 'The village is choosing its committee. Learn the rules carved on the wall.',
      teaches:
        'The Uttaramerur inscriptions set out qualifications, disqualifications, a lottery mechanism and term limits for village officers in the early tenth century.',
      offset: [-56, 130],
      vidya: 170,
      quizAfter: 3,
      prompt: 'Attend the assembly',
      unlocks: ['uttaramerur', 'chola-administration'],
      config: {
        speaker: { name: 'Nachchiyar', role: 'Reader of the assembly wall', icon: '🏺' },
        nodes: [
          {
            id: 'start',
            text:
              'Before we draw, the rules are read aloud. They are not in a book that can be edited — they are cut into that wall, where everyone can check them. Sabha business, Uttaramerur, in the reign of Parantaka. Shall I read the qualifications or the disqualifications first?',
            choices: [
              { label: 'Qualifications.', goto: 'quals' },
              { label: 'Disqualifications — those are more interesting.', goto: 'disquals', wise: true, note: 'They are: the inscription spends more words on who may NOT serve.' },
            ],
          },
          {
            id: 'quals',
            text:
              'A candidate must own a certain extent of tax-paying land, live in a house on his own site, be between roughly thirty-five and seventy years of age, and know the Vedas or at least the prescribed texts. Note what that means: there is a property qualification and a literacy qualification. This is not universal suffrage. It is a rule-bound, written, auditable local government — which in the tenth century is remarkable enough.',
            goto: 'disquals',
            next: 'disquals',
          },
          {
            id: 'disquals',
            text:
              'Barred: anyone who has not submitted his accounts; anyone whose relatives have not submitted theirs; anyone who took the committee seat in the last three years; anyone convicted of certain offences; anyone who rode the village’s business for private gain. Audit first, then eligibility. The inscription is blunt about it.',
            choices: [
              { label: 'So the real innovation is accountability, not voting.', reply: 'That is the sentence I would carve.', goto: 'draw', wise: true, note: 'Rotation + audit + written rules = the actual achievement.' },
              { label: 'How is the choice finally made?', goto: 'draw' },
            ],
          },
          {
            id: 'draw',
            text:
              'Each ward writes its eligible names on palm-leaf tickets. All tickets go into a pot — a kudam. A young boy who cannot read, so he cannot favour anyone, draws one ticket per ward in full view of the assembly. We call it kudavolai, the pot-ticket. Terms do not repeat for three years. Then the accounts are read again next year, and the wall does not forget.',
            end: true,
            vidya: 90,
            unlocks: ['chola-administration'],
          },
        ],
      },
    },
    {
      id: 'chola-capstone',
      kind: 'sequence',
      name: 'Raise the Capstone',
      brief: 'Order the steps that put an 80-tonne stone 66 metres in the air.',
      teaches:
        'Pre-modern megalithic construction: ramps, rollers, levers, earth berms and manpower — and that the Thanjavur vimana is dry-jointed interlocking granite.',
      offset: [-10, -26],
      vidya: 170,
      quizAfter: 2,
      prompt: 'Supervise the hoist',
      unlocks: ['brihadeeswarar', 'granite-engineering'],
      config: {
        note:
          'Local tradition holds that the ramp for the capstone began at a village called Sarapallam, several kilometres away. The temple has no deep foundation in the modern sense and no mortar in the tower: the granite blocks interlock and hold by weight and geometry. It has stood through earthquakes since 1010 CE.',
        items: [
          { id: 'quarry', label: 'Quarry and dress the granite', when: 'Step 1', detail: 'Granite is not local to the delta; blocks were moved considerable distances.' },
          { id: 'foundation', label: 'Level and consolidate the platform', when: 'Step 2', detail: 'A broad, compacted base spreads the load across soft alluvial soil.' },
          { id: 'courses', label: 'Lay the interlocking courses', when: 'Step 3', detail: 'Each course steps inward; the shapes hold each other without mortar.' },
          { id: 'ramp', label: 'Build the long earth ramp', when: 'Step 4', detail: 'A shallow gradient over several kilometres is easier than a steep one over a few hundred metres.' },
          { id: 'haul', label: 'Haul on rollers with levers and beasts', when: 'Step 5', detail: 'Timber rollers, ropes, levers and a very large number of people.' },
          { id: 'seat', label: 'Seat the capstone and remove the ramp', when: 'Step 6', detail: 'The ramp is dug away afterwards, which is why no trace of it survives.' },
          { id: 'inscribe', label: 'Carve the endowment records on the walls', when: 'Step 7', detail: 'The temple doubles as a public archive: grants, wages, dancers, musicians, cattle, all recorded in stone.' },
        ],
      },
    },
    {
      id: 'chola-navy',
      kind: 'sequence',
      name: 'The Srivijaya Expedition',
      brief: 'Order the stages of a medieval Indian Ocean naval campaign.',
      teaches:
        'The Cholas projected naval power across the Bay of Bengal; monsoon winds, not engines, set the timetable.',
      offset: [140, 156],
      vidya: 140,
      quizAfter: 2,
      prompt: 'Read the campaign inscription',
      unlocks: ['chola-navy', 'monsoon-trade'],
      config: {
        note:
          'Rajendra I’s raid on Srivijaya around 1025 CE is recorded in the Thanjavur inscriptions, which list the ports taken. It was about controlling the Strait of Malacca — the chokepoint for China trade — not about settlement.',
        items: [
          { id: 'intel', label: 'Gather intelligence from merchant guilds', when: 'Stage 1', detail: 'Guilds like the Ayyavole and Manigramam traded across the Bay and knew every harbour.' },
          { id: 'build', label: 'Build and provision the fleet', when: 'Stage 2', detail: 'Teak hulls, coir rope, stitched planking; water and rice for weeks at sea.' },
          { id: 'wait', label: 'Wait for the north-east monsoon', when: 'Stage 3', detail: 'Sail east from the Coromandel coast between roughly November and February.' },
          { id: 'strait', label: 'Strike the Strait ports', when: 'Stage 4', detail: 'Kadaram and other ports controlling the passage between the Indian Ocean and the South China Sea.' },
          { id: 'return', label: 'Return on the south-west monsoon', when: 'Stage 5', detail: 'The winds reverse around June; the fleet comes home on the other half of the year.' },
          { id: 'record', label: 'Carve the port list on the temple wall', when: 'Stage 6', detail: 'Which is how we know the campaign happened at all.' },
        ],
      },
    },
  ],

  npcs: [
    {
      id: 'chola-sthapati',
      name: 'Kunjaramallan',
      role: 'Sthapati (master builder)',
      icon: '📐',
      offset: [-16, -18],
      color: 0xb59a72,
      lines: [
        'No mortar. Not one measure of it in the tower. The stones are cut to hold each other.',
        'The shadow of the vimana does not fall on the ground at noon. Work out why.',
        'Every wage, every grant, every dancer’s name — carved on the wall. A temple is also an account book.',
      ],
      unlocks: 'brihadeeswarar',
    },
    {
      id: 'chola-caster',
      name: 'Sembian',
      role: 'Bronze caster',
      icon: '🔥',
      offset: [-86, 42],
      color: 0xb8742f,
      lines: [
        'Every mould is broken to free the figure. That is why no two of our bronzes are the same.',
        'Five metals, they say — pancha loha. Mostly copper, with tin, and a little of the others.',
        'The Nataraja has to balance on one foot and still be processional. Weight distribution is theology here.',
      ],
      unlocks: 'chola-bronzes',
    },
  ],
};
