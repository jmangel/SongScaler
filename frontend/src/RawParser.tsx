interface ParsedChord {
  chordString?: string;
  length?: number;
  noChord?: boolean;
}
interface ParsedMeasure {
  chords: ParsedChord[];
};

let measures: ParsedMeasure[] = [];
let startRepeatLocation: number | null | undefined = null;
let endRepeatLocation: number | null | undefined = null;
let lastChord: string | null | undefined = null;
let codaLocation: number | null | undefined = null;
let segnoLocation: number | null | undefined = null;
let timeSignature: string | null | undefined = null;
let thirdEndingImminent = false;
let dcAlCodaImminent = false;
let dsAlCodaImminent = false;
let fineLocation: number | null | undefined = null;
let dcAlFineImminent = false;

function resetVars() {
  measures = [];
  startRepeatLocation = null;
  endRepeatLocation = null;
  lastChord = null;
  codaLocation = null;
  segnoLocation = null;
  timeSignature = null;
  thirdEndingImminent = false;
  dcAlCodaImminent = false;
  dsAlCodaImminent = false;
  fineLocation = null;
  dcAlFineImminent = false;
}

const rules = [
  { token: 'XyQ', description: 'Empty space' },
  { token: /\*\w/, description: 'Section marker' },
  { token: /<(.*?)>/, description: 'Comments inside carets', matchOperation: checkForRepeats },
  { token: /T(\d+)/, description: 'Time signature', matchOperation: setTimeSignature },
  { token: 'x', description: 'Repeat previous measure in current measure', operation: repeatLastMeasure },
  { token: 'Kcl', description: 'Repeat previous measure and create new measure', operation: repeatLastMeasureAndAddNew },
  { token: 'r|XyQ', description: 'Repeat previous two measures', operation: repeatLastTwoMeasures },
  { token: /Y+/, description: 'Vertical spacers' },
  { token: 'n', description: 'No Chord (N.C)', operation: pushNull },
  { token: 'p', description: 'Pause slash' },
  { token: 'U', description: 'Ending measure for player' },
  { token: 'S', description: 'Segno', operation: setSegnoLocation },
  { token: 'Q', description: 'Coda', operation: setCodaLocation },
  { token: '{', description: 'Start repeat marker', operation: setStartRepeatLocation },
  { token: '}', description: 'End repeat marker', operation: repeatEverythingToEndRepeatLocation },
  { token: 'LZ|', description: 'Bar line', operation: createNewMeasure },
  { token: '|', description: 'Bar line', operation: createNewMeasure },
  { token: 'LZ', description: 'Bar line', operation: createNewMeasure },
  { token: '[', description: 'Double bar start', operation: createNewMeasure },
  { token: ']', description: 'Double bar end', operation: repeatRemainingEndings },
  { token: /N(\d)/, description: 'Numbered endings', matchOperation: setEndRepeatLocation },
  { token: 'Z', description: 'Final bar line', operation: repeatRemainingEndings },
  { token: /[A-GW]{1}[\+\-\^\dhob#suadlt]*(\/[A-G][#b]?)?/, description: 'Chord', matchOperation: pushChordInMeasures }
];

//chord regex:
//  letters A-G and W (W is an invisible slash chord)
//  {1} only one of the aforementioned letters
//  followed by zero or more of these: + - ^ h o # b digit
//  followed by an optional group (to catch slash chords)
//    that starts with a slash
//    followed by A-G
//    followed by optional # or b

function checkForRepeats(match: RegExpMatchArray) {
  if (match[1].toLowerCase() === 'd.c. al 3rd ending') {
    thirdEndingImminent = true;
  }
  if (match[1].toLowerCase() === 'd.c. al fine') {
    dcAlFineImminent = true;
  }
  if (match[1].toLowerCase() === 'd.c. al coda') {
    dcAlCodaImminent = true;
  }
  if (match[1].toLowerCase() === 'd.s. al coda') {
    dsAlCodaImminent = true;
  }
  if (match[1].toLowerCase() === 'fine') {
    fineLocation = measures.length;
  }
}

function setTimeSignature(match: RegExpMatchArray) {
  timeSignature = match[1];
}

function pushNull() {
  if (measures.length === 0) measures.push({ chords: [] });
  measures[measures.length - 1].chords.push({ noChord: true });
}

function repeatLastMeasure() {
  measures[measures.length - 1] = measures[measures.length - 2];
}

function repeatLastMeasureAndAddNew() {
  measures[measures.length] = measures[measures.length - 1];
}

function repeatLastTwoMeasures() {
  measures[measures.length - 1] = measures[measures.length - 3];
  measures[measures.length] = measures[measures.length - 2];
}

function setStartRepeatLocation() {
  createNewMeasure();
  startRepeatLocation = measures.length - 1;
  endRepeatLocation = null;
}

function setEndRepeatLocation(match: RegExpMatchArray) {
  //if the ending is N1, set that as the end of the repeat, because next time around we go to N2
  const ending = parseInt(match[1]);
  if (ending === 1) {
    endRepeatLocation = measures.length - 1;
  }
}

function setSegnoLocation() {
  segnoLocation = measures.length - 1;
}

function setCodaLocation() {
  codaLocation = measures.length;
}

function createNewMeasure() {
  //unless the last measure is a blank, insert a new blank measure
  if (measures.length === 0 || measures[measures.length - 1].chords.length !== 0) {
    measures.push({chords: []});
  }
}

function repeatEverythingToEndRepeatLocation() {
  if (!endRepeatLocation) {
    endRepeatLocation = measures.length;
  }
  measures.push(...measures.slice(startRepeatLocation || undefined, endRepeatLocation));
  createNewMeasure();
}

function repeatRemainingEndings() {
  if (thirdEndingImminent) {
    repeatEverythingToEndRepeatLocation();
    thirdEndingImminent = false;
  }
  if (dcAlFineImminent) {
    measures.push(...measures.slice(0, fineLocation  || undefined));
    dcAlFineImminent = false;
  }
  if (dcAlCodaImminent) {
    measures.push(...measures.slice(0, codaLocation  || undefined));
    dcAlCodaImminent = false;
  }
  if (dsAlCodaImminent) {
    measures.push(...measures.slice(segnoLocation  || undefined, codaLocation  || undefined));
    dsAlCodaImminent = false;
  }
}

function pushChordInMeasures(match: RegExpMatchArray) {
  if (measures.length === 0) measures.push({chords: []});

  let chord = match[0];
  if (chord.startsWith('W') && lastChord) {
    chord = chord.replace('W', lastChord)
  } else {
    lastChord = chord.split('/')[0];
  }
  measures[measures.length - 1].chords.push({ chordString: chord })
}

function parse(inputString: string) {
  // loop through the rules until one of them applies to the beginning of the string
  // chop off the match and parse again

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (typeof rule.token === 'string' && inputString.startsWith(rule.token)) {
      if (rule.operation) rule.operation();
      parse(inputString.substring(rule.token.length).trim());
      break;
    } else if (rule.token instanceof RegExp) {
      const match = inputString.match(rule.token);
      if (match && match.index === 0) {
        if (rule.matchOperation) rule.matchOperation(match);
        parse(inputString.substring(match[0].length).trim());
        break;
      }
    }
    if (i === rules.length - 1 && inputString.length > 1) {
      // we got to the last rule and no rule applied
      // trim off one character and parse again
      parse(inputString.substring(1));
    }
  }
}
function removeEmptyMeasures(measures: ParsedMeasure[]){
  return measures.filter(m => m.chords.length !== 0)
}

const rawToSong = (raw: string) => {
  resetVars();
  parse(raw);
  return { measures: removeEmptyMeasures(measures), timeSignature, raw };
}

export default rawToSong;