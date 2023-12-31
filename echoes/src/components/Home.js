import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioFile from './general/AudioFile';

function Home() {
	const [message, setMessage] = useState('');
	const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]);

	async function fetchData() {
		try {
			const response = await axios.get('/recordings');
			setUploadedAudioFiles(response.data);
		} catch (err) {
			console.error(err)
		}
	}
	useEffect(() => {
		fetchData()
	}, [])


	return (
		<div>
			<h1>Hello and wilcom</h1>
			<form action="/upload" method="post" enctype="multipart/form-data">
				<input type="file" name="audioFile" accept="audio/*" />
				<button type="submit">Upload</button>
			</form>
			<div>Here are all your uploads:</div>
			<ul>
				{uploadedAudioFiles &&  uploadedAudioFiles.map((file, index) => {
					return <li key={index} id={index}><AudioFile fileName={file} /></li>
				})}
			</ul>
		</div>
	)
}

export default Home;
