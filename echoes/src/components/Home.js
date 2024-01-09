import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioFile from './general/AudioFile';

function Home() {
	const [uploadedAudioFiles, setUploadedAudioFiles] = useState();
	const [selectedFiles, setSelectedFiles] = useState([]);

	// Get all uploaded files
	async function fetchUploadedFiles() {
		try {
			const response = await axios.get('/recordings');
			setUploadedAudioFiles(response.data);
		} catch (err) {
			console.error(err)
		}
	}

	// Effects
	// Get all uploaded files
	useEffect(() => {
		fetchUploadedFiles();
	}, [])


	async function handleDeleteSelected() {
		try {
			const response = await axios.post('/recordings/delete', { selectedFiles: selectedFiles })
			if (response.status === 200) {
				fetchUploadedFiles();
			}
		} catch (err) {
			console.error(err)
		}
	}

	function selectFile(event) {
		const fileIndex = event.target.parentElement.id; // Get index from clicked checkbox's parent
		const isChecked = event.target.checked;

		setSelectedFiles(prevSelection => {
			if (isChecked) {
				return [...prevSelection, fileIndex]
			} else {
				return prevSelection.filter((index) => index !== fileIndex);
			}
		})
	}

	return (
		<div>
			<h1>Hello and wilcom</h1>
			<form action="/upload" method="post" enctype="multipart/form-data">
				<input type="file" name="audioFiles" accept="audio/*" multiple />
				<button type="submit">Upload</button>
			</form>
			<button type='button' onClick={handleDeleteSelected}>Delete selected</button>
			<div>Here are all your uploads:</div>
			<ul>
				{uploadedAudioFiles && uploadedAudioFiles.map((file, index) => {
					return <li key={index} id={file.id}>
						<input type='checkbox' onClick={selectFile}></input>
						<AudioFile fileName={file.name} filePath={file.path} uploadDate={file.uploadDate} uploadTime={file.uploadTime}/>
					</li>
				})}
			</ul>
		</div>
	)
}

export default Home;
