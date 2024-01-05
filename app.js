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
		destination: (req, file, f) => {
			console.log(file)
			f(null, __dirname + '/echoes/public/audioUploads')
		},
		filename: (req, file, f) => {
			f(null, Date.now() + path.extname(file.originalname))
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

// Routes
app.get('/recordings', async (req, res) => { // Send audio files names array
	try {
		const uploadedFiles = await db_helpers.fetchAllUploadedAudioFiles(db);
		console.log(uploadedFiles.rows)
		res.json(uploadedFiles)
	} catch (err) {
		console.log(err)
		res.status(500).json({ error: 'Failed to retrieve audio files' })
	}
})


app.post('/upload', uploadDest.array('audioFiles', 10), (req, res) => { // Upload selected audio files
	console.log(req.files)
	if (!req.files) {
		res.status(500).json({ error: 'No files were selected' })
	}

	const result = db_helpers.uploadAudioFiles(db, req.files)
	if (result !== 1) {
		res.redirect('/')
	} else {
		res.status(500).json({ error: 'Unknown error occured while saving files' })
	}
})

app.listen(port, () => { // Start app and listen to port
	console.log(`Echoes is now listening on port ${port}`)
})
