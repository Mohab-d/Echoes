// Get all uploaded files
async function fetchAllUploadedAudioFiles(db) {
  try {
    const data = await db.query("SELECT * FROM uploaded_file");
    let allUploadedAudioFiles = []
    data.rows.forEach((audioFile) => {
      allUploadedAudioFiles.push({
        name: audioFile.file_name,
        path: audioFile.file_path
      })
    })
    return allUploadedAudioFiles;
  } catch (err) {
    console.log(err)
    return 1;
  }
}

// Upload a file
function uploadAudioFiles(db, audioFiles) {
  try {
    audioFiles.forEach(async audioFile => {
      await db.query(
        "INSERT INTO uploaded_file (file_name, file_type, file_path) VALUES ($1, $2, $3)",
        [
          audioFile.filename,
          audioFile.mimetype,
          'audioUploads/' + audioFile.filename
        ])
    })
    return 0;
  } catch (err) {
    console.log(err)
    return 1;
  }
}

export { fetchAllUploadedAudioFiles, uploadAudioFiles }