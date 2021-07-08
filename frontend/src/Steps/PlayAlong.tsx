import React, { Fragment } from 'react';
import { Col, Modal, ModalBody, Popover, PopoverBody, Row } from "reactstrap";
import { MeasureInfo } from '../App';
import { NamedScale } from '../ChordMapper';
import { ChordRowObject, scalesForChordRowObject } from '../ChordRow';
import ChordPianoVisualization from '../PianoVisualization';
import scaleToHexColor, { MonochromaticPossibleRootScale } from '../ScaleColorer';

const approximateFontHeightToWidthRatio = 3 / 2;

const PlayAlong: React.FC<{
  chordRowObjects: ChordRowObject[],
  measureInfos: MeasureInfo[],
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  measurePlaybackIndex: number,
  metronomeCountIn: number,
  isPlaying: boolean,
  pause: () => void,
}> = ({
  chordRowObjects,
  measureInfos,
  monochromaticSchemes,
  measurePlaybackIndex,
  metronomeCountIn,
  isPlaying,
  pause,
}) => {
  let copiedChordRows = chordRowObjects.slice();

  let activeMeasureChords: ChordRowObject[] = [];

  return (
    <Row
      className="d-flex flex-grow-1 align-items-center pr-1"
      id="play-along-grid"
    >
      {
        (isPlaying && metronomeCountIn > 0) && (
          <Modal
            toggle={() => pause()}
            isOpen
            fade={false}
            centered
            backdropClassName="play-along--count-in-modal--backdrop"
            contentClassName="play-along--count-in-modal--content"
          >
            <ModalBody
              className="d-flex justify-content-center border-0"
              style={{ fontSize: '19em' }}
            >
                {metronomeCountIn}
            </ModalBody>
          </Modal>
        )
      }

      {
        measureInfos.map((memoizedMeasure: MeasureInfo, index: number) => {
          const { chordCount, beatsPerMeasure } = memoizedMeasure;
          const measureChords = copiedChordRows.slice(0, chordCount);
          copiedChordRows = copiedChordRows.slice(chordCount);

          let uniformColumnSize: number | null;
          if (measureChords.every((measureChord: ChordRowObject) => measureChord.beats === measureChords[0].beats)) uniformColumnSize = 12 / measureChords.length;
          let totalBeatsInMeasure = 0;
          measureChords.forEach((measureChord) => totalBeatsInMeasure += parseInt(measureChord.beats));

          const isActive = measurePlaybackIndex === index;

          if (isActive) activeMeasureChords = measureChords;

          return (
            <Fragment>
              <Col xs={3}>
                <Row className="pl-1 pb-1 h-100" id={`measure-${index}`}>
                  {measureChords.map((chordRowObject: ChordRowObject) => {
                    const { chordNote, chordQuality, bassNote, selectedScale, selectedScaleRoot, beats } = chordRowObject;
                    const scales = scalesForChordRowObject(chordRowObject);

                    const selectedNamedScale = scales.find((namedScale: NamedScale) => namedScale.scaleName === selectedScale && (
                      namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
                    ));

                    let borderColor = '';
                    if (selectedNamedScale) {
                      borderColor = scaleToHexColor(selectedNamedScale.rootScale, selectedNamedScale.rootScaleNote, monochromaticSchemes);
                    }

                    const style = borderColor ? { borderTop: `3px solid ${borderColor}` } : { borderTop: `3px solid transparent`};

                    const activeMeasureStyle = isActive ? {
                      backgroundColor: 'white', color: 'black'
                    } : {
                      backgroundColor: 'rgb(255,255,255,0.2)'
                    }

                    const parsedNumSpaces = parseInt(beats);
                    // use uniformColumnSize if present, otherwise calculate against beatsPerMeasure
                    // TODO: the expression `(parsedNumSpaces * (12 / beatsPerMeasure))` doesn't work as
                    // expected because a 12-beat measure might still only have 4 chords in iReal Pro
                    const colWidthInGridCols = parsedNumSpaces ? parsedNumSpaces * (12 / totalBeatsInMeasure) : (12 / measureChords.length);
                    const colProps = { xs: colWidthInGridCols };

                    const colWidthInPercentOfChartWidth = colWidthInGridCols / (12 * 4);
                    const dynamicFontSize = (textLength: number, defaultFontSize: string): string => {
                      const fontWidthInPercentOfChartWidth = colWidthInPercentOfChartWidth / textLength;
                      // font size determines the height of letters, but here we
                      // need to base it on the width, which looks to be about 2/3,
                      // so we multiply by approximateFontHeightToWidthRatio
                      const fontSizeInPercentOfChartWidth = fontWidthInPercentOfChartWidth * approximateFontHeightToWidthRatio;
                      const maxFontSize = `${fontSizeInPercentOfChartWidth * 100}vw`;
                      return `min(${defaultFontSize}, ${maxFontSize})`;
                    }

                    const chordQualityFontSize = dynamicFontSize(chordQuality?.length || 0, '1em');

                    const chordNoteFontSize = dynamicFontSize(chordNote?.length || 0, '1.5em');

                    return (
                      <Col className="play-along--chord px-0" style={{...style, ...activeMeasureStyle }} {...colProps}>
                        <Row className="d-flex flex-row-reverse mx-0" style={{ fontSize: chordQualityFontSize, lineHeight: '1rem' }}>
                          <div>
                            {chordQuality || (<br />)}
                          </div>
                        </Row>
                        <Row className="d-flex justify-content-center py-0 mx-0" style={{ fontSize: chordNoteFontSize, lineHeight: '1.5rem' }}>
                          {/* <div> */}
                            {chordNote}
                          {/* </div> */}
                        </Row>
                        <Row className="d-flex flex-row-reverse mx-0" style={{ fontSize: '1em', lineHeight: 1 }}>
                          <div>
                            {bassNote || (<br />) }
                          </div>
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              {isActive && (
                <Popover
                  placement="bottom"
                  fade={false}
                  isOpen
                  hideArrow
                  target={`measure-${index}`}
                  offset="0,100vh"
                  style={{ width: '100%', background: 'transparent', left: 0 }}
                  popperClassName="piano-visualization-popover"
                  modifiers={{
                    preventOverflow: {
                      boundariesElement: document.getElementById('play-along-grid') || 'scrollParent',
                      padding: {
                        top: 0,
                        bottom: 5,
                        left: 0,
                        right: 0,
                      }
                    }
                  }}
                >
                  <PopoverBody
                    className="d-flex border-0 bg-light justify-content-center"
                  >
                    <div>
                      {measureChords.map((measureChord, index) => {
                        const maxHeightPercentage = 25 / measureChords.length;
                        const maxHeight = `${maxHeightPercentage}vh`;
                        // const maxWidth = `${maxHeightPercentage * 2}vh`;

                        const defaultHeight = '50vw';
                        const defaultWidth = '100vw';
                        return (
                          <div className="px-2"
                            style={{ width: defaultWidth, height: defaultHeight, maxHeight }}
                          >
                            <ChordPianoVisualization
                              chordRowObject={measureChord}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </PopoverBody>
                </Popover>
              )}
            </Fragment>
          );
        })
      }
    </Row>
  );
}

export default PlayAlong;
