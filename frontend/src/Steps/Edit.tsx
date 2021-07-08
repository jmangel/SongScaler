import React, { useState } from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { Alert, Row } from "reactstrap";
import ChordRow, { ChordRowObject, ChordRowObjectRequiredKeys } from '../ChordRow';
import { MonochromaticPossibleRootScale } from '../ScaleColorer';

const Edit: React.FC<{
  chordRowObjects: ChordRowObject[],
  handleRowChange: (rowIndex: number, newValue: string, key: ChordRowObjectRequiredKeys) => void,
  addRows: (numNewRows: number) => void,
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  navigateToNextStep: () => void,
  fillWithKey: (keyNote: string, keyScale: string) => void,
  navigateToPreviousStep: () => void,
}> = ({
  chordRowObjects,
  handleRowChange,
  addRows,
  monochromaticSchemes,
  navigateToNextStep,
  fillWithKey,
  navigateToPreviousStep,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const onDismiss = () => setAlertVisible(false);

  return (
    <div>
      <Alert isOpen={alertVisible} toggle={onDismiss}>
        Key filled!
      </Alert>
      {chordRowObjects.map((chordRowObject, rowIndex) => <ChordRow
        index={rowIndex}
        chordRowObject={chordRowObject}
        onRowChange={(newValue: string, key: ChordRowObjectRequiredKeys) => handleRowChange(rowIndex, newValue, key)}
        monochromaticSchemes={monochromaticSchemes}
        fillWithKey={(keyNote: string, keyScale: string) => { fillWithKey(keyNote, keyScale); setAlertVisible(true); setTimeout(onDismiss, 3000); } }
      />)}
      <Row className='py-2 flex-row justify-content-center align-items-center'>
        <MdAddCircle color="#EF532B" size="3em" onClick={() => addRows(1)} />
        { chordRowObjects.length > 1 && <MdRemoveCircle color="#EF532B" size="3em" onClick={() => addRows(-1)} />}
      </Row>
    </div>
  );
}

export default Edit;
