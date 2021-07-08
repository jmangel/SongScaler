import React, { ChangeEvent, useEffect, useRef, useState, Fragment } from 'react';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import {
  useQueryParams,
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from 'use-query-params';
// import { SketchPicker } from 'react-color';
import { MdCheck, MdHome, MdKeyboardArrowLeft } from 'react-icons/md';
import useSound from 'use-sound';

import './App.css';
import ChordCarousel from './ChordCarousel';
import parseChordString from './ChordParser';
import { ChordRowObject, ChordRowObjectRequiredKeys, scalesForChordRowObject } from './ChordRow'
// import ColorWheel from './ColorWheel';
import Steps, { Step } from './Steps'
import New from './Steps/New';
import ChooseKey, { TransposingKeys } from './Steps/ChooseKey';
import Edit from './Steps/Edit';
import { parseStringifiedChordRowObject, csvifyChordRowObjects, parseCsvifiedChordRowObjects } from './JsonCondenser'
import { MonochromaticPossibleRootScale, regenerateMonochromaticSchemes } from './ScaleColorer';
import { arrayRotate, CHROMATIC_NOTES, PossibleRootScale } from './ChordMapper';
import PlayAlong from './Steps/PlayAlong';
import PlaybackControls from './PlayAlong/PlaybackControls';
import { myRealReader } from './RawParser';

import Worker from "worker-loader!./MetronomeWebWorker.js";
import { csvifyMeasureInfos, parseCsvifiedMeasureInfos, createMeasureInfo } from './MeasureCondenser';
import SidebarMenu from './SidebarMenu';

const metronomeTicker = new Worker();

const HighClickFile = 'static/AudioClips/high_click.mp3';
const LowClickFile = 'static/AudioClips/low_click.mp3';

const defaultBpm = 100;

const createChordRowObject = (): ChordRowObject => {
  return { chordQuality: '' } as ChordRowObject;
}

interface Song {
  title: string;
  key?: string;
  bpm?: number;
  music: {
    measures: Array<Array<string>>;
    raw: string;
  };
};
const createSongObject = (title: string | null): Song => {
  return { title } as Song;
}

const transposeNote = (note: string, offset: number): string => {
  const chromatic_note_index = CHROMATIC_NOTES.findIndex(chromaticNoteArray => chromaticNoteArray.includes(note));
  if (chromatic_note_index < 0) return note;

  const tranposedNote = CHROMATIC_NOTES[(12 + chromatic_note_index + offset) % 12][0];

  return tranposedNote;
}

export interface MeasureInfo {
  beatsPerMeasure: number;
  subdivisions: number;
  chordCount: number;
}

const beatsConsumedByMeasure = ({ beatsPerMeasure }: MeasureInfo): number => {
  return beatsPerMeasure;
}

export const beatIndexToMeasureIndex = (measureInfos: MeasureInfo[], beatIndex: number): number => {
  if (beatIndex < 0) return -1;
  let runningBeatIndex = 0;
  return measureInfos.findIndex((measureInfo: MeasureInfo) => {
    runningBeatIndex += beatsConsumedByMeasure(measureInfo);
    return beatIndex < runningBeatIndex;
  })
}

export const beatIsOnNewMeasure = (measureInfos: MeasureInfo[], beatIndex: number): boolean => {
  if (beatIndex === 0) return true;
  let runningBeatIndex = 0;
  return measureInfos.some((measureInfo: MeasureInfo) => {
    runningBeatIndex += beatsConsumedByMeasure(measureInfo);
    return beatIndex === runningBeatIndex;
  })
}

const selectedScaleObject = (chordRowObject: ChordRowObject) => {
  const scales = scalesForChordRowObject(chordRowObject);
  return scales.find((namedScale) => namedScale.scaleName === chordRowObject.selectedScale && (
    namedScale.scaleNotes[0] === (chordRowObject.selectedScaleRoot || chordRowObject.chordNote)
  ));
}

const App: React.FC = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  }

  const [query, setQuery] = useQueryParams({
    a: withDefault(ArrayParam, undefined),
    c: withDefault(StringParam, csvifyChordRowObjects([createChordRowObject()])),
    t: withDefault(StringParam, ''),
    i: withDefault(NumberParam, -1),
    s: withDefault(NumberParam, 0),
    m: withDefault(StringParam, csvifyMeasureInfos([createMeasureInfo()])),
    k: withDefault(StringParam, '0'),
    b: withDefault(NumberParam, defaultBpm),
  });
  const { a, c, t, i, s, m, k, b } = query;

  const startingChordRowObjects = (c) ? parseCsvifiedChordRowObjects(c) : (a as Array<string> || []).map(parseStringifiedChordRowObject);
  const processedChordRowObjects = startingChordRowObjects.map((chordRowObject) => {
    chordRowObject.selectedScaleObject = selectedScaleObject(chordRowObject);
    return chordRowObject;
  })

  const [chordRowObjects, setChordRowObjects] = useState(processedChordRowObjects);
  if (a) setQuery({ a: undefined }, 'pushIn');
  if (c === '') setQuery({ c: csvifyChordRowObjects(chordRowObjects) }, 'pushIn');

  const [measures, setMeasures] = useState(parseCsvifiedMeasureInfos(m));
  let runningSum = 0;
  measures.forEach((measureInfo) => {
    runningSum += measureInfo.beatsPerMeasure;
  })
  const [totalSongBeatCount, setTotalSongBeatCount] = useState(runningSum);
  useEffect(() => {
    let runningSum = 0;
    measures.forEach((measureInfo) => {
      runningSum += beatsConsumedByMeasure(measureInfo);
    })
    setTotalSongBeatCount(runningSum);
    setQuery(
      { m: csvifyMeasureInfos(measures) },
      'pushIn'
    )
  }, [measures]);

  const prevChordRowObjectsCountRef: React.MutableRefObject<number> = useRef(chordRowObjects.length);
  useEffect(() => {
    setQuery(
      { c: csvifyChordRowObjects(chordRowObjects) },
      'pushIn'
    )

    if (chordRowObjects.length > prevChordRowObjectsCountRef.current) {
      const chordRowHeight = document.querySelector('.chord-row')?.clientHeight;
      chordRowHeight && window.scrollBy(0, chordRowHeight * (chordRowObjects.length - prevChordRowObjectsCountRef.current));
    }

    prevChordRowObjectsCountRef.current = chordRowObjects.length;
  }, [chordRowObjects]);

  const [song, setSong] = useState(createSongObject(t));

  useEffect(() => {
    setQuery(
      { t: song.title },
      'pushIn'
    )

    document.title = `Song Scaler - ${song.title}`

  }, [song]);

  const [expandedRowIndex, setExpandedRowIndex] = useState(i);
  const toggle = (rowIndex: number) => {
    if (expandedRowIndex > -1) setExpandedRowIndex(-1);
    else setExpandedRowIndex(rowIndex);
  }

  useEffect(() => {
    setQuery(
      { i: expandedRowIndex },
      'pushIn'
    )
  }, [expandedRowIndex]);

  const expandedChordRow = (expandedRowIndex > -1) && chordRowObjects[expandedRowIndex];

  const [stepIndex, setStepIndex] = useState(s);

  useEffect(() => {
    pausePlayback();
    setMetronomeBeatCount(startingMetronomeBeat);
    setQuery(
      { s: stepIndex },
      'pushIn'
    )
  }, [stepIndex]);

  const [transposingKey, setTranposingKey] = useState<TransposingKeys>(k as TransposingKeys);

  useEffect(() => {
    const tranpositionChange = parseInt(transposingKey) - parseInt(k);

    if (tranpositionChange == 0) return;

    setQuery(
      { k: transposingKey },
      'pushIn'
    );

    let newChordRows = chordRowObjects.slice();

    newChordRows.forEach((chordRowObject) => {
      const { chordNote, bassNote, selectedScaleRoot } = chordRowObject;
      if (chordNote) {
        chordRowObject.chordNote = transposeNote(chordNote, tranpositionChange);
      }
      if (bassNote) {
        chordRowObject.bassNote = transposeNote(bassNote, tranpositionChange);
      }
      if (selectedScaleRoot) {
        chordRowObject.selectedScaleRoot = transposeNote(selectedScaleRoot, tranpositionChange);
      }
    })
    setChordRowObjects(newChordRows);
  }, [transposingKey]);


  const [rgbValues, setRgbValues] = useState([50, 241, 255]);

  const [redRgbValue, greenRgbValue, blueRgbValue] = rgbValues;

  const [monochromaticSchemes, setMonochromaticSchemes] = useState<{ [key in MonochromaticPossibleRootScale]: string }[]>(
    regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue)
  );

  const beatsPerMeasure = 4 // TODO: get from import

  const [bpm, setBpm] = useState(b);

  const [isPlaying, setIsPlaying] = useState(false);
  const [metronomeInterval, setMetronomeInterval] = useState<NodeJS.Timeout | undefined>(undefined);
  const startingMetronomeBeat = -1
  const [metronomeBeatCount, setMetronomeBeatCount] = useState(startingMetronomeBeat);

  const [metronomeMeasureCount, setMetronomeMeasureCount] = useState(beatIndexToMeasureIndex(measures, metronomeBeatCount));
  useEffect(() => {
    setMetronomeMeasureCount(beatIndexToMeasureIndex(measures, metronomeBeatCount));
  }, [metronomeBeatCount, measures])

  const [metronomeCountIn, setMetronomeCountIn] = useState(0);

  const [playHighClick] = useSound(HighClickFile);
  const [playLowClick] = useSound(LowClickFile);

  const incrementMetronomeCount = () => {
    if (metronomeCountIn <= 1) {
      setMetronomeBeatCount((beat: number) => {
        const newBeat = (beat + 1) % totalSongBeatCount;
        beatIsOnNewMeasure(measures, newBeat) ? playHighClick() : playLowClick();
        return newBeat;
      });
    }
    setMetronomeCountIn((oldCountIn: number) => {
      if (oldCountIn > 1) {
        playLowClick();
        return (oldCountIn - 1);
      }
      return 0;
    });
  }

  metronomeTicker.onmessage = () => {incrementMetronomeCount()};

  const rotatedClickSubdivisions = () => {
    const subdivisionsArray = measures.flatMap(({ beatsPerMeasure, subdivisions }) => {
      return new Array(beatsPerMeasure).fill(subdivisions);
    });
    // if we're just starting, metronomeBeatCount is -1, and we want to rotate
    // by 0, so we add one
    return arrayRotate(subdivisionsArray, metronomeBeatCount + 1);
  }

  const countInClickSubdivisions = () => {
    const currentMeasure = measures[Math.max(0, beatIndexToMeasureIndex(measures, metronomeBeatCount))];
    const { beatsPerMeasure, subdivisions } = currentMeasure || { beatsPerMeasure: 4, subdivisions: 4 };
    return new Array(beatsPerMeasure).fill(subdivisions);
  }

  const startPlayback = () => {
    setIsPlaying(true);
    const countInClickSubdivisionsArray = countInClickSubdivisions();
    setMetronomeCountIn(countInClickSubdivisionsArray.length);
    metronomeTicker.postMessage({
      message: 'start',
      bpm,
      rotatedClickSubdivisions: rotatedClickSubdivisions(),
      countInClickSubdivisions: countInClickSubdivisionsArray
    });
    playLowClick();
  }
  const pausePlayback = () => {
    metronomeTicker.postMessage({ message: 'stop' });
    setIsPlaying(false);
    if (metronomeInterval) clearInterval(metronomeInterval);
  }

  useEffect(() => {
    if (metronomeInterval) clearInterval(metronomeInterval);
    if (isPlaying) {
      metronomeTicker.postMessage({
        message: 'update',
        bpm
      });
    }
    setQuery({
      b: bpm
    }, 'pushIn');
  }, [bpm]);

  const processGlobalKey = (keyNote: string, keyScale: string, chordRows: ChordRowObject[]) => {
    keyNote = keyNote.charAt(0).toUpperCase() + keyNote.slice(1).toLowerCase();

    if (keyNote === '' || keyScale === '') return;
    const chromatic_note_index = CHROMATIC_NOTES.findIndex(chromaticNoteArray => chromaticNoteArray.includes(keyNote!.trim()));
    if (chromatic_note_index < 0) return;
    if (!((Object.keys(PossibleRootScale) as [keyof typeof PossibleRootScale]).find(key => PossibleRootScale[key] === keyScale))) return;

    let newChordRows = chordRows.slice();
    newChordRows.forEach((chordRowObject) => {
      if (!chordRowObject.selectedScale && !chordRowObject.selectedScaleRoot) {
        const matchingScale = scalesForChordRowObject(chordRowObject)
          .find(({ rootScale, rootScaleNote }) => rootScale === keyScale && CHROMATIC_NOTES.findIndex(noteArray => noteArray.includes(rootScaleNote)) === chromatic_note_index);

        if (matchingScale != undefined) {
          chordRowObject.selectedScaleRoot = matchingScale.scaleNotes[0];
          chordRowObject.selectedScale = matchingScale.scaleName;

          chordRowObject.selectedScaleObject = matchingScale;
        }
      }

      return chordRowObject;
    });

    return newChordRows;
  };

  const fillWithKey = (keyNote: string, keyScale: string) => {
    const newChordRows = processGlobalKey(keyNote, keyScale, chordRowObjects);

    if (newChordRows) setChordRowObjects(newChordRows);
  }

  useEffect(() => {
    setMonochromaticSchemes(regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue));
  }, rgbValues);

  const handleRowChange = (rowIndex: number, newValue: string, key: ChordRowObjectRequiredKeys): void => {
    let newChordRows = chordRowObjects.slice()
    const newChordRow = newChordRows[rowIndex];
    newChordRow[key] = newValue
    newChordRow.selectedScaleObject = selectedScaleObject(newChordRow);
    setChordRowObjects(newChordRows);
  }

  const navigateToNextStep = () => {
    setStepIndex(stepIndex + 1);
  }

  const navigateToFirstStep = () => {
    setStepIndex(0);
  }

  const navigateToPreviousStep = () => {
    setStepIndex(stepIndex - 1);
  }

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    Array.from((event.target as HTMLInputElement).files as FileList).forEach((file: File) => {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        if (!evt.target?.result || typeof evt.target?.result !== 'string') {
          return alert('error reading file: no result')
        }
        const myParsedPlaylist = myRealReader(evt.target?.result);
        const myParsedSong = myParsedPlaylist.songs && myParsedPlaylist.songs[0];
        if (myParsedSong) {
          let newSong: Song = {
            ...myParsedSong,
            music: {
              ...myParsedSong.music,
              measures: myParsedSong.music.measures.map(measure => measure.chords.map((chord) => chord.chordString!)),
            },
          };
          setSong(newSong);
          let newChordRows = myParsedSong.music.measures.flatMap(({ chords }): ChordRowObject[] => {
            return chords.map(({ chordString, beats }) => {
              const parsedChordString = chordString ? parseChordString(chordString) : ['NC', '', ''];

              return {
                chordNote: parsedChordString[0],
                chordQuality: parsedChordString[1],
                bassNote: parsedChordString[2],
                selectedScale: '',
                selectedScaleRoot: '',
                availableTensions: '',
                beats,
              }

            });
          });

          if (newSong.key) {
            const splitKey = newSong.key.split('-');
            let keyNote = splitKey[0];
            if (splitKey[1] === '') {
              // convert to relative major
              const minorIndex = CHROMATIC_NOTES.findIndex((chromaticNote) => chromaticNote.includes(keyNote));
              const relativeMajorIndex = (minorIndex + 3) % 12;
              keyNote = CHROMATIC_NOTES[relativeMajorIndex][0];
            }

            const processedNewChordRows = processGlobalKey(keyNote, 'major', newChordRows);
            if (processedNewChordRows) newChordRows = processedNewChordRows;
          }

          const newMeasures = myParsedSong.music.measures.map(({ chords, timeSignature }) => {
            const [beatsPerMeasure, subdivisions] = timeSignature.startsWith('12') ? [12, 8] : [parseInt(timeSignature[0]), parseInt(timeSignature[1])];
            const chordCount = chords.length;

            return { beatsPerMeasure, subdivisions, chordCount } as MeasureInfo;

          });

          clearTransposingKey();
          setMeasures(newMeasures);
          setChordRowObjects(newChordRows);
          if (newSong.bpm) setBpm(newSong.bpm);
          navigateToNextStep();
        } else alert('no song found');
      }
      reader.onerror = () => {
        alert('error reading file');
      }
    })
  }

  const clearTransposingKey = () => {
    setTranposingKey(TransposingKeys.C);
  }

  const startNewSong = () => {
    const newChordRows = [createChordRowObject()];
    setMeasures([{ beatsPerMeasure: 4, subdivisions: 4, chordCount: 1 }]);
    clearTransposingKey();
    setBpm(defaultBpm);
    setChordRowObjects(newChordRows);
    setSong(createSongObject(''));
    navigateToNextStep();
  }

  const addRows = (numNewChordRows: number) => {
    if (numNewChordRows < 0) {
      setChordRowObjects(chordRowObjects => chordRowObjects.slice(0,numNewChordRows))
      setMeasures(oldMeasures => {
        const lastMeasure = oldMeasures[oldMeasures.length - 1];
        if (lastMeasure.chordCount > 1) {
          lastMeasure.chordCount -= 1;
          return [...oldMeasures.slice(0, -1), lastMeasure];
        } else {
          return oldMeasures.slice(0, -1);
        }
      });
    } else {
      const numNewChordRowsArray: Array<ChordRowObject> = [...Array(numNewChordRows)].map(() => createChordRowObject())
      setChordRowObjects(chordRowObjects => [...chordRowObjects, ...numNewChordRowsArray]);
      setMeasures(oldMeasures => {
        const newMeasureBeats = oldMeasures[oldMeasures.length - 1].beatsPerMeasure || 4;
        const newMeasureSubdivision = oldMeasures[oldMeasures.length - 1].subdivisions || 4;
        const newMeasure = { beatsPerMeasure: newMeasureBeats, subdivisions: newMeasureSubdivision, chordCount: 1 };
        return [...oldMeasures, newMeasure];
      })
    }
  }

  const hasSongInProgress = (chordRowObjects: ChordRowObject[]): boolean => {
    return chordRowObjects.some(({ chordNote, chordQuality, bassNote }) => !!(chordNote || chordQuality || bassNote));
  }

  const renderStep = (stepIndex: number): React.ReactElement => {
    switch(Steps[stepIndex]) {
      case Step.k:
        return (
          <ChooseKey
            navigateToNextStep={navigateToNextStep}
            setTransposingInstrument={(newKey) => setTranposingKey(newKey)}
            transposingKey={transposingKey}
          />
        );
      case Step.e:
        return (
          <Edit
            chordRowObjects={chordRowObjects}
            fillWithKey={fillWithKey}
            handleRowChange={handleRowChange}
            addRows={addRows}
            monochromaticSchemes={monochromaticSchemes}
            navigateToNextStep={navigateToNextStep}
            navigateToPreviousStep={navigateToPreviousStep}
          />
        );
      case Step.s:
        return (
          <PlayAlong
            chordRowObjects={chordRowObjects}
            measureInfos={measures}
            monochromaticSchemes={monochromaticSchemes}
            measurePlaybackIndex={metronomeMeasureCount}
            metronomeCountIn={metronomeCountIn}
            isPlaying={isPlaying}
            pause={() => pausePlayback()}
          />
        );
      default:
        return (
          <New
            allowContinue={hasSongInProgress(chordRowObjects)}
            handleFiles={handleFiles}
            startNewSong={startNewSong}
            navigateToNextStep={navigateToNextStep}
          />
        );
    }
  }

  const renderFooter = (stepIndex: number): React.ReactElement | null => {
    switch(Steps[stepIndex]) {
      case Step.e:
        return (
          <Fragment>
            <MdKeyboardArrowLeft className="mx-2" onClick={() => navigateToPreviousStep()} />
            <span className="mx-auto">
              <div className="py-2">
                Edit the keys
              </div>
            </span>
            <MdCheck className="mx-2" onClick={() => navigateToNextStep()} />
          </Fragment>
        );
      case Step.s:
        return (
          <PlaybackControls
            bpm={bpm}
            incrementBpm={(amount) => { setBpm(bpm + amount)}}
            isPlaying={isPlaying}
            play={() => startPlayback()}
            pause={() => pausePlayback()}
            restartMetronome={() => setMetronomeBeatCount(startingMetronomeBeat)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="App">
      <Container fluid className="d-flex flex-column h-100">
        <header className="App-header flex-row justify-content-center">
          {
            stepIndex > 0 && (
              <MdKeyboardArrowLeft className="mx-2" onClick={() => navigateToPreviousStep()} />
            )
          }
          <span className="mx-auto">
            {song.title || 'Untitled Song'}
          </span>
          <SidebarMenu goHome={navigateToFirstStep} />
        </header>
        {
          expandedChordRow ? (
            <ChordCarousel
              expandedRowIndex={expandedRowIndex}
              chordRowObjects={chordRowObjects}
              monochromaticSchemes={monochromaticSchemes}
              setExpandedRowIndex={setExpandedRowIndex}
              onRowChange={handleRowChange}
              toggle={toggle}
              fillWithKey={fillWithKey}
            />
          ) : renderStep(stepIndex)
        }
        <Row className="App-footer flex-row justify-content-center">
          {renderFooter(stepIndex)}
        </Row>

      </Container>
    </div>
  );
}

export default App;
