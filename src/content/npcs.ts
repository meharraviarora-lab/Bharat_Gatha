import type { NpcSpec } from './types';

/**
 * The wider population.
 *
 * Each zone file holds the two or three characters who carry that chapter's
 * teaching. This file holds everyone else: the farmers, children, carters,
 * cooks, soldiers and traders who make a place feel inhabited rather than
 * curated. They are merged into their zones in `zones/index.ts`.
 *
 * The rule for writing one: a person says something only they would know, from
 * where they actually stand. No one here narrates a textbook.
 */
export const EXTRA_NPCS: Record<string, NpcSpec[]> = {
  // ------------------------------------------------------------- sindhu
  sindhu: [
    {
      id: 'sindhu-sweeper',
      name: 'Bhadra',
      role: 'Drain inspector',
      icon: '🧹',
      offset: [-2, 62],
      color: 0x8a7a5c,
      lines: [
        'Lift the slab, clear the silt, set the slab back. Every lane, every month.',
        'You can tell a careless household by its soak-pit. I know who they are.',
        'The city pays me. Think about what that means — somebody decided this job was worth wages.',
      ],
    },
    {
      id: 'sindhu-weaver',
      name: 'Sujata',
      role: 'Cotton weaver',
      icon: '🧶',
      offset: [36, 62],
      color: 0xc9b89a,
      lines: [
        'Cotton. We were spinning it here before anyone else anywhere, whatever the Egyptians say about linen.',
        'Dyed with madder for red. The colour holds if the mordant is right.',
        'They ship my cloth west in bales. Nobody there will know my name.',
      ],
    },
    {
      id: 'sindhu-child',
      name: 'Nilu',
      role: 'A child of the lower town',
      icon: '🪀',
      offset: [12, 118],
      color: 0xd8a56a,
      lines: [
        'Look — a clay bull with a nodding head. My uncle made it. Pull the string.',
        'There are little carts too, with real wheels that turn. And whistles shaped like birds.',
        'Grown-ups think the seals are the important things. The toys are better.',
      ],
    },
    {
      id: 'sindhu-farmer',
      name: 'Hemaka',
      role: 'Farmer on the floodplain',
      icon: '🌾',
      offset: [-150, 150],
      color: 0x9aa36a,
      lines: [
        'Wheat and barley in the cool season. Sesame and cotton after. The river decides, not me.',
        'We sow into the mud the flood leaves behind. No flood, no sowing.',
        'My field is ploughed in two directions, crossways. Try it — the yield is better.',
      ],
    },
  ],

  // ------------------------------------------------------------ meluhha
  meluhha: [
    {
      id: 'meluhha-brewer',
      name: 'Ninkasi-udug',
      role: 'Temple brewer',
      icon: '🍺',
      offset: [-86, 14],
      color: 0xc7a86a,
      lines: [
        'Barley bread, soaked and fermented, strained through a mat. Everyone is paid partly in beer.',
        'The ration tablets list it by the jar. That is most of what writing is for here.',
        'There is a hymn to the goddess of brewing that doubles as the recipe. Clever, that.',
      ],
    },
    {
      id: 'meluhha-sailor',
      name: 'Ur-sin',
      role: 'Gulf sailor',
      icon: '🧭',
      offset: [138, 128],
      color: 0x7f9bb0,
      lines: [
        'Hug the coast, anchor at night, never lose sight of land if you can help it.',
        'Dilmun first, then Magan. Only fools run straight for Meluhha.',
        'Reed boats caulked with bitumen. The bitumen seeps out of the ground here — the gods were generous.',
      ],
    },
    {
      id: 'meluhha-astronomer',
      name: 'Nabu-rimanni',
      role: 'Keeper of the sky diary',
      icon: '🌙',
      offset: [-18, -54],
      color: 0x8e86b8,
      lines: [
        'Every night, on a tablet: the moon’s place, the planets, the weather, the price of barley.',
        'Centuries of these. That is how we learned the eclipses come round in a cycle.',
        'Observe, record, wait. Most of astronomy is patience written down.',
      ],
    },
    {
      id: 'meluhha-marshwoman',
      name: 'Enheduanna-sal',
      role: 'Marsh reed-cutter',
      icon: '🪴',
      offset: [-124, 122],
      color: 0x8f9a6a,
      lines: [
        'Houses, boats, baskets, pens, writing styluses. All of it reed.',
        'We bend the bundles into arches and tie them. No nails, no timber — there are no trees here.',
        'The marsh feeds us when the canals fail. The city forgets that until it happens.',
      ],
    },
  ],

  // ------------------------------------------------------------- kosala
  kosala: [
    {
      id: 'kosala-reciter',
      name: 'Lava',
      role: 'Young reciter at the ashram',
      icon: '🎶',
      offset: [146, 104],
      color: 0xd8b26a,
      lines: [
        'We learned it by ear, in metre, thousands of verses. The metre is what holds it in the memory.',
        'Our teacher says we are singing a man his own story and he has not recognised it yet.',
        'Anustubh: eight syllables, four times over. Once you have the rhythm the words follow it.',
      ],
    },
    {
      id: 'kosala-physician',
      name: 'Vaidya Sumitra',
      role: 'Forest physician',
      icon: '⚕️',
      offset: [-108, 142],
      color: 0x7fa07a,
      lines: [
        'First identify. Then the season, then the part — root, bark, leaf, fruit. Each has its hour.',
        'Half of what I do is setting bones and cleaning wounds. The herbs get the stories.',
        'Learn three plants properly rather than thirty by rumour.',
      ],
      unlocks: 'ayurveda-plants',
    },
    {
      id: 'kosala-carpenter',
      name: 'Sthapati Jiva',
      role: 'City carpenter',
      icon: '🪵',
      offset: [-22, -8],
      color: 0xa0784c,
      lines: [
        'Everything you admire in stone later was first worked out in timber. The brackets, the eaves, the railings.',
        'Sal for beams, teak where we can get it. Season it two years or it will twist on you.',
        'Stone copies wood for centuries before it learns to be stone.',
      ],
    },
    {
      id: 'kosala-potter-girl',
      name: 'Ira',
      role: 'Potter’s apprentice',
      icon: '🫖',
      offset: [-46, 24],
      color: 0xc08a5a,
      lines: [
        'Wheel-thrown, not coiled. You can see the throwing rings inside if you look.',
        'Archaeologists will date us by our rubbish, my teacher says. So throw it away neatly.',
        'Every village makes a slightly different rim. That is how you tell where a pot has been.',
      ],
    },
  ],

  // --------------------------------------------------------- setu-lanka
  'setu-lanka': [
    {
      id: 'setu-pearl-diver',
      name: 'Mannar',
      role: 'Pearl diver',
      icon: '🦪',
      offset: [96, 78],
      color: 0x6f94a0,
      lines: [
        'These banks have given pearls since before anyone kept records. Rome bought them. Everyone bought them.',
        'Down on one breath, stone in hand to sink faster, basket round the neck.',
        'Three minutes if the sea is kind. It is usually not.',
      ],
    },
    {
      id: 'setu-signal',
      name: 'Angada',
      role: 'Signaller on the shore',
      icon: '🔥',
      offset: [-120, -40],
      color: 0xc08050,
      lines: [
        'Fires on the headlands. One for sighted, two for coming in, three for turn back.',
        'Faster than any runner. The whole coast knows within the hour.',
        'They will say the message flew. In a way it did.',
      ],
    },
    {
      id: 'setu-cook',
      name: 'Trijata',
      role: 'Cook to the army',
      icon: '🍲',
      offset: [10, 60],
      color: 0xb0886a,
      lines: [
        'An army crosses on rice, not on courage. Count the sacks before you count the spears.',
        'Salt fish and tamarind keep. Everything else spoils in three days in this heat.',
        'Nobody writes poems about the quartermaster.',
      ],
    },
    {
      id: 'setu-surveyor',
      name: 'Nila',
      role: 'Sounding-line surveyor',
      icon: '📏',
      offset: [-150, -118],
      color: 0x8fa0b0,
      lines: [
        'Knotted rope, lead weight, and you call the depth out loud so the boat behind hears it.',
        'Find the shallow line and the sea builds half your road for you.',
        'Measure twice at slack tide. Measuring on the ebb will lie to you.',
      ],
    },
  ],

  // -------------------------------------------------------- kurukshetra
  kurukshetra: [
    {
      id: 'kuru-fletcher',
      name: 'Shalya-putra',
      role: 'Fletcher',
      icon: '🪶',
      offset: [-108, 44],
      color: 0xa89470,
      lines: [
        'Three feathers, set with a slight spiral so the shaft spins. A straight-fletched arrow wanders.',
        'Reed shafts for volume, bamboo for the good ones. Iron heads, barbed or bodkin.',
        'I have made forty thousand arrows this month. Somebody will claim they shot them all.',
      ],
    },
    {
      id: 'kuru-physician',
      name: 'Ashvini',
      role: 'Battlefield surgeon',
      icon: '🩹',
      offset: [-130, 78],
      color: 0xb0a090,
      lines: [
        'Arrow out, wound cleaned, honey and ghee on it, bind it. Honey keeps a wound sweet.',
        'The texts give a hundred and twenty-one instruments. I carry nine and improvise.',
        'They bring me boys. Every single day, boys.',
      ],
    },
    {
      id: 'kuru-herald',
      name: 'Sumantra',
      role: 'Herald',
      icon: '📯',
      offset: [40, 34],
      color: 0xc9a05a,
      lines: [
        'Conch at dawn to begin, conch at sunset to stop. Those were the terms both sides agreed.',
        'I have blown the sunset conch and watched men keep fighting. That is the day it changed.',
        'My voice carries further than an arrow. It is the only weapon I am allowed.',
      ],
    },
    {
      id: 'kuru-widow',
      name: 'Uttara',
      role: 'Of the camp followers',
      icon: '🕯️',
      offset: [-88, 108],
      color: 0x8a7f90,
      lines: [
        'There is a whole book about us, at the end. The women walking the field afterwards.',
        'They name the heroes. The poem at least has the decency to name the grief too.',
        'Ask who won and then ask who is left. They are different questions.',
      ],
    },
  ],

  // ------------------------------------------------------------ magadha
  magadha: [
    {
      id: 'magadha-dhamma-officer',
      name: 'Mahamatra Devi',
      role: 'Dhamma inspector',
      icon: '📋',
      offset: [-40, 36],
      color: 0xb8a070,
      lines: [
        'I inspect: are the wells dug, the trees planted, the rest-houses standing, the prisoners treated properly.',
        'The edicts are instructions to me as much as announcements to you.',
        'A policy with no inspector is a wish.',
      ],
      unlocks: 'ashokan-dhamma',
    },
    {
      id: 'magadha-tibetan-student',
      name: 'Jnanashri',
      role: 'Student from Tibet',
      icon: '🧳',
      offset: [160, 86],
      color: 0x9a7f5a,
      lines: [
        'Two years walking to reach the gate, and then they examine you at it.',
        'Most are turned away. I was asked three questions on logic and nearly failed the second.',
        'We copy texts to take home. A manuscript is worth more than a horse on that road.',
      ],
    },
    {
      id: 'magadha-blacksmith',
      name: 'Lohita',
      role: 'Iron smith',
      icon: '⚒️',
      offset: [-62, 108],
      color: 0x7a6a5a,
      lines: [
        'Magadha has iron and forests to burn into charcoal. That is the whole secret of this empire.',
        'Ploughshares mostly. Clearing the Ganga forest takes more iron than any war does.',
        'There is a pillar at Delhi that has not rusted in centuries. Someone here worked out why.',
      ],
    },
    {
      id: 'magadha-nun',
      name: 'Bhikkhuni Sanghamitta',
      role: 'Nun of the sangha',
      icon: '🪷',
      offset: [-16, -96],
      color: 0xd09a4a,
      lines: [
        'Women take the robe too. Read the Therigatha — poems by nuns, some of the oldest verse by women anywhere.',
        'We carry a cutting of the bodhi tree to Lanka. A sapling travels better than an argument.',
        'Donate a railing post and your name is cut into it. Look — half of them are women’s names.',
      ],
    },
  ],

  // -------------------------------------------------------------- chola
  chola: [
    {
      id: 'chola-dancer',
      name: 'Nangai',
      role: 'Temple dancer',
      icon: '💃',
      offset: [12, 18],
      color: 0xc98a9a,
      lines: [
        'Four hundred of us are listed on that wall, with our names, our streets and our allowances.',
        'The poses in the stone are the poses we hold. The sculptors watched us; we check ourselves against them.',
        'Being written into a wall is not the same as being free. Both things are true.',
      ],
    },
    {
      id: 'chola-accountant',
      name: 'Karanattan',
      role: 'Temple accountant',
      icon: '🧮',
      offset: [-28, -16],
      color: 0xa0966a,
      lines: [
        'Paddy in, oil in, wages out, lamps lit. Every figure goes on the wall where anyone can check it.',
        'We measure land in veli and ma, and we survey it again when the river moves.',
        'The stone does not forget and it cannot be edited. That is the point of it.',
      ],
      unlocks: 'chola-administration',
    },
    {
      id: 'chola-shipwright',
      name: 'Kadal Arasan',
      role: 'Shipwright',
      icon: '🛠️',
      offset: [138, 156],
      color: 0x8a7050,
      lines: [
        'Planks stitched with coir, not nailed. A sewn hull gives in a swell instead of splitting.',
        'Teak from the hills, coir from the coast, resin for the seams. All of it within a week’s cart ride.',
        'Repairs on a beach with no forge. Try that with an iron-nailed ship.',
      ],
    },
    {
      id: 'chola-ricefarmer',
      name: 'Ponni',
      role: 'Delta rice farmer',
      icon: '🌾',
      offset: [-130, 108],
      color: 0x8aa05a,
      lines: [
        'Transplanted by hand, every seedling. Three crops a year where the water reaches.',
        'The tank committee fines you if you let your bund break. Quite right too.',
        'Kaveri water is counted out in days, not litres. Your turn comes round and you take it.',
      ],
    },
  ],

  // ------------------------------------------------------------- konark
  konark: [
    {
      id: 'konark-timekeeper',
      name: 'Divakara',
      role: 'Keeper of the hours',
      icon: '⏳',
      offset: [-28, -16],
      color: 0xa89a7a,
      lines: [
        'Put your finger on the axle and read where the shadow crosses. That is the hour, to the quarter.',
        'Cloudy days we use a water clock — a bowl with a hole, sinking at a known rate.',
        'The temple is a chariot and a clock at the same time. Nobody thought that was odd.',
      ],
      unlocks: 'shadow-timekeeping',
    },
    {
      id: 'konark-calendarist',
      name: 'Panchangi Ratna',
      role: 'Almanac maker',
      icon: '📆',
      offset: [60, 40],
      color: 0xb09a6a,
      lines: [
        'Lunar months, solar year, and an extra month every three years to stop them drifting apart.',
        'Farmers want the monsoon date. Priests want the festival date. I compute both from the same tables.',
        'When my prediction is wrong the whole village knows by evening.',
      ],
    },
    {
      id: 'konark-instrument-mason',
      name: 'Kesari',
      role: 'Instrument mason',
      icon: '📐',
      offset: [-140, 72],
      color: 0x9a8e7c,
      lines: [
        'An error of one finger-width on a scale this long is an error of seconds in the reading.',
        'We set the gnomon to the latitude. Get that wrong and nothing else can be right.',
        'Stone moves with the heat. We cut the scales at dawn.',
      ],
    },
    {
      id: 'konark-fisher',
      name: 'Sumitra',
      role: 'Fisher of the Chilika shore',
      icon: '🐟',
      offset: [120, 160],
      color: 0x7f99a0,
      lines: [
        'We navigate by the temple. Painted black with sea salt — the sailors called it the Black Pagoda.',
        'When it fell, boats went aground for a season until we learned new marks.',
        'A monument is a landmark before it is a monument.',
      ],
    },
  ],

  // -------------------------------------------------------------- hampi
  hampi: [
    {
      id: 'hampi-water-keeper',
      name: 'Hampamma',
      role: 'Canal keeper',
      icon: '💧',
      offset: [-58, 108],
      color: 0x7f9a8a,
      lines: [
        'This channel was cut five hundred years ago and it still waters my bananas.',
        'Desilt before the monsoon, not after. Everyone knows and half of them forget.',
        'Empires come and go. The canal has outlasted three of them.',
      ],
      unlocks: 'hampi-water',
    },
    {
      id: 'hampi-persian-envoy',
      name: 'Abdur Razzaq',
      role: 'Envoy from Herat',
      icon: '✒️',
      offset: [-120, 18],
      color: 0x8a86b0,
      lines: [
        'I am to report whether this kingdom is formidable. You can guess what my report will say.',
        'Seven circuits of wall, bazaars full of jewels — I will write it exactly as I saw it, and still nobody will believe me.',
        'An ambassador is a merchant of impressions.',
      ],
    },
    {
      id: 'hampi-telugu-poet',
      name: 'Allasani Peddana',
      role: 'Poet of the court',
      icon: '📜',
      offset: [-136, 38],
      color: 0xc0a070,
      lines: [
        'Telugu, Kannada, Tamil and Sanskrit in the same hall on the same evening. Nobody thinks it remarkable.',
        'The king writes too — and not badly, which makes him a difficult patron.',
        'They call us the eight elephants. Elephants are slow and remembered. I will take it.',
      ],
    },
    {
      id: 'hampi-elephant-keeper',
      name: 'Mahout Bhima',
      role: 'Elephant keeper',
      icon: '🐘',
      offset: [-100, -24],
      color: 0x9a8a6a,
      lines: [
        'Eleven chambers, one animal each, domed so the heat lifts away from them.',
        'An elephant eats two hundred kilos a day. The stables are an argument about logistics.',
        'Mine knows my voice from fifty paces and ignores it from twenty.',
      ],
    },
  ],

  // --------------------------------------------------------------- agra
  agra: [
    {
      id: 'agra-garden-master',
      name: 'Mirza Nauroz',
      role: 'Master of the garden',
      icon: '🌿',
      offset: [-20, 34],
      color: 0x7f9a66,
      lines: [
        'Water runs by gravity from the river, through the channels, into every bed. No pumps anywhere.',
        'Cypress for death, fruit trees for life, planted in alternation. The garden is an argument.',
        'Sunken beds, raised walks. You walk at the level of the treetops without noticing.',
      ],
      unlocks: 'charbagh',
    },
    {
      id: 'agra-painter',
      name: 'Bichitr',
      role: 'Painter of the atelier',
      icon: '🖌️',
      offset: [-152, 84],
      color: 0xb08a6a,
      lines: [
        'Persian line, Indian colour, and lately European perspective because the Jesuits brought prints.',
        'Squirrel-hair brushes, down to a single hair for the eyelashes.',
        'I paint the emperor preferring a holy man to a king. He approved it. Think about that.',
      ],
      unlocks: 'mughal-translation',
    },
    {
      id: 'agra-stonecutter-girl',
      name: 'Zarina',
      role: 'Inlay apprentice',
      icon: '💎',
      offset: [-124, -100],
      color: 0xc9b89a,
      lines: [
        'Twenty-eight kinds of stone in one flower. Carnelian, jasper, lapis, jade, turquoise.',
        'You cut the recess to fit the stone, not the stone to fit the recess.',
        'My grandfather worked on the tomb. My hands do what his hands did.',
      ],
    },
    {
      id: 'agra-water-carrier',
      name: 'Bhishti Ramzan',
      role: 'Water carrier',
      icon: '🫗',
      offset: [92, 86],
      color: 0x8a95a0,
      lines: [
        'Goatskin on the back, river to the site, all day. Twenty thousand men on this works get thirsty.',
        'A bhishti once saved an emperor from drowning and was given the throne for a day. Ask anyone.',
        'They will remember the marble. Somebody carried the water that mixed the mortar.',
      ],
      unlocks: 'taj-workforce',
    },
  ],

  // ------------------------------------------------------------ maratha
  maratha: [
    {
      id: 'maratha-scout',
      name: 'Yesaji',
      role: 'Hill scout',
      icon: '🥾',
      offset: [-70, 60],
      color: 0x6f7f52,
      lines: [
        'Every ridge between here and the coast, and which of them you can cross in the rains.',
        'The enemy has maps. We have the actual hills. It is not the same advantage.',
        'Walk at night, sleep at noon. The heat is a sentry working for us.',
      ],
    },
    {
      id: 'maratha-smith',
      name: 'Sakharam',
      role: 'Armourer',
      icon: '🗡️',
      offset: [48, -30],
      color: 0x7a6a5c,
      lines: [
        'Light armour, light blades. If a man cannot run up this path in it, I have failed.',
        'The pata, the dandpatta — a gauntlet sword. Vicious in a corridor, useless on a plain.',
        'We repair more than we forge. A campaign is mostly mending.',
      ],
    },
    {
      id: 'maratha-rajput-envoy',
      name: 'Rani Padmini’s herald',
      role: 'Envoy from Mewar',
      icon: '🏵️',
      offset: [-48, -84],
      color: 0xc08a7a,
      lines: [
        'Mewar fought the same arithmetic two centuries earlier: few men, high ground, long patience.',
        'The bards sing the sieges. The chronicles on the other side sing the victories. Read both.',
        'Chittorgarh is two hundred and eighty hectares of plateau. You do not take it in an afternoon.',
      ],
      unlocks: 'haldighati',
    },
    {
      id: 'maratha-clerk',
      name: 'Balaji',
      role: 'Revenue clerk',
      icon: '🧾',
      offset: [86, 64],
      color: 0x9a9070,
      lines: [
        'Measured, assessed, receipted. If a soldier takes grain without a receipt he answers for it.',
        'Chauth is a share, not a sack. The difference is the whole character of the state.',
        'Records in Marathi now. My father wrote them in Persian and could not read them aloud to a farmer.',
      ],
      unlocks: 'maratha-society',
    },
  ],
};

/** Total extra characters, for the loading log. */
export const EXTRA_NPC_COUNT = Object.values(EXTRA_NPCS).reduce((n, list) => n + list.length, 0);
