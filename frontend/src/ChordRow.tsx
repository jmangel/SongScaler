import React, { ChangeEvent, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import scalesForChord, { NamedScale, ROOT_SCALE_READABLE_SHORTENINGS } from './ChordMapper'
import parseChordString from './ChordParser'
import scaleToHexColor, { MonochromaticPossibleRootScale } from './ScaleColorer';
import tinycolor from 'tinycolor2';
import ChordPianoVisualization from './PianoVisualization';
export interface ChordRowObject {
  chordNote: string;
  chordQuality: string;
  bassNote: string;
  selectedScale: string;
  selectedScaleRoot: string;
  availableTensions: string;
  beats: string;
  selectedScaleObject?: NamedScale;
}

type RequiredKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type ChordRowObjectRequiredKeys = RequiredKeys<ChordRowObject>;

export const QUERY_STRING_KEY_MAPPINGS: { [key in keyof ChordRowObject]: string } = { // TODO: change back to keyof ChordRowObject
  'chordNote': 'cn',
  'chordQuality': 'cq',
  'bassNote': 'bn',
  'selectedScale': 'ss',
  'selectedScaleRoot': 'r',
  'availableTensions': 'at',
  'beats': 'b',
}

export const scalesForChordRowObject = (chordRowObject: ChordRowObject): Array<NamedScale> => {
  const { chordNote, chordQuality, bassNote, availableTensions } = chordRowObject;
  return (chordNote && scalesForChord(chordNote, chordQuality, bassNote.replace(/\//g,''), availableTensions)) || [];
}

const ChordRow: React.FC<{
  index: number,
  chordRowObject: ChordRowObject,
  onRowChange: (newValue: string, key: ChordRowObjectRequiredKeys) => void,
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  fillWithKey: (keyNote: string, keyScale: string) => void,
}> = ({
  index,
  chordRowObject,
  onRowChange,
  monochromaticSchemes,
  fillWithKey,
}) => {
  const { chordNote, chordQuality, bassNote, selectedScale, selectedScaleRoot, availableTensions, selectedScaleObject } = chordRowObject;

  const [rowExpanded, setRowExpanded] = useState(false);

  const scales = scalesForChordRowObject(chordRowObject);

  const handleChordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedChordString = parseChordString(e.target.value);

    onRowChange(parsedChordString[0], 'chordNote');
    onRowChange(parsedChordString[1], 'chordQuality');
    onRowChange(parsedChordString[2], 'bassNote');
  }

  const selectedNamedScale = selectedScaleObject || scales.find((namedScale: NamedScale) => namedScale.scaleName === selectedScale && (
    namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
  ));

  let borderColor = '';
  let textColor = 'white';
  if (selectedNamedScale) {
    borderColor = scaleToHexColor(selectedNamedScale.rootScale, selectedNamedScale.rootScaleNote, monochromaticSchemes);

    const borderColorRgb = tinycolor(borderColor).toRgb();
    // https://stackoverflow.com/a/11868159
    const brightness = Math.round(
      (
        (borderColorRgb.r * 299) +
        (borderColorRgb.g * 587) +
        (borderColorRgb.b * 114)
      ) / 1000
    );

    if (brightness > 125) textColor = 'black';
  }

  const rowClassName = `chord-row ${!borderColor && 'border-top' || ''}`;
  const rowStyle = borderColor ? { borderTop: `3px solid ${borderColor}` } : {};

  const buttonClassName = (!!selectedNamedScale ? 'border-dark' : 'btn-outline-light') + ' w-75';
  return (
    <Row className={rowClassName} style={rowStyle}>
      <Col>
        <Row className="pt-3">
          <Col xs={6}>
            <Input
              type="text"
              name="chordNote"
              value={`${chordNote || ""}${chordQuality || ""}${bassNote || ""}`}
              placeholder="A^7#9"
              onChange={handleChordChange}
              className="w-100"
            />
          </Col>
          <Col xs={6}>
            <Input
              type="text"
              name="availableTensions"
              value={availableTensions}
              placeholder="extra notes (e.g. melody, notes you like)"
              onChange={e => onRowChange(e.target.value, 'availableTensions')}
              className="w-100"
            />
          </Col>
        </Row>
        <Row className="py-3">
          <Col xs={12} className="d-flex">
              <Input type="select"
                name="select"
                id="exampleSelect"
                className="flex-grow-1"
                onChange={e => {
                  const [selectedScaleRoot, selectedScale] = e.target.value.split(/ (.+)/)
                  onRowChange(selectedScale, 'selectedScale')
                  onRowChange(selectedScaleRoot, 'selectedScaleRoot')
                }}
                >
                <option value="">--</option>
                {scales.map(
                  (namedScale: NamedScale, index: number) => (
                    <option
                    key={`option--scale-${index}`}
                    value={`${namedScale.scaleNotes[0]} ${namedScale.scaleName}`}
                    selected={namedScale.scaleName === selectedScale && (
                      namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
                      )}
                      >
                      {namedScale.scaleNotes[0]} {namedScale.scaleName} ({namedScale.rootScaleNote} {ROOT_SCALE_READABLE_SHORTENINGS[namedScale.rootScale]}): {namedScale.scaleNotes.join(',')}
                    </option>
                  )
                )}
              </Input>
            {
              selectedNamedScale && (
                <Button
                  color="primary"
                  className="ml-3"
                  onClick={() => {
                    fillWithKey(selectedNamedScale.rootScaleNote, selectedNamedScale.rootScale)
                  }}
                >
                  Fill
                </Button>
              )
            }
          </Col>
        </Row>
        {
          scales.length > 0 && (
            <Row className="pb-3">
              <Col xs={12}>
                <Button
                  className={buttonClassName}
                  outline
                  style={{ backgroundColor: borderColor, color: textColor }}
                  onClick={() => setRowExpanded(!rowExpanded)}
                >
                    {rowExpanded ? 'Close' : 'More Scales'}
                  </Button>
              </Col>
            </Row>
          )
        }
        {rowExpanded && scales.map(
          (namedScale: NamedScale, index: number) => (
            <Row className={`expanded-chord-row py-3 justify-content-center ${ index > 0 && 'border-top'}`} key={`scale-${index}`}>
              <span>
                {namedScale.scaleNotes[0]} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                <hr  />
                <b>{namedScale.rootScaleNote} {namedScale.rootScale}</b>
              </span>
            </Row>
          )
        )}
        {rowExpanded && (
          <Row className={'expanded-chord-row py-3 justify-content-center border-top'}>
            <ChordPianoVisualization
              chordRowObject={chordRowObject}
            />
          </Row>
        )}
      </Col>
    </Row>
  );
}

export default ChordRow;
