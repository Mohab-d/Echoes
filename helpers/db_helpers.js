import path from 'path'


// Get all uploaded files
async function fetchAllUploadedAudioFiles(db) {
  try {
    const data = await db.query("SELECT * FROM uploaded_file");
    let allUploadedAudioFiles = []
    data.rows.forEach((audioFile) => {
      allUploadedAudioFiles.push({
        id: audioFile.id,
        name: audioFile.file_name,
        path: audioFile.file_path
      })
    })
    return allUploadedAudioFiles;
  } catch (err) {
    console.error(err)
    throw new Error("Could not fetch data from the database")
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
          path.extname(audioFile.filename),
          'audioUploads/' + audioFile.filename
        ])
    })
  } catch (err) {
    console.log(err)
    throw new Error("Could not store uploaded files to the database")
  }
}

function deleteSelectedFiles(db, selectedFilesIds) {
  try {
    selectedFilesIds.forEach(async (fileId) => {
      await db.query("DELETE FROM uploaded_file where id = $1", [fileId])
    })
  } catch(err) {
    throw new Error("Could not delete selected files")
  }
}

export { fetchAllUploadedAudioFiles, uploadAudioFiles , deleteSelectedFiles}