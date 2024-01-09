import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import * as db_helpers from "./helpers/db_helpers.js";

// Constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT;
const uploadDest = multer({ // Multer storage config 
	storage: multer.diskStorage({
		destination: (req, file, fn) => {
			console.log(file)
			fn(null, __dirname + '/echoes/public/audioUploads')
		},
		filename: (req, file, fn) => {
			fn(null, Date.now() + path.extname(file.originalname))
		}
	})
})
const db = new pg.Client({ // Database config
	user: process.env.DB_USERNAME,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
})
db.connect(); // Connect Database

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

// Routes
// Send audio files names array
app.get('/recordings', async (req, res) => {
	try {
		const uploadedFiles = await db_helpers.fetchAllUploadedAudioFiles(db);
		if (uploadedFiles) {
			res.status(200).json(uploadedFiles)
		} else {
			res.status(200).json({ message: 'Upload files to start' })
		}
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to retrieve audio files' })
	}
})


// Upload selected audio files
app.post('/upload', uploadDest.array('audioFiles', 10), (req, res) => {
	if (!req.files) { // Error when no files are selected
		res.status(500).json({ error: 'No files were selected' })
	}

	try {
		db_helpers.uploadAudioFiles(db, req.files)
		res.redirect('/')
	} catch (err) {
		res.status(500).json({ error: err })
		console.log(err)
	}

})


// Delete selected audio files
app.post('/recordings/delete', (req, res) => {
	try {
		db_helpers.deleteSelectedFiles(db, req.body.selectedFiles)
		res.status(200).json({ message: 'Files deleted successfully' })
	} catch (err) {
		res.status(500).json({ error: err })
		console.error(err)
	}
})

app.listen(port, () => { // Start app and listen to port
	console.log(`Echoes is now listening on port ${port}`)
})
