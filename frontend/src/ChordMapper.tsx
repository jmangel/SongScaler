export const CHROMATIC_NOTES = [
  ['A'],
  ['A#', 'Bb'],
  ['B'],
  ['C'],
  ['C#', 'Db'],
  ['D'],
  ['D#', 'Eb'],
  ['E'],
  ['F'],
  ['F#', 'Gb'],
  ['G'],
  ['G#', 'Ab'],
]

const enum NamedNote {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
};
const NAMED_NOTES: Array<NamedNote> = [
  NamedNote.A,
  NamedNote.B,
  NamedNote.C,
  NamedNote.D,
  NamedNote.E,
  NamedNote.F,
  NamedNote.G,
];

const NOTE_SEMITONES = {
  'A': 2,
  'B': 2,
  'C': 1,
  'D': 2,
  'E': 2,
  'F': 1,
  'G': 2,
}

interface Interval {
  degree: number;
  quality: string;
  semitones: number;
}
const INTERVALS = [
  {
    degree: 1,
    quality: 'perfect',
    semitones: 0,
  },
  {
    degree: 2,
    quality: 'minor',
    semitones: 1,
  },
  {
    degree: 2,
    quality: 'major',
    semitones: 2,
  },
  {
    degree: 3,
    quality: 'minor',
    semitones: 3,
  },
  {
    degree: 3,
    quality: 'major',
    semitones: 4,
  },
  {
    degree: 4,
    quality: 'perfect',
    semitones: 5,
  },
  {
    degree: 4,
    quality: 'augmented',
    semitones: 6,
  },
  {
    degree: 5,
    quality: 'diminished',
    semitones: 6,
  },
  {
    degree: 5,
    quality: 'perfect',
    semitones: 7,
  },
  {
    degree: 5,
    quality: 'augmented',
    semitones: 8,
  },
  {
    degree: 6,
    quality: 'minor',
    semitones: 8,
  },
  {
    degree: 6,
    quality: 'major',
    semitones: 9,
  },
  {
    degree: 7,
    quality: 'diminished',
    semitones: 9,
  },
  {
    degree: 7,
    quality: 'minor',
    semitones: 10,
  },
  {
    degree: 7,
    quality: 'major',
    semitones: 11,
  },
]

export enum PossibleRootScale {
  m = 'major',
  hm = 'harmonic minor',
  mm = 'melodic minor',
  d = 'diminished',
  wt = 'whole-tone',
};

export const POSSIBLE_ROOT_SCALE_MAPPINGS: { [key: string]: string } = {
  'major': 'm',
  'harmonic minor': 'hm',
  'melodic minor': 'mm',
  'diminished': 'd',
  'whole-tone': 'wt',
}

export const ROOT_SCALE_READABLE_SHORTENINGS: { [key: string]: string } = {
  'major': 'maj',
  'harmonic minor': 'harm. min',
  'melodic minor': 'mel. min',
  'diminished': 'dim',
  'whole-tone': 'whole-tone',
}

interface ScaleDegree {
  degree: number;
  quality: string | null;
}
interface Scale {
  name: string;
  degrees: Array<ScaleDegree>;
}
const PRIMARY_SCALES = [
  {
    name: PossibleRootScale.m,
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'major',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'perfect',
      },
      {
        degree: 6,
        quality: 'major',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: PossibleRootScale.mm,
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'minor',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'perfect',
      },
      {
        degree: 6,
        quality: 'major',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: PossibleRootScale.hm,
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'minor',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'perfect',
      },
      {
        degree: 6,
        quality: 'minor',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: PossibleRootScale.d,
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'minor',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'diminished',
      },
      {
        degree: 6,
        quality: 'minor',
      },
      {
        degree: 7,
        quality: 'diminished',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: PossibleRootScale.wt,
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'major',
      },
      {
        degree: 4,
        quality: 'augmented',
      },
      {
        degree: 5,
        quality: 'augmented',
      },
      {
        degree: 6,
        quality: null,
      },
      {
        degree: 7,
        quality: 'minor',
      },
    ],
  },
]

