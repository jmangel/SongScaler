import React from 'react';
import { ChordRowObject } from './ChordRow';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import './CustomPianoStyles.css'
import { CHROMATIC_NOTES } from './ChordMapper';

interface KeyboardConfigEntry {
  natural: string;
  flat: string;
  sharp: string;
}

const baseKeyboardConfig: KeyboardConfigEntry[] = [
  { natural: 'c', flat: 'cb', sharp: 'c#' },
  { natural: 'd', flat: 'db', sharp: 'd#' },
  { natural: 'e', flat: 'eb', sharp: 'e#' },
  { natural: 'f', flat: 'fb', sharp: 'f#' },
  { natural: 'g', flat: 'gb', sharp: 'g#' },
  { natural: 'a', flat: 'ab', sharp: 'a#' },
  { natural: 'b', flat: 'bb', sharp: 'b#' },
]

const keyboardConfigForScaleNotes = (scaleNotes: string[]): KeyboardConfigEntry[] => {
  const enharmonicScaleNotes: Record<string, string> = {};

  scaleNotes.forEach((value) => {
    CHROMATIC_NOTES.find(enharmonicNotes =>
      enharmonicNotes.includes(value)
    )?.forEach((chromaticNote) =>
      enharmonicScaleNotes[chromaticNote.toLowerCase()] = value.toLowerCase()
    );
  })

  return baseKeyboardConfig.map((entry) => {
    const entryClone: KeyboardConfigEntry = Object.assign({}, entry);
    Object.entries(entry).forEach((keyEntry) => {
      const key = keyEntry[0] as keyof KeyboardConfigEntry;
      const value = keyEntry[1] as string;

      entryClone[key] = enharmonicScaleNotes[value] || ''
    })
    return entryClone;
  })
}

const ChordPianoVisualization: React.FC<{
  chordRowObject: ChordRowObject,
}> = ({
  chordRowObject,
}) => {
  const { selectedScaleObject } = chordRowObject;

  const scaleNotes = selectedScaleObject?.scaleNotes || [];
  const lowerChordTones = [
    scaleNotes[0],
    scaleNotes[2],
    scaleNotes[4],
    scaleNotes[6] || scaleNotes[scaleNotes.length - 1],
  ].filter((element) => !!element) as string[];

  const firstNote = MidiNumbers.fromNote('c4');
  const lastNote = MidiNumbers.fromNote('b4');

  // customize indicators here
  const pressedNotes: string[] = lowerChordTones;
  const labeledNotes: string[] = scaleNotes;

  const activeNotes = pressedNotes.map((scaleNote) => MidiNumbers.fromNote(`${scaleNote}4`));

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: keyboardConfigForScaleNotes(labeledNotes),
  });

  return (
    <Piano
      noteRange={{ first: firstNote, last: lastNote }}
      playNote={() => {}}
      stopNote={() => {}}
      keyboardShortcuts={keyboardShortcuts}
      activeNotes={activeNotes}
    />
  );

}

export default ChordPianoVisualization;
