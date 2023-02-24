var express = require('express');
var router = express.Router();
const multer = require('multer');
var path = require('path');
var fs = require('fs');
const { execSync } = require("child_process");
var ffmpeg = require('fluent-ffmpeg');

/* for audio upload */
const { promisify } = require('util');
const { v4 } = require('uuid');

const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

// make sure messages folder exists
const messageFolder = 'public/audios/';
if (!fs.existsSync(messageFolder)) {
  fs.mkdirSync(messageFolder);
}



// router.get('/upload/audio', (req, res) => {
//   readdir(messageFolder)
//     .then(messageFilenames => {
//       res.status(200).json({ messageFilenames });
//     })
//     .catch(err => {
//       console.log('Error reading message directory', err);
//       res.sendStatus(500);
//     });
// });

router.post('/upload_audio', (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'No req.body.message' });
  }
  const messageId = v4();
  writeFile(messageFolder + messageId, req.body.message, 'base64')
    .then(() => {
      res.status(201).json({ fileName: messageId });
    })
    .catch(err => {
      console.log('Error writing message to file', err);
      res.sendStatus(500);
    });
});



/* for audio upload */





const generateFileName = (originalName) => (Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(originalName));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos')
  },
  filename: function (req, file, cb) {
    cb(null, generateFileName(file.originalname))
  }
})

const generateThumbnails = filename => {
  let fname = "public/videos/" + filename;
  let dname = "public/frames/" + filename;
  // console.log(fname, " ", dname);
  if (!fs.existsSync(dname)) {
    fs.mkdirSync(dname);
  }
  execSync("ffmpeg -i " + fname + " -vf fps=1 " + dname + "/" + "%07d.png");
}

const getFileCount = filename => {
  let dname = "public/frames/" + filename;
  let pw = [];
  let cur = 1;
  for (let i = 0; i < 7; i++) {
    pw.push(cur);
    cur *= 10;
  }
  let count = 0;
  for (let i = 1; i <= 10000000; i++) {
    let str = "/";
    // if (i % 100000 == 1) console.log(i);
    for (let j = 0; j < 7; j++) {
      str += parseInt(i / pw[6 - j]) % 10;
    }
    str += ".png";
    if (!fs.existsSync(dname + str)) {
      // console.log('count', dname, str);
      count = i - 1;
      break;
    }
  }
  return count;
}

const getDuration = async filename => {
  let fname = "public/videos/" + filename;
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
  if (!videoInfo) return -1;
  return videoInfo.duration;
}

const upload = multer({ storage: storage })
/* Upload a video */
router.post('/upload', function (req, res, next) {
  if (!fs.existsSync("public/videos")) {
    fs.mkdirSync("public/videos");
  }
  if (!fs.existsSync("public/frames")) {
    fs.mkdirSync("public/frames");
  }
  next();
}, upload.single('video'), async function (req, res, next) {
  generateThumbnails(req.file.filename);
  let filecount = getFileCount(req.file.filename);
  let duration = await getDuration(req.file.filename);
  if (duration < 0) {
    return res.status(500).json({
      error: "Invalid video file."
    });
  }
  return res.json({
    statusOK: true,
    filename: req.file.filename,
    filecount,
    duration
  });
});

const timeInSeconds = (str) => {
  let arr = str.split(":");
  let result = 0;
  for (let x of arr) {
    result *= 60;
    result += parseInt(x);
  }
  return result;
}

const timeSecondsToString = (time) => {
  return parseInt(time / 3600) + ":" + parseInt(parseInt(time / 60) % 60) + ":" + parseInt(time % 60);
}