export interface Mode {
  name: string;
  relatedScale: {
    name: PossibleRootScale;
    startingDegree: number;
  };
}
export const MODES: Array<Mode> = [
  {
    name: 'ionian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 1,
    },
  },
  {
    name: 'dorian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 2,
    },
  },
  {
    name: 'phrygian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 3,
    },
  },
  {
    name: 'lydian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 4,
    },
  },
  {
    name: 'mixolydian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 5,
    },
  },
  {
    name: 'aeolian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 6,
    },
  },
  {
    name: 'locrian',
    relatedScale: {
      name: PossibleRootScale.m,
      startingDegree: 7,
    },
  },
  {
    name: PossibleRootScale.mm,
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 1,
    },
  },
  {
    name: 'dorian b9',
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 2,
    },
  },
  {
    name: 'lydian augmented',
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 3,
    },
  },
  {
    name: 'lydian dominant',
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 4,
    },
  },
  {
    name: 'mixolydian b13',
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 5,
    },
  },
  {
    name: 'locrian 2/half-dim',
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 6,
    },
  },
  {
    name: 'altered',
    relatedScale: {
      name: PossibleRootScale.mm,
      startingDegree: 7,
    },
  },
  {
    name: PossibleRootScale.hm,
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 1,
    },
  },
  {
    name: 'locrian #6',
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 2,
    },
  },
  {
    name: 'major #5',
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 3,
    },
  },
  {
    name: 'dorian #4',
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 4,
    },
  },
  {
    name: 'phrygian dominant',
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 5,
    },
  },
  {
    name: 'lydian #2',
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 6,
    },
  },
  {
    name: 'alt dom bb7',
    relatedScale: {
      name: PossibleRootScale.hm,
      startingDegree: 7,
    },
  },
  {
    name: 'w/h diminished',
    relatedScale: {
      name: PossibleRootScale.d,
      startingDegree: 1,
    },
  },
  {
    name: 'h/w diminished',
    relatedScale: {
      name: PossibleRootScale.d,
      startingDegree: 6,
    },
  },
  {
    name: PossibleRootScale.wt,
    relatedScale: {
      name: PossibleRootScale.wt,
      startingDegree: 1,
    },
  },
]

