import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioFile from './general/AudioFile';

function Home() {
	const [uploadedAudioFiles, setUploadedAudioFiles] = useState();

	useEffect(() => {
		async function fetchUploadedFiles() {
			try {
				const response = await axios.get('/recordings');
				setUploadedAudioFiles(response.data);
				console.log(response.data)
			} catch (err) {
				console.error(err)
			}
		}
		fetchUploadedFiles();
	}, [])


	return (
		<div>
			<h1>Hello and wilcom</h1>
			<form action="/upload" method="post" enctype="multipart/form-data">
				<input type="file" name="audioFiles" accept="audio/*" multiple />
				<button type="submit">Upload</button>
			</form>
			<div>Here are all your uploads:</div>
			<ul>
				{uploadedAudioFiles && uploadedAudioFiles.map((file, index) => {
					console.log(file.path)
					return <li key={index} id={index}><AudioFile fileName={file.name} filePath={file.path} /></li>
				})}
			</ul>
		</div>
	)
}

export default Home;
