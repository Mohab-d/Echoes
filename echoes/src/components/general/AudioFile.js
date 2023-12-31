import React, { useState } from 'react';
import { Howl, Howler } from 'howler';


function AudioFile(props) {
  const [btnAction, setBtnAction] = useState('Play');

  function handleBtnAction() {
    const newState = btnAction === 'Play' ? 'Stop' : 'Play';
    setBtnAction(newState)
    const audio = new Howl({src: ['../../../../audioUploads/' + props.fileName]})
    console.log(audio)
    audio.play()
  }


  return (
    <div className='audio-file'>
      <h2>{props.fileName}</h2>
      <button onClick={handleBtnAction}>{btnAction}</button>
    </div>
  )
}

export default AudioFile;