interface RelativeMode {
  name: string;
  offset: number;
  notes?: Array<string>;
}
interface ChordMapping {
  quality: string;
  possibleModes: Array<RelativeMode>;
}
const MINOR_MODES = [
  {
    name: 'aeolian',
    offset: 0,
  },
  {
    name: 'dorian',
    offset: 0,
  },
  {
    name: 'phrygian',
    offset: 0,
  },
  {
    name: 'dorian #4',
    offset: 0,
  },
];
const MAJOR_MODES = [
  {
    name: 'ionian',
    offset: 0,
  },
  {
    name: 'lydian',
    offset: 0,
  },
  {
    name: 'lydian #2',
    offset: 0,
  },
]
const MINOR_MAJOR_MODES = [
  {
    name: PossibleRootScale.mm,
    offset: 0,
  },
  {
    name: PossibleRootScale.hm,
    offset: 0,
  },
]
const AUGMENTED_MODES: Array<RelativeMode> = [
  {
    name: PossibleRootScale.wt,
    offset: 0,
  },
  {
    name: 'altered',
    offset: 0,
    notes: [
      'musicians often prefer to substitute alt chord',
    ]
  },
]
const MAJOR_SHARP_FIVE_MODES: Array<RelativeMode> = [
  {
    name: 'lydian augmented',
    offset: 0,
  },
  {
    name: 'major #5',
    offset: 0,
  },
]
const HALF_DIMINISHED_MODES: Array<RelativeMode> = [
  {
    name: 'locrian',
    offset: 0,
  },
  {
    name: 'locrian 2/half-dim',
    offset: 0,
  },
  {
    name: 'locrian #6',
    offset: 0,
  },
]
const SUS_MODES: Array<RelativeMode> = [
  {
    name: 'mixolydian',
    offset: 0,
  },
]
const CHORD_MAPPINGS = [
  {
    quality: '-',
    possibleModes: MINOR_MODES
  },
  {
    quality: '-7',
    possibleModes: MINOR_MODES
  },
  {
    quality: '-11',
    possibleModes: MINOR_MODES.filter(({ name }) => name !== 'dorian #4')
  },
  {
    quality: '^',
    possibleModes: MAJOR_MODES,
  },
  {
    quality: '',
    possibleModes: MAJOR_MODES.concat([{
      name: 'mixolydian',
      offset: 0,
    }]),
  },
  {
    quality: '6',
    possibleModes: MAJOR_MODES,
  },
  {
    quality: '^7',
    possibleModes: MAJOR_MODES,
  },
  {
    quality: '7',
    possibleModes: [
      {
        name: 'mixolydian',
        offset: 0,
      },
      {
        name: 'h/w diminished',
        offset: 0,
      },
      {
        name: 'phrygian dominant', // == 'mixolydian b9 b13'
        offset: 0,
      },
      // could do altered for tritone sub, but the 5 doesn't fit
      // {
      //   name: 'altered', // for tritone sub
      //   offset: 0,
      // },
      {
        name: 'lydian dominant', // for tritone sub
        offset: 0,
        // this always works for tritone sub of V/ii
        // "If you imagine that the A7 is the “V of ii,”
        // meaning that you pretend the ii chord is a minor i chord, you
        // can draw the same conclusions about the note relationships of the
        // Eb7 and the A7. It’s the same concept. The Eb7 would imply an A7alt."
        // A7alt == Bb mm == Eb lydian dominant
      },
      {
        name: 'mixolydian b13', // for V7/ii instead of vi http://hubguitar.com/improv/dealing-with-secondary-dominants
        offset: 0,

      },
      {
        name: 'altered',
        offset: 0,
      },
      // according to iReal Pro
      {
        name: 'whole-tone', // #5 might clash
        offset: 0,
      },
    ]
  },
  {
    quality: '9',
    possibleModes: [
      {
        name: 'mixolydian',
        offset: 0,
      },
      // could do altered for tritone sub, but the 5 doesn't fit
      // {
      //   name: 'altered', // for tritone sub
      //   offset: 0,
      // },
      {
        name: 'lydian dominant', // for tritone sub
        offset: 0,
        // this always works for tritone sub of V/ii
        // "If you imagine that the A7 is the “V of ii,”
        // meaning that you pretend the ii chord is a minor i chord, you
        // can draw the same conclusions about the note relationships of the
        // Eb7 and the A7. It’s the same concept. The Eb7 would imply an A7alt."
        // A7alt == Bb mm == Eb lydian dominant
      },
      {
        name: 'mixolydian b13', // for V7/ii instead of vi http://hubguitar.com/improv/dealing-with-secondary-dominants
        offset: 0,
      },
      // according to iReal Pro
      {
        name: 'whole-tone', // #5 might clash
        offset: 0,
      },
    ]
  },
  {
    quality: 'add9',
    possibleModes: MAJOR_MODES.concat([{
      name: 'mixolydian',
      offset: 0,
    }]),
  },
  {
    quality: '11',
    possibleModes: [
      {
        name: 'mixolydian',
        offset: 0,
      },
    ]
  },
  {
    quality: '13',
    possibleModes: [
      {
        name: 'mixolydian',
        offset: 0,
      },
      {
        name: 'lydian dominant',
        offset: 0,
      },
    ]
  },
  {
    quality: 'sus',
    possibleModes: SUS_MODES
  },
  {
    quality: '7sus',
    possibleModes: SUS_MODES
  },
  {
    quality: 'sus7',
    possibleModes: SUS_MODES
  },
  {
    quality: '7b9sus',
    possibleModes: SUS_MODES.concat([{
      name: 'phrygian',
      offset: 0,
    }]),
  },
  {
    quality: 'sus7b9',
    possibleModes: SUS_MODES.concat([{
      name: 'phrygian',
      offset: 0,
    }]),
  },
  {
    quality: '9sus',
    possibleModes: SUS_MODES
  },
  {
    quality: 'sus9',
    possibleModes: SUS_MODES
  },
  {
    quality: '13sus',
    possibleModes: SUS_MODES
  },
  {
    quality: 'sus13',
    possibleModes: SUS_MODES
  },
  {
    quality: '7b13sus',
    possibleModes: {
      name: 'phrygian dominant', // == 'mixolydian b9 b13'
      offset: 0,
    },
  },
  {
    quality: 'sus7b13',
    possibleModes: {
      name: 'phrygian dominant', // == 'mixolydian b9 b13'
      offset: 0,
    },
  },
  {
    quality: 'susb9',
    possibleModes: [
      {
        name: 'phrygian',
        offset: 0,
      },
      {
        name: 'dorian b9',
        offset: 0,
      },
      // TODO: look into whether this should include phrygian dominant
    ]
  },
  {
    quality: 'h7',
    possibleModes: HALF_DIMINISHED_MODES
  },
  {
    quality: '-7b5',
    possibleModes: HALF_DIMINISHED_MODES
  },
  {
    quality: '-^7',
    possibleModes: MINOR_MAJOR_MODES
  },
  {
    quality: '-^',
    possibleModes: MINOR_MAJOR_MODES
  },
  {
    quality: '^#5',
    possibleModes: MAJOR_SHARP_FIVE_MODES
  },
  {
    quality: '^+',
    possibleModes: MAJOR_SHARP_FIVE_MODES
  },
  {
    quality: '^7#5',
    possibleModes: MAJOR_SHARP_FIVE_MODES
  },
  {
    quality: '^7+',
    possibleModes: MAJOR_SHARP_FIVE_MODES
  },
  {
    quality: '^7#11',
    possibleModes: [
      {
        name: 'lydian',
        offset: 0,
      },
    ]
  },
  {
    quality: '^9#11',
    possibleModes: [
      {
        name: 'lydian',
        offset: 0,
      },
    ]
  },
  {
    quality: '7#11',
    possibleModes: [
      {
        name: 'lydian dominant',
        offset: 0,
      },
    ]
  },
  {
    quality: '9#11',
    possibleModes: [
      {
        name: 'lydian dominant',
        offset: 0,
      },
    ]
  },
  {
    quality: '13#11',
    possibleModes: [
      {
        name: 'lydian dominant',
        offset: 0,
      },
    ]
  },
  {
    quality: '7b5',
    possibleModes: [
      {
        name: 'lydian dominant',
        offset: 0,
      },
      {
        name: 'altered',
        offset: 0,
      },
      {
        name: 'locrian 2/half-dim',
        offset: 0,
      },
      {
        name: 'whole-tone',
        offset: 0,
      },
    ]
  },
  {
    quality: '7b9',
    possibleModes: [
      {
        name: 'phrygian dominant',
        offset: 0,
      },
      {
        name: 'h/w diminished',
        offset: 0,
      },
      {
        name: 'altered', // #5 might clash
        offset: 0,
      },
    ]
  },
  {
    quality: '7#9',
    possibleModes: [
      {
        name: 'h/w diminished',
        offset: 0,
      },
      {
        name: 'altered',
        offset: 0,
      },
    ]
  },
  {
    quality: '7b13',
    possibleModes: [
      {
        name: 'mixolydian b13',
        offset: 0,
      },
      {
        name: 'altered', // b13 often implies alt
        offset: 0,
      },
      ...AUGMENTED_MODES.map((possibleMode) => {
        return {
          ...possibleMode,
          notes: (possibleMode.notes || [])
            .concat(
              '7b13 sometimes dangerously used to notate a 7#5'
            ),
        }
      }),
    ]
  },
  {
    quality: '7b9b13',
    possibleModes: [
      {
        name: 'altered', // b13 often implies alt
        offset: 0,
      },
      {
        name: 'phrygian dominant', // == 'mixolydian b9 b13'
        offset: 0,
      },
    ]
  },
  {
    quality: '7#5',
    possibleModes: AUGMENTED_MODES
  },
  {
    quality: '7+',
    possibleModes: AUGMENTED_MODES
  },
  {
    quality: 'o',
    possibleModes: [
      {
        name: 'w/h diminished',
        offset: 0,
      },
      {
        name: 'alt dom bb7',
        offset: 0,
      }
    ]
  },
  {
    quality: '7alt',
    possibleModes: [
      {
        name: 'altered',
        offset: 0,
      },
    ]
  },
]

export const lowerChordToneIntervalInSemitones = (chordQuality: string) => {
  const thirdSemitones = (new RegExp(/sus/)).test(chordQuality) ? 5 : (new RegExp(/-|o|h/)).test(chordQuality) ? 3 : 4;
  // do we need to handle when the scale selected has a clashing implied 5? ie, altered scale over 7b9
  const fifthSemitones = (new RegExp(/o|h|b5/)).test(chordQuality) ? 6 : (new RegExp(/#5|\+/)).test(chordQuality) ? 8 : 7;
  const seventhSemitones = (new RegExp(/\^/)).test(chordQuality) ? 11 : (new RegExp(/o|6/)).test(chordQuality) ? 9 : 10;

  return [
    0,
    thirdSemitones,
    fifthSemitones,
    seventhSemitones,
  ];
}

export const lowerChordTones = (chordNote: string, chordQuality: string) => {
  const semitoneIntervals = lowerChordToneIntervalInSemitones(chordQuality);

  const chromaticTonic = toChromaticNote(chordNote);
  const chromaticTonicIndex = CHROMATIC_NOTES.findIndex(enharmonics => enharmonics.includes(chromaticTonic));

  return semitoneIntervals.map((semitoneInterval) => {
    return toChromaticNote(CHROMATIC_NOTES[(chromaticTonicIndex + semitoneInterval) % 12][0]);
  })
}

export function arrayRotate<T>(arr: Array<T>, index: number): Array<T> {
  const emptyArray: Array<T> = [];
  const clone = emptyArray.concat(arr)

  for (let i = 0; i < index; i++) {
    const firstElement = clone.shift();
    if (firstElement) clone.push(firstElement);
  }
  return clone;
}

const flatten = (arr: Array<any>): Array<any> => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(toFlatten);
  }, []);
}

export const countSharpsAndFlats = (chordNote: string): number => {
  return chordNote.split('#').length - chordNote.split('b').length;
}

const relativeNatural = (chordNote: string): string => {
  return chordNote.split('#')[0].split('b')[0];
}

export const toChromaticNote = (note: string): string => {
  const relativeNaturalIndex = CHROMATIC_NOTES.findIndex(enharmonics => enharmonics.includes(relativeNatural(note)));
  const chromaticNoteIndex = (relativeNaturalIndex + countSharpsAndFlats(note) + 12) % 12;
  const chromaticNoteEnharmonics = CHROMATIC_NOTES[chromaticNoteIndex];
  return chromaticNoteEnharmonics[0];
}

export const countSemitonesBetween = (rootNote: string, intervalNote: string): number => {
  const rootNoteIndex = NAMED_NOTES.findIndex((note) => rootNote.includes(note));
  const rotatedNamedNotes = arrayRotate(NAMED_NOTES, rootNoteIndex);

  const interval = rotatedNamedNotes.findIndex((note) => intervalNote.includes(note));

  const intervalsToSum = rotatedNamedNotes.splice(1, interval);
  const naturalSemitonesBetween = intervalsToSum.reduce((sum, interval) => sum + NOTE_SEMITONES[interval], 0);

  let semitoneDifference = naturalSemitonesBetween + countSharpsAndFlats(intervalNote) - countSharpsAndFlats(rootNote);
  if (semitoneDifference < 0) semitoneDifference += 12;

  return semitoneDifference % 12;
}

const createScaleForRelativeMode = (
  chordNote: string,
  possibleMode: RelativeMode,
  availableTensions: string,
  bassNote?: string
): Array<NamedScale | null> => {
  const mode = MODES.find((mode: Mode) => mode.name == possibleMode.name);
  if (mode == undefined) throw new Error(`primaryScale not found ${possibleMode.name}`);

  const primaryScale = PRIMARY_SCALES.find((scale: Scale) => scale.name == mode.relatedScale.name)
  if (primaryScale == undefined) throw new Error(`primaryScale not found ${mode.relatedScale.name}`);

  const startingDegree = mode.relatedScale.startingDegree

  // does not need to support whole-tone because it has only one mode
  // TODO: support diminished for breaking starting degrees?
  // currently doesn't "need" to support diminished because it has no
  // breaking modes
  const rootDegreeFinderArray: Array<number> = [...Array(primaryScale.degrees.length).keys()].map((i) => i + 1)
  rootDegreeFinderArray.push(rootDegreeFinderArray.shift() as number)
  rootDegreeFinderArray.reverse()

  const rootDegree = rootDegreeFinderArray[startingDegree - 1]

  const modeDegrees = arrayRotate(primaryScale.degrees, (startingDegree - 1))
  let startingSemitones: number | null = null;
  let modeIntervalsSemitones = modeDegrees.map((modeDegree) => {
    if (modeDegree.quality === null) return null;

    const semitones = INTERVALS.find((interval: Interval): boolean => {
      return interval.degree === modeDegree.degree && interval.quality === modeDegree.quality
    })?.semitones
    if (semitones == undefined) throw new Error(`semitones not found ${modeDegree.degree}${modeDegree.quality}`);

    startingSemitones = startingSemitones == null ? semitones : startingSemitones;

    let modulodSemitones = (semitones - startingSemitones) % 12
    if (modulodSemitones < 0) modulodSemitones += 12;
    return modulodSemitones
  })

  const rootScale = createScaleForMode(
    chordNote,
    possibleMode.name,
    possibleMode?.notes || [],
    mode,
    modeDegrees,
    modeIntervalsSemitones,
    rootDegree,
    availableTensions,
    bassNote
  );
  if (rootScale && bassNote) {
    let bassNoteScale = null;
    if (bassNote) {
      const bassNoteScaleDegreeOffset = modeIntervalsSemitones.indexOf(countSemitonesBetween(chordNote, bassNote));
      if (bassNoteScaleDegreeOffset < 0) return [null];

      const relatedScale = mode.relatedScale;

      let bassNoteStartingDegree = (relatedScale.startingDegree + bassNoteScaleDegreeOffset)
      if (bassNoteStartingDegree > primaryScale.degrees.length) bassNoteStartingDegree -= primaryScale.degrees.length

      const modeDegrees = arrayRotate(primaryScale.degrees, (bassNoteStartingDegree - 1))
      let startingSemitones: number | null = null;
      modeIntervalsSemitones = modeDegrees.map((modeDegree) => {
        if (modeDegree.quality === null) return null;

        const semitones = INTERVALS.find((interval: Interval): boolean => {
          return interval.degree === modeDegree.degree && interval.quality === modeDegree.quality
        })?.semitones

        if (semitones == undefined) throw new Error(`semitones not found ${modeDegree.degree}${modeDegree.quality}`);

        startingSemitones = startingSemitones == null ? semitones : startingSemitones;

        let modulodSemitones = (semitones - startingSemitones) % 12
        if (modulodSemitones < 0) modulodSemitones += 12;
        return modulodSemitones
      })

      const bassNoteMode = MODES.find((m: Mode) => {
        return m.relatedScale.name == relatedScale.name &&
          m.relatedScale.startingDegree == bassNoteStartingDegree;
      })

      if (bassNoteMode) bassNoteScale = createScaleForMode(
        bassNote,
        bassNoteMode.name,
        [],
        bassNoteMode,
        modeDegrees,
        modeIntervalsSemitones,
        bassNoteStartingDegree,
        availableTensions,
        chordNote,
        rootScale.rootScaleNote
      );
    }
    return [rootScale, bassNoteScale];
  }

  return [rootScale]
};

