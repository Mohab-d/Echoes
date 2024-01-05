import React, { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';

function AudioFile(props) {
  const [btnAction, setBtnAction] = useState('Play');
  const [sound, setSound] = useState();

  useEffect(() => {
    const sound = new Howl({ src: [props.filePath] });
    sound.once('load', () => {
      setSound(sound);
    })
  }, [])

  function handleBtnAction() {
    const newState = btnAction === 'Play' ? 'Stop' : 'Play';
    setBtnAction(newState);
    if (sound) {
      if (btnAction === 'Play') {
        sound.play();
      } else {
        sound.stop();
      }
    }
  }
  return (
    <div className='audio-file'>
      <h2>{props.fileName}</h2>
      <button onClick={handleBtnAction} type='button'>{btnAction}</button>
    </div>
  )
}

export default AudioFile;