import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";


// Constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT;
const uploadedAudioFiles = [] // Uploaded audio files names
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
app.get('/recordings', (req, res) => { // Send audio files names array
	res.json(uploadedAudioFiles)
})


app.post('/upload', uploadDest.single('audioFile'), (req, res) => { // Upload selected audio files
	if(!req.file) {
		res.send('No file is selected')
	}
	const newAudioFile = {
		name: req.file.filename,
		path: 	'/audioUploads/' + req.file.filename
	}
	console.log(newAudioFile.path)
	uploadedAudioFiles.push(newAudioFile)
	res.redirect('/')
})

app.listen(port, () => { // Start app and listen to port
	console.log(`Echoes is now listening on port ${port}`)
})
