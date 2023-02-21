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
  let concatList = [];
  try {
    if (c_start > t_start) {
      execSync("ffmpeg -i " + fname + " -ss " + timeSecondsToString(t_start) + " -to " + timeSecondsToString(c_start) + " -c:v copy " + "output1.mp4");
      concatList.push("output1.mp4");
    }
    if (c_end < t_end) {
      execSync("ffmpeg -i " + fname + " -ss " + timeSecondsToString(c_end) + " -to " + timeSecondsToString(t_end) + " -c:v copy " + "output2.mp4");
      concatList.push("output2.mp4");
    }
    if (concatList.length > 1) {
      let commandString = "ffmpeg ";
      for (let filename of concatList) {
        commandString += ` -i ${filename} `;
      }
      commandString += '-filter_complex "';
      width = 1280, height = 720;
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
      fs.unlinkSync('output1.mp4');
      fs.unlinkSync('output2.mp4');
    } else {
      fs.copyFileSync(concatList[0], newName);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
  // let new_start = request.trim.new_start || "0";
  // let new_end = request.trim.new_end || timeSecondsToString(timeInSeconds(end) - timeInSeconds(start) + timeInSeconds(new_start));
  // try {
  //   if (fs.existsSync("emptyFrom.mp4")) {
  //     fs.unlinkSync("emptyFrom.mp4");
  //   }
  //   if (fs.existsSync("emptyTo.mp4")) {
  //     fs.unlinkSync("emptyTo.mp4");
  //   }
  //   if (fs.existsSync("output.mp4")) {
  //     fs.unlinkSync("output.mp4");
  //   }
  //   let front_length = timeInSeconds(new_start);
  //   let back_length = parseInt(length) - timeInSeconds(new_end);
  //   let concatList = [];
  //   if (front_length > 0) {
  //     execSync(`ffmpeg -t ${timeInSeconds(new_start)} -f lavfi -i color=c=black:s=${width}x${height} -c:v libx264 -tune stillimage -pix_fmt yuv420p emptyFrom.mp4`);
  //     execSync(`ffmpeg -f lavfi -i anullsrc -i emptyFrom.mp4 -c:v copy -c:a aac -map 0:a -map 1:v -shortest output.mp4`);
  //     fs.unlinkSync('emptyFrom.mp4');
  //     fs.copyFileSync('output.mp4', 'emptyFrom.mp4');
  //     concatList.push("emptyFrom.mp4");
  //     fs.unlinkSync('output.mp4');
  //   }
  //   let medium_length = timeInSeconds(end) - timeInSeconds(start);
  //   execSync("ffmpeg -i " + fname + " -ss " + start + " -to " + end + " -c:v copy " + newName);
  //   if (medium_length > 0) {
  //     concatList.push(newName);
  //   }
  //   if (back_length > 0) {
  //     execSync(`ffmpeg -t ${back_length} -f lavfi -i color=c=black:s=${width}x${height} -c:v libx264 -tune stillimage -pix_fmt yuv420p emptyTo.mp4`);
  //     execSync(`ffmpeg -f lavfi -i anullsrc -i emptyTo.mp4 -c:v copy -c:a aac -map 0:a -map 1:v -shortest output.mp4`);
  //     fs.unlinkSync('emptyTo.mp4');
  //     fs.copyFileSync('output.mp4', 'emptyTo.mp4');
  //     concatList.push("emptyTo.mp4");
  //     fs.unlinkSync('output.mp4');
  //   }
  //   if (front_length > 0 || back_length > 0) {
  //     let commandString = "ffmpeg ";
  //     for (let filename of concatList) {
  //       commandString += ` -i ${filename} `;
  //     }
  //     commandString += '-filter_complex "';
  //     width = 1280, height = 720;
  //     for (let index in concatList) {
  //       commandString += `[${index}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:-1:-1,setsar=1,fps=30,format=yuv420p[v${index}];`;
  //     }
  //     for (let index in concatList) {
  //       commandString += `[${index}:a]aformat=sample_rates=48000:channel_layouts=stereo[a${index}];`;
  //     }
  //     for (let index in concatList) {
  //       commandString += `[v${index}][a${index}]`;
  //     }
  //     commandString += `concat=n=${concatList.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" -c:v libx264 -c:a aac -movflags +faststart output.mp4`;
  //     execSync(commandString);
  //     fs.unlinkSync(newName);
  //     fs.copyFileSync("output.mp4", newName);
  //   }
  //   if (fs.existsSync("output.mp4")) {
  //     fs.unlinkSync("output.mp4");
  //   }
  //   if (fs.existsSync("emptyFrom.mp4")) {
  //     fs.unlinkSync("emptyFrom.mp4");
  //   }
  //   if (fs.existsSync("emptyTo.mp4")) {
  //     fs.unlinkSync("emptyTo.mp4");
  //   }
  // } catch (error) {
  //   return res.status(500).json({ error });
  // }
  //});

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
