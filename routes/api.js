var express = require('express');
var router = express.Router();
const multer  = require('multer');
var path = require('path');
var fs = require('fs');
const { execSync } = require("child_process");
var ffmpeg = require('fluent-ffmpeg');

const generateFileName = (originalName) => (Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(originalName));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos')
  },
  filename: function (req, file, cb) {
    cb(null, generateFileName(file.originalname))
  }
})

const upload = multer({ storage: storage })
/* Upload a video */
router.post('/upload', upload.single('video'), function(req, res, next) {
  let fname = "public/videos/" + req.file.filename;
  execSync("ffmpeg -i " + fname + " -vf fps=5" + " public/frames/" + req.file.filename + "/" + "%07d.png");
  return res.send({
    statusOK: true, 
    filename: req.file.filename
  });
});

const timeInSeconds = (str) => {
  let arr = str.split(":");
  let result = 0;
  for (let x of arr) {
    result *= 60;
    result += x;
  }
  return result;
}

const timeSecondsToString = (time) => {
  return parseInt(time / 3600) + ":" + parseInt(parseInt(time / 60) % 60) + ":" + parseInt(time % 60);
}

router.post('/save/:fname', async function(req, res, next) {
  let request = req.body;
  let fname = "public/videos/" + req.params.fname;
  let newName = "public/videos/" + generateFileName(req.params.fname);
  let videoInfo = await(new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fname, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }));
  if (!videoInfo) {
    return res.status(500).json({
      error: "Invalid path."
    });
  }
  let width = videoInfo.width;
  let height = videoInfo.height;
  if (request.trim) {
    let start = request.trim.start;
    let end = request.trim.end;
    let new_start = request.trim.new_start || "0";
    let new_end = request.trim.new_end || timeSecondsToString(timeInSeconds(end) - timeInSeconds(start) + timeInSeconds(new_start));
    try {
      if (fs.existsSync("emptyFrom.avi")) {
        fs.unlinkSync("emptyFrom.avi");
      }
      if (fs.existsSync("emptyTo.avi")) {
        fs.unlinkSync("emptyTo.avi");
      }
      execSync(`ffmpeg -f lavfi -i color=black:s=1920x1080:r=24000/1001 -f lavfi -i anullsrc -ar 48000 -ac 2 -t 20 empty1.avi`);
      execSync("ffmpeg -i " + fname + " -ss " + start + " -to " + end + " -c:v copy " + newName);
    } catch(error) {
      return res.status(500).json({ error });
    }
  }
  if (request.subtitle) {
    let subtitles = request.subtitle;
    subtitles.sort((a, b) => {
      return a.start - b.start;
    });
  }
  return res.json({
    statusOK: true,
    filename: newName
  });
});

module.exports = router;
