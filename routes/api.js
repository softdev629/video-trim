var express = require('express');
var router = express.Router();
const multer = require('multer');
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
router.post('/upload', upload.single('video'), function (req, res, next) {
  let fname = "public/videos/" + req.file.filename;
  let dname = "public/frames/" + req.file.filename;
  if (!fs.existsSync(dname)) {
    fs.mkdirSync(dname);
  }
  execSync("ffmpeg -i " + fname + " -vf fps=5 " + dname + "/" + "%07d.png");
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

router.post('/save/:fname', async function (req, res, next) {
  let request = req.body;
  let fname = "public/videos/" + req.params.fname;
  let newName = "public/videos/" + generateFileName(req.params.fname);
  let videoInfo = await (new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fname, (err, data) => {
      if (err) {
        reject(err);
      } else {
        for (let stream of data.streams) {
          if (stream.width) {
            resolve(stream);
            return;
          }
        }
      }
    });
  }));
  if (!videoInfo) {
    return res.status(500).json({
      error: "Invalid path."
    });
  }
  let width = videoInfo.width || 1920;
  let height = videoInfo.height || 1600;
  let length = request.length;
  if (request.trim) {
    let start = request.trim.start;
    let end = request.trim.end;
    let new_start = request.trim.new_start || "0";
    let new_end = request.trim.new_end || timeSecondsToString(timeInSeconds(end) - timeInSeconds(start) + timeInSeconds(new_start));
    try {
      if (fs.existsSync("emptyFrom.mp4")) {
        fs.unlinkSync("emptyFrom.mp4");
      }
      // console.log("asdfasdf");
      if (fs.existsSync("emptyTo.mp4")) {
        fs.unlinkSync("emptyTo.mp4");
      }
      // console.log("asdfasdfasdfasdf");
      // if (fs.existsSync("concatenationList.txt")) {
      //   fs.unlinkSync("concatenationList.txt");
      // }
      if (fs.existsSync("output.mp4")) {
        fs.unlinkSync("output.mp4");
      }
      // console.log("asdfasdfasdfasdfasdfasdf");
      let front_length = timeInSeconds(new_start);
      let back_length = parseInt(length) - timeInSeconds(new_end);
      // console.log(length, back_length);
      let concatList = [];
      if (front_length > 0) {
        execSync(`ffmpeg -t ${timeInSeconds(new_start)} -f lavfi -i color=c=black:s=${width}x${height} -c:v libx264 -tune stillimage -pix_fmt yuv420p emptyFrom.mp4`);
        execSync(`ffmpeg -f lavfi -i anullsrc -i emptyFrom.mp4 -c:v copy -c:a aac -map 0:a -map 1:v -shortest output.mp4`);
        fs.unlinkSync('emptyFrom.mp4');
        fs.copyFileSync('output.mp4', 'emptyFrom.mp4');
        concatList.push("emptyFrom.mp4");
        fs.unlinkSync('output.mp4');
      }
      let medium_length = timeInSeconds(end) - timeInSeconds(start);
      execSync("ffmpeg -i " + fname + " -ss " + start + " -to " + end + " -c:v copy " + newName);
      if (medium_length > 0) {
        concatList.push(newName);
      }
      if (back_length > 0) {
        execSync(`ffmpeg -t ${back_length} -f lavfi -i color=c=black:s=${width}x${height} -c:v libx264 -tune stillimage -pix_fmt yuv420p emptyTo.mp4`);
        execSync(`ffmpeg -f lavfi -i anullsrc -i emptyTo.mp4 -c:v copy -c:a aac -map 0:a -map 1:v -shortest output.mp4`);
        fs.unlinkSync('emptyTo.mp4');
        fs.copyFileSync('output.mp4', 'emptyTo.mp4');
        concatList.push("emptyTo.mp4");
        fs.unlinkSync('output.mp4');
      }
      // var mergedVideo = ffmpeg();
      // concatList.forEach(function(videoName){
      //   mergedVideo = mergedVideo.addInput(videoName);
      // });
      // await(new Promise((resolve, reject) => {
      //   mergedVideo.mergeToFile("output.mp4").on('error', function(error) {
      //     reject(error);
      //   }).on('end', function() {
      //     resolve();
      //   })
      // }));
      let commandString = "ffmpeg ";
      for (let filename of concatList) {
        commandString += ` -i ${filename} `;
      }
      // console.log("OKAY");
      commandString += '-filter_complex "';
      width = 1280, height = 720;
      for (let index in concatList) {
        // console.log(index, "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf");
        commandString += `[${index}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:-1:-1,setsar=1,fps=30,format=yuv420p[v${index}];`;
      }
      for (let index in concatList) {
        // console.log(index, "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf");
        commandString += `[${index}:a]aformat=sample_rates=48000:channel_layouts=stereo[a${index}];`;
      }
      for (let index in concatList) {
        commandString += `[v${index}][a${index}]`;
      }
      commandString += `concat=n=${concatList.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" -c:v libx264 -c:a aac -movflags +faststart output.mp4`;
      // console.log(commandString);
      // console.log(front_length, medium_length, back_length);
      // fs.writeFileSync("concatenationList.txt", concatenation_string);
      // console.log("asdfasdfasdfasdfasdfasdfasdfasdf");
      // console.log("start here");
      execSync(commandString);
      // console.log("end here");
      fs.unlinkSync(newName);
      fs.copyFileSync("output.mp4", newName);
      fs.unlinkSync("output.mp4");
      // fs.unlinkSync("concatenationList.txt");
      fs.unlinkSync("emptyFrom.mp4");
      fs.unlinkSync("emptyTo.mp4");
    } catch (error) {
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
