/**
 * A dated spine for the whole game.
 *
 * This exists so that chronology questions can be *generated* rather than
 * written. Four events drawn from here, shuffled, with "which came first?"
 * asked about them, produces a different question almost every time — and the
 * answer is always checkable against the `year` field rather than against an
 * author's memory.
 *
 * `year` is a signed number: negative is BCE. Where a date is approximate or
 * disputed, `year` is the conventional midpoint and `displayDate` says so.
 */

export type EventKind = 'political' | 'cultural' | 'science' | 'monument' | 'discovery';

export interface TimelineEvent {
  id: string;
  /** Zone this belongs to, or 'general' for cross-cutting events. */
  zoneId: string;
  label: string;
  /** Signed year; negative = BCE. */
  year: number;
  displayDate: string;
  kind: EventKind;
  detail: string;
  /** True when scholars genuinely disagree about the date. */
  contested?: boolean;
}

export const TIMELINE: TimelineEvent[] = [
  // ------------------------------------------------------------ Bronze Age
  {
    id: 'uruk-writing',
    zoneId: 'meluhha',
    label: 'The first pictographic tablets at Uruk',
    year: -3200,
    displayDate: 'c. 3200 BCE',
    kind: 'cultural',
    detail: 'Administrative accounts of barley, beer and labour — the earliest substantial writing anywhere.',
  },
  {
    id: 'harappan-mature',
    zoneId: 'sindhu',
    label: 'The Mature Harappan period begins',
    year: -2600,
    displayDate: 'c. 2600 BCE',
    kind: 'cultural',
    detail: 'Grid-planned cities, standardised weights and the script all appear together.',
  },
  {
    id: 'great-bath',
    zoneId: 'sindhu',
    label: 'The Great Bath is built at Mohenjo-daro',
    year: -2500,
    displayDate: 'c. 2500 BCE',
    kind: 'monument',
    detail: 'A sunken brick tank waterproofed with bitumen, on the citadel mound.',
  },
  {
    id: 'lothal-basin',
    zoneId: 'sindhu',
    label: 'The brick basin at Lothal is constructed',
    year: -2400,
    displayDate: 'c. 2400 BCE',
    kind: 'monument',
    detail: 'Read as a tidal dockyard by its excavator and as a water tank by his critics.',
    contested: true,
  },
  {
    id: 'ziggurat-ur-built',
    zoneId: 'meluhha',
    label: 'The Great Ziggurat of Ur is built',
    year: -2100,
    displayDate: 'c. 2100 BCE',
    kind: 'monument',
    detail: 'Raised under Ur-Nammu as the platform for the moon god’s shrine.',
  },
  {
    id: 'harappan-decline',
    zoneId: 'sindhu',
    label: 'The Harappan cities de-urbanise',
    year: -1900,
    displayDate: 'c. 1900 BCE',
    kind: 'political',
    detail: 'Weights, seals and public works fall out of use; settlement shifts east and south.',
  },
  {
    id: 'hammurabi',
    zoneId: 'meluhha',
    label: 'Hammurabi’s law stele is carved',
    year: -1754,
    displayDate: 'c. 1754 BCE',
    kind: 'cultural',
    detail: 'Around 280 provisions, with penalties explicitly graded by social rank.',
  },

  // --------------------------------------------------------- early historic
  {
    id: 'panini',
    zoneId: 'general',
    label: 'Panini composes the Ashtadhyayi',
    year: -450,
    displayDate: 'c. 5th–4th century BCE',
    kind: 'science',
    detail: 'A generative grammar of Sanskrit in roughly 4,000 rules — a formal system two millennia early.',
    contested: true,
  },
  {
    id: 'chandragupta',
    zoneId: 'magadha',
    label: 'Chandragupta Maurya takes Magadha',
    year: -321,
    displayDate: 'c. 321 BCE',
    kind: 'political',
    detail: 'Advised by Kautilya; the Mauryan empire follows within a generation.',
  },
  {
    id: 'megasthenes',
    zoneId: 'magadha',
    label: 'Megasthenes arrives at the Mauryan court',
    year: -302,
    displayDate: 'c. 302 BCE',
    kind: 'cultural',
    detail: 'A Seleucid ambassador whose Indica survives only in later quotations.',
  },
  {
    id: 'kalinga',
    zoneId: 'magadha',
    label: 'The Kalinga war and Ashoka’s edicts',
    year: -261,
    displayDate: 'c. 261 BCE',
    kind: 'political',
    detail: 'Rock Edict 13 records casualty figures and the emperor’s remorse.',
  },
  {
    id: 'sanchi-toranas',
    zoneId: 'magadha',
    label: 'Sanchi’s carved gateways are added',
    year: -50,
    displayDate: 'c. 1st century BCE',
    kind: 'monument',
    detail: 'Satavahana-period work around an Ashokan brick core.',
  },
  {
    id: 'periplus',
    zoneId: 'chola',
    label: 'The Periplus of the Erythraean Sea is written',
    year: 60,
    displayDate: 'c. 1st century CE',
    kind: 'cultural',
    detail: 'A Greek merchant’s handbook naming Indian ports, goods and monsoon timings.',
  },

  // ------------------------------------------------------------ classical
  {
    id: 'aryabhatiya',
    zoneId: 'konark',
    label: 'Aryabhata completes the Aryabhatiya',
    year: 499,
    displayDate: '499 CE',
    kind: 'science',
    detail: 'Earth’s rotation, eclipse geometry, a sine table, and π given as approximate.',
  },
  {
    id: 'nalanda-founded',
    zoneId: 'magadha',
    label: 'Nalanda Mahavihara is founded',
    year: 450,
    displayDate: '5th century CE',
    kind: 'cultural',
    detail: 'Under Gupta patronage; it runs for roughly seven hundred years.',
  },
  {
    id: 'varahamihira',
    zoneId: 'konark',
    label: 'Varahamihira compiles the Pancha-siddhantika',
    year: 550,
    displayDate: 'c. 550 CE',
    kind: 'science',
    detail: 'A survey of five existing astronomical systems, with their disagreements.',
  },
  {
    id: 'brahmagupta',
    zoneId: 'konark',
    label: 'Brahmagupta writes the Brahmasphutasiddhanta',
    year: 628,
    displayDate: '628 CE',
    kind: 'science',
    detail: 'The first known rules for arithmetic with zero and with negative quantities.',
  },
  {
    id: 'xuanzang',
    zoneId: 'magadha',
    label: 'Xuanzang studies at Nalanda',
    year: 637,
    displayDate: 'c. 637 CE',
    kind: 'cultural',
    detail: 'His travel account is one of the best descriptions we have of the place.',
  },
  {
    id: 'gwalior-zero',
    zoneId: 'konark',
    label: 'The Gwalior inscription records a decimal zero',
    year: 876,
    displayDate: '876 CE',
    kind: 'science',
    detail: 'A clear, dated use of zero as a digit in place-value notation.',
  },
  {
    id: 'uttaramerur',
    zoneId: 'chola',
    label: 'The Uttaramerur election rules are inscribed',
    year: 920,
    displayDate: 'c. 920 CE',
    kind: 'political',
    detail: 'Qualifications, disqualifications, a pot ballot and term limits, carved on a temple wall.',
  },
  {
    id: 'brihadeeswarar',
    zoneId: 'chola',
    label: 'Brihadeeswarar temple is completed at Thanjavur',
    year: 1010,
    displayDate: '1010 CE',
    kind: 'monument',
    detail: 'A 66 m granite vimana with no mortar in the tower.',
  },
  {
    id: 'srivijaya',
    zoneId: 'chola',
    label: 'Rajendra I’s naval expedition to Srivijaya',
    year: 1025,
    displayDate: 'c. 1025 CE',
    kind: 'political',
    detail: 'Aimed at the Strait of Malacca; the ports taken are listed in the Thanjavur inscriptions.',
  },
  {
    id: 'bhaskara',
    zoneId: 'konark',
    label: 'Bhaskara II writes the Siddhanta Shiromani',
    year: 1150,
    displayDate: '1150 CE',
    kind: 'science',
    detail: 'Includes Lilavati and Bijaganita, and an early treatment of instantaneous motion.',
  },
  {
    id: 'kamban',
    zoneId: 'kosala',
    label: 'Kamban composes the Ramavataram in Tamil',
    year: 1150,
    displayDate: 'c. 12th century CE',
    kind: 'cultural',
    detail: 'One of the great regional Ramayanas, with its own emphases and omissions.',
    contested: true,
  },
  {
    id: 'nalanda-sacked',
    zoneId: 'magadha',
    label: 'Nalanda is sacked',
    year: 1193,
    displayDate: 'c. 1193 CE',
    kind: 'political',
    detail: 'Attacked during the Ghurid campaigns in Bihar; the libraries are destroyed.',
  },
  {
    id: 'konark-built',
    zoneId: 'konark',
    label: 'The Sun Temple at Konark is built',
    year: 1250,
    displayDate: 'c. 1250 CE',
    kind: 'monument',
    detail: 'Conceived as the sun’s chariot, with twenty-four wheels that work as sundials.',
  },

  // ------------------------------------------------------------- medieval
  {
    id: 'chittor-1303',
    zoneId: 'maratha',
    label: 'Alauddin Khalji besieges Chittorgarh',
    year: 1303,
    displayDate: '1303 CE',
    kind: 'political',
    detail: 'The first of the three great sieges in Mewar’s memory.',
  },
  {
    id: 'vijayanagara-founded',
    zoneId: 'hampi',
    label: 'Vijayanagara is founded',
    year: 1336,
    displayDate: '1336 CE',
    kind: 'political',
    detail: 'By Harihara I and Bukka I of the Sangama line, on the Tungabhadra.',
  },
  {
    id: 'madhava',
    zoneId: 'konark',
    label: 'Madhava of Sangamagrama derives infinite series',
    year: 1400,
    displayDate: 'c. 1400 CE',
    kind: 'science',
    detail: 'Series for π, sine and cosine — calculus-adjacent results, in Kerala.',
  },
  {
    id: 'vijaya-stambha',
    zoneId: 'maratha',
    label: 'Rana Kumbha builds the Vijaya Stambha',
    year: 1448,
    displayDate: '1448 CE',
    kind: 'monument',
    detail: 'A nine-storey tower of victory at Chittorgarh.',
  },
  {
    id: 'razzaq',
    zoneId: 'hampi',
    label: 'Abdur Razzaq visits Vijayanagara',
    year: 1443,
    displayDate: '1443 CE',
    kind: 'cultural',
    detail: 'A Persian envoy’s account, written for a court assessing a rival power.',
  },
  {
    id: 'krishnadevaraya',
    zoneId: 'hampi',
    label: 'Krishnadevaraya’s reign',
    year: 1509,
    displayDate: '1509–1529 CE',
    kind: 'political',
    detail: 'Campaigner, builder, and author of the Telugu Amuktamalyada.',
  },
  {
    id: 'panipat-1526',
    zoneId: 'agra',
    label: 'Babur wins the first battle of Panipat',
    year: 1526,
    displayDate: '1526 CE',
    kind: 'political',
    detail: 'Artillery and field tactics against a much larger Lodi army.',
  },
  {
    id: 'yuktibhasha',
    zoneId: 'konark',
    label: 'Jyeshthadeva writes the Yuktibhasha',
    year: 1530,
    displayDate: 'c. 1530 CE',
    kind: 'science',
    detail: 'In Malayalam, and it gives derivations rather than only results.',
  },
  {
    id: 'talikota',
    zoneId: 'hampi',
    label: 'The battle of Talikota',
    year: 1565,
    displayDate: '1565 CE',
    kind: 'political',
    detail: 'A coalition of Deccan sultanates breaks the Vijayanagara army; the capital is plundered.',
  },
  {
    id: 'humayun-tomb',
    zoneId: 'agra',
    label: 'Humayun’s Tomb is completed',
    year: 1570,
    displayDate: 'c. 1570 CE',
    kind: 'monument',
    detail: 'The first great garden tomb in India, and the Taj’s direct ancestor.',
  },
  {
    id: 'fatehpur-sikri',
    zoneId: 'agra',
    label: 'Fatehpur Sikri is built',
    year: 1571,
    displayDate: '1571–1585 CE',
    kind: 'monument',
    detail: 'Akbar’s red sandstone capital, abandoned within a generation.',
  },
  {
    id: 'ramcharitmanas',
    zoneId: 'kosala',
    label: 'Tulsidas composes the Ramcharitmanas',
    year: 1574,
    displayDate: 'c. 1574 CE',
    kind: 'cultural',
    detail: 'In Awadhi — the version most north Indian households mean by "Ramayana".',
  },
  {
    id: 'haldighati',
    zoneId: 'maratha',
    label: 'The battle of Haldighati',
    year: 1576,
    displayDate: '1576 CE',
    kind: 'political',
    detail: 'Maharana Pratap against Mughal forces under Man Singh; tactically inconclusive.',
  },
  {
    id: 'ain-i-akbari',
    zoneId: 'agra',
    label: 'Abu’l Fazl compiles the Ain-i-Akbari',
    year: 1590,
    displayDate: 'c. 1590 CE',
    kind: 'cultural',
    detail: 'An administrative gazetteer: ranks, revenue, crop prices, customs.',
  },
  {
    id: 'taj-mahal',
    zoneId: 'agra',
    label: 'The Taj Mahal is built',
    year: 1632,
    displayDate: '1632–1653 CE',
    kind: 'monument',
    detail: 'For Mumtaz Mahal, who died in 1631. Makrana marble, a double dome, a charbagh.',
  },
  {
    id: 'pratapgad',
    zoneId: 'maratha',
    label: 'Shivaji defeats Afzal Khan at Pratapgad',
    year: 1659,
    displayDate: '1659 CE',
    kind: 'political',
    detail: 'A much larger force drawn into the ghats and destroyed in close country.',
  },
  {
    id: 'shivaji-crowned',
    zoneId: 'maratha',
    label: 'Shivaji is crowned Chhatrapati at Raigad',
    year: 1674,
    displayDate: '6 June 1674',
    kind: 'political',
    detail: 'A formal sovereign state with the Ashta Pradhan council of eight ministers.',
  },
  {
    id: 'jizya-reimposed',
    zoneId: 'agra',
    label: 'Aurangzeb reimposes the jizya',
    year: 1679,
    displayDate: '1679 CE',
    kind: 'political',
    detail: 'Reversing Akbar’s abolition — a reminder that tolerance by decree is reversible by decree.',
  },
  {
    id: 'angre',
    zoneId: 'maratha',
    label: 'Kanhoji Angre commands the Maratha fleet',
    year: 1700,
    displayDate: 'c. 1698–1729 CE',
    kind: 'political',
    detail: 'As Sarkhel he holds the Konkan coast against Portuguese, Dutch and English squadrons.',
  },
  {
    id: 'jantar-mantar',
    zoneId: 'konark',
    label: 'Sawai Jai Singh II builds the Jantar Mantars',
    year: 1727,
    displayDate: '1724–1734 CE',
    kind: 'science',
    detail: 'Masonry instruments built after comparing Indian, Islamic and European tables.',
  },
  {
    id: 'panipat-1761',
    zoneId: 'maratha',
    label: 'The third battle of Panipat',
    year: 1761,
    displayDate: '1761 CE',
    kind: 'political',
    detail: 'A catastrophic Maratha defeat, driven as much by supply lines as by fighting.',
  },
  {
    id: 'ahilyabai',
    zoneId: 'maratha',
    label: 'Ahilyabai Holkar rules from Maheshwar',
    year: 1767,
    displayDate: '1767–1795 CE',
    kind: 'political',
    detail: 'Roads, wells, ghats and temples from Varanasi to Somnath.',
  },
  {
    id: 'anglo-maratha-end',
    zoneId: 'maratha',
    label: 'The last Anglo-Maratha war ends',
    year: 1818,
    displayDate: '1818 CE',
    kind: 'political',
    detail: 'Siege artillery and company finance end the fort system that cavalry never could.',
  },

  // ------------------------------------------------------------- modern
  {
    id: 'prinsep',
    zoneId: 'magadha',
    label: 'James Prinsep deciphers Brahmi',
    year: 1837,
    displayDate: '1837 CE',
    kind: 'discovery',
    detail: 'Using bilingual Indo-Greek coins; Ashoka’s edicts become readable again.',
  },
  {
    id: 'cuneiform-settled',
    zoneId: 'meluhha',
    label: 'Cuneiform decipherment is confirmed',
    year: 1857,
    displayDate: '1857 CE',
    kind: 'discovery',
    detail: 'Four scholars independently produce near-identical translations of the same text.',
  },
  {
    id: 'harappa-found',
    zoneId: 'sindhu',
    label: 'Harappa is excavated by Daya Ram Sahni',
    year: 1921,
    displayDate: '1921 CE',
    kind: 'discovery',
    detail: 'The first of the great Indus sites to be recognised for what it was.',
  },
  {
    id: 'mohenjodaro-found',
    zoneId: 'sindhu',
    label: 'Mohenjo-daro is excavated by R. D. Banerji',
    year: 1922,
    displayDate: '1922 CE',
    kind: 'discovery',
    detail: 'Within a year it is clear that this is a civilisation, not a city.',
  },
  {
    id: 'lion-capital',
    zoneId: 'magadha',
    label: 'The Sarnath lion capital is adopted as India’s state emblem',
    year: 1950,
    displayDate: '26 January 1950',
    kind: 'cultural',
    detail: 'An Ashokan sculpture becomes the emblem of the Republic.',
  },
  {
    id: 'dholavira-unesco',
    zoneId: 'sindhu',
    label: 'Dholavira is inscribed as a World Heritage Site',
    year: 2021,
    displayDate: '2021 CE',
    kind: 'discovery',
    detail: 'Recognised for its water engineering in a near-desert landscape.',
  },
];

const BY_ID = new Map(TIMELINE.map((e) => [e.id, e]));

export function getEvent(id: string): TimelineEvent | undefined {
  return BY_ID.get(id);
}

export function eventsForZone(zoneId: string): TimelineEvent[] {
  return TIMELINE.filter((e) => e.zoneId === zoneId);
}

/** Sorted oldest first. */
export const TIMELINE_SORTED: TimelineEvent[] = [...TIMELINE].sort((a, b) => a.year - b.year);

/** Human-readable century label, e.g. "3rd century BCE". */
export function centuryLabel(year: number): string {
  if (year < 0) {
    const c = Math.ceil(-year / 100);
    return `${ordinal(c)} century BCE`;
  }
  const c = Math.ceil(year / 100);
  return `${ordinal(c)} century CE`;
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
