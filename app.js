import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = process.env.PORT;

const uploadDest = multer({
	storage: multer.diskStorage({
		destination: (req, file, f) => {
			f(null, 'audioUploads')
		},
		filename: (req, file, f) => {
			f(null, Date.now() + path.extname(file.originalname))
		}
	})
})

const uploadedAudioFiles = []

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/recordings', (req, res) => {
	res.json(uploadedAudioFiles)
})

app.post('/upload', uploadDest.single('audioFile'), (req, res) => {
	uploadedAudioFiles.push(req.file.filename)
	res.redirect('/')
})

app.listen(port, () => {
	console.log(`Echoes is now listening on port ${port}`)
})