router.post('/save/:fname', async function (req, res, next) {
  let request = req.body;
  let fname = "public/videos/" + req.params.fname;
  let nname = generateFileName(req.params.fname);
  let newName = "public/videos/" + nname;
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
  let t_start = 0;
  let t_end = Math.trunc(videoInfo.duration);
  let c_start = 0;
  let c_end = 0;
  if (request.trim) {
    t_start = timeInSeconds(request.trim.start);
    t_end = timeInSeconds(request.trim.end);
    c_start = t_start;
    c_end = c_start;
  }
  if (request.cut) {
    c_start = timeInSeconds(request.cut.start);
    c_end = timeInSeconds(request.cut.end);
  }
  // console.log(t_start, c_start, c_end, t_end);
  let concatList = [];
  try {
    // console.log('ggggggggggggggggggg');

    if (request.subtitles && request.subtitles.length > 0) {
      // console.log(request.subtitles);
      if (fs.existsSync("subtitles.srt")) {
        fs.unlinkSync('subtitles.srt');
      }
      request.subtitles.sort((a, b) => a.from.localeCompare(b.from));
      let index = 0;
      for (let subtitle of request.subtitles) {
        let from = subtitle.from;
        let to = subtitle.to;
        index++;
        fs.appendFileSync("subtitles.srt", "" + index + "\n");
        fs.appendFileSync("subtitles.srt", from + ",000 --> " + to + ",000\n");
        fs.appendFileSync("subtitles.srt", subtitle.text + "\n" + "\n");
      }
      execSync(`ffmpeg -i ${fname} -vf subtitles=subtitles.srt subtitles.mp4 -y`);
      videoInfo = await (new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fname, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.streams);
            // for (let stream of data.streams) {
            //   if (stream.width) {
            //     resolve(stream);
            //     return;
            //   }
            // }
          }
        });
      }));
      // console.log(videoInfo);

      fname = 'subtitles.mp4';
      videoInfo = await (new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fname, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.streams);
            // for (let stream of data.streams) {
            //   if (stream.width) {
            //     resolve(stream);
            //     return;
            //   }
            // }
          }
        });
      }));
      // console.log(videoInfo);
    }
    // console.log(t_start, c_start, c_end, t_end);
    if (c_start > t_start && c_end < t_end) {
      execSync("ffmpeg -i " + fname + " -ss " + timeSecondsToString(t_start) + " -to " + timeSecondsToString(c_start) + " -c:v libx264 -c:a aac " + "output1.mp4 -y");
      concatList.push("output1.mp4");
      execSync("ffmpeg -i " + fname + " -ss " + timeSecondsToString(c_end) + " -to " + timeSecondsToString(t_end) + " -c:v libx264 -c:a aac " + "output2.mp4 -y");
      concatList.push("output2.mp4");
      let commandString = "ffmpeg ";
      for (let filename of concatList) {
        commandString += ` -i ${filename} `;
      }
      commandString += '-filter_complex "';
      videoInfo = await (new Promise((resolve, reject) => {
        ffmpeg.ffprobe('output1.mp4', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.streams);
            // for (let stream of data.streams) {
            //   if (stream.width) {
            //     resolve(stream);
            //     return;
            //   }
            // }
          }
        });
      }));
      console.log("output1.mp4\n", videoInfo);
      videoInfo = await (new Promise((resolve, reject) => {
        ffmpeg.ffprobe('output2.mp4', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.streams);
            // for (let stream of data.streams) {
            //   if (stream.width) {
            //     resolve(stream);
            //     return;
            //   }
            // }
          }
        });
      }));
      console.log("output2.mp4\n", videoInfo);


      for (let index in concatList) {
        commandString += `[${index}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:-1:-1,setsar=1,fps=30,format=yuv420p[v${index}];`;
      }


      for (let index in concatList) {
        commandString += `[${index}:a]aformat=sample_rates=48000:channel_layouts=stereo[a${index}];`;
      }


      for (let index in concatList) {
        commandString += `[v${index}][a${index}]`;
      }


      commandString += `concat=n=${concatList.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" -c:v libx264 -c:a aac -movflags +faststart ${newName}`;
      execSync(commandString);
    } else if (c_end < t_end) {
      // console.log(c_end, t_end);
      execSync("ffmpeg -i " + fname + " -ss " + timeSecondsToString(c_end) + " -to " + timeSecondsToString(t_end) + " -c:v libx264 -c:a aac " + newName);
    } else if (t_start < c_start) {
      // console.log(t_start, c_start);
      execSync("ffmpeg -i " + fname + " -ss " + timeSecondsToString(t_start) + " -to " + timeSecondsToString(c_start) + " -c:v libx264 -c:a aac " + newName);
    }

    if (fs.existsSync("output1.mp4")) {
      fs.unlinkSync('output1.mp4');
    }


    if (fs.existsSync("output2.mp4")) {
      fs.unlinkSync('output2.mp4');
    }
    if (fs.existsSync('subtitles.mp4')) {
      fs.unlinkSync('subtitles.mp4');
    }
    if (fs.existsSync("subtitles.srt")) {
      fs.unlinkSync("subtitles.srt");
    }

  } catch (error) {
    if (fs.existsSync("output1.mp4")) {
      fs.unlinkSync('output1.mp4');
    }


    if (fs.existsSync("output2.mp4")) {
      fs.unlinkSync('output2.mp4');
    }
    if (fs.existsSync('subtitles.mp4')) {
      fs.unlinkSync('subtitles.mp4');
    }
    if (fs.existsSync("subtitles.srt")) {
      fs.unlinkSync("subtitles.srt");
    }

    return res.status(500).json({ error });
  }
  generateThumbnails(nname);
  let filecount = getFileCount(nname);
  let duration = await getDuration(nname);
  return res.json({
    statusOK: true,
    filename: nname,
    filecount,
    duration
  });
});

module.exports = router;