const createScaleForMode = (
  chordNote: string,
  scaleName: string,
  notes: Array<string>,
  mode: Mode,
  modeDegrees: Array<{degree: number; quality: string | null}>,
  modeIntervalsSemitones: Array<number | null>,
  rootDegree: number,
  availableTensions: string,
  bassNote?: string,
  rootScaleNote?: string,
): NamedScale | null => {
  const namedNoteIndex = NAMED_NOTES.findIndex((note: NamedNote): boolean => chordNote.includes(note))
  const rotatedNamedNotes = arrayRotate(NAMED_NOTES, namedNoteIndex);

  if (bassNote) {
    const bassNoteScaleDegreeOffset = modeIntervalsSemitones.indexOf(countSemitonesBetween(chordNote, bassNote));
    if (bassNoteScaleDegreeOffset < 0) return null;
  }

  if (availableTensions.split(',').filter((availableTension: string) => availableTension !== '').some((availableTension: string) => {
    const availableTensionScaleDegreeOffset = modeIntervalsSemitones.indexOf(countSemitonesBetween(chordNote, availableTension));
    return (availableTensionScaleDegreeOffset < 0);
  })) return null;

  let previousSharps = 0
  let cumulativeSemitones = 0

  let index = 0
  let scaleNotes: Array<string> = []
  rotatedNamedNotes.forEach((namedNote: NamedNote) => {
    if (index == 0) {
      previousSharps = countSharpsAndFlats(chordNote);

      index += 1;
      scaleNotes.push(chordNote)
      return
    }

    let naturalSemitones = NOTE_SEMITONES[namedNote];

    const modeDegree = modeDegrees[index]
    const modeDegreeNotes = modeDegrees.filter((extraModeDegree) => extraModeDegree.degree === modeDegree.degree)
    modeDegreeNotes.forEach(() => {
      const desiredSemitones = modeIntervalsSemitones[index]
      if (desiredSemitones === null) {
        cumulativeSemitones += naturalSemitones
        return index += 1;
      }

      previousSharps = previousSharps + (desiredSemitones - (cumulativeSemitones + naturalSemitones))
      cumulativeSemitones = desiredSemitones

      naturalSemitones = 0

      let accidental: string = (previousSharps < 0) ? 'b' : '#'
      let accidentals: number = Math.abs(previousSharps)

      index += 1;
      scaleNotes.push(namedNote + accidental.repeat(accidentals))
    })
  })

  return {
    scaleName,
    scaleNotes,
    rootScale: mode.relatedScale.name,
    rootScaleNote: rootScaleNote || scaleNotes[rootDegree - 1],
    notes,
  }
};

export interface NamedScale {
  scaleName: string;
  scaleNotes: Array<string>;
  rootScale: PossibleRootScale;
  rootScaleNote: string;
  notes: Array<string>;
}
const scalesForChord = (chordNote: string, chordQuality: string, bassNote?: string, availableTensions?: string): Array<NamedScale> => {
  const possibleModes = CHORD_MAPPINGS.find((chord: ChordMapping) => chord.quality == chordQuality)?.possibleModes || []
  const unflattenedScales = possibleModes.map((possibleMode) => {
    return createScaleForRelativeMode(chordNote, possibleMode, availableTensions || '', bassNote);
  })

  return flatten(unflattenedScales).filter((element) => element !== null) as Array<NamedScale>;
}

export default scalesForChord;