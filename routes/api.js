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

console.log('watching...');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

if (!fs.existsSync("public/videos")) {
  fs.mkdirSync("public/videos");
}

if (!fs.existsSync("public/frames")) {
  fs.mkdirSync("public/frames");
}
// make sure messages folder exists
const messageFolder = 'public/audios/';
if (!fs.existsSync(messageFolder)) {
  fs.mkdirSync(messageFolder);
}

router.post('/upload_audio', (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'No req.body.message' });
  }
  let messageId = v4();
  writeFile(messageFolder + messageId, req.body.message, 'base64')
    .then(() => {
      let new_messageId = v4();
      execSync(`ffmpeg -i ${messageFolder + messageId} -c:a aac ${messageFolder + new_messageId}.aac`);
      res.status(201).json({ fileName: new_messageId + ".aac" });
    })
    .catch(err => {
      console.log('Error writing message to file', err);
      res.sendStatus(500);
    });
});

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
  execSync("ffmpeg -hide_banner -loglevel error -i " + fname + " -vf fps=1 " + dname + "/" + "%07d.png");
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

const getWidthAndHeight = async filename => {
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
  return {
    width: videoInfo.width,
    height: videoInfo.height
  };
}

const extractColor = colorString => {
  if (colorString[0] == '#') return colorString;
  let arr = [];
  let throwString = "rgb(), ";
  let last = "";
  for (let x of colorString) {
    // console.log(x);
    if (throwString.indexOf(x) >= 0) {
      if (last.length > 0) {
        arr.push(last);
        last = "";
      }
      continue;
    }
    last += x;
    // console.log(last);
  }
  if (last.length > 0) {
    arr.push(last);
  }
  // console.log(arr);
  return `#${parseInt(arr[0]).toString(16).padStart(2, "0")}${parseInt(arr[1]).toString(16).padStart(2, "0")}${parseInt(arr[2]).toString(16).padStart(2, "0")}`;
}

const upload = multer({ storage: storage })
/* Upload a video */
router.post('/upload', upload.single('video'), async function (req, res, next) {
  generateThumbnails(req.file.filename);
  let filecount = getFileCount(req.file.filename);
  let duration = await getDuration(req.file.filename);
  if (duration < 0) {
    return res.status(500).json({
      error: "Invalid video file."
    });
  }
  let wh = await getWidthAndHeight(req.file.filename);
  return res.json({
    statusOK: true,
    filename: req.file.filename,
    filecount,
    duration,
    ...wh
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

const normalizeTimeFromFrontEnd = timeString => timeSecondsToString(timeInSeconds(timeString));

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
  let width = videoInfo.width || 2048;
  let height = videoInfo.height || 1152;
  let length = Math.trunc(videoInfo.duration);
  let t_start = 0;
  let t_end = length;
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
      execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -vf subtitles=subtitles.srt subtitles.mp4 -y`);

      fname = 'subtitles.mp4';
    }
    if (request.shapes && request.shapes.length > 0) {
      let last = "0";
      request.shapes.sort((a, b) => (timeInSeconds(a.from) - timeInSeconds(b.from)));
      let segments = [];
      let index = 0;
      for (let shape of request.shapes) {
        if (timeInSeconds(last) < timeInSeconds(shape.from)) {
          index++;
          let gname = "shape" + index.toString(10) + ".mp4";
          segments.push(gname);
          execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(last)} -to ${normalizeTimeFromFrontEnd(shape.from)} -c:v libx264 -c:a aac ${gname} -y`);
        }
        // console.log(shape);
        let W = shape.screenWidth || 600;
        let H = shape.screenHeight || 400;
        // console.log(shape.left, W, width);
        let x = Math.trunc(shape.left / W * width);
        let y = Math.trunc(shape.top / H * height);
        let w = Math.trunc(shape.width / W * width);
        let h = Math.trunc(shape.height / H * height);
        let c = extractColor(shape.borderColor);
        let s = shape.from;
        let e = shape.to;
        console.log(x, y, w, h, c, s, e, W, H);
        switch (shape.type) {
          case 'Rectangle':
            {
              index++;
              let gname = "shape" + index.toString(10) + ".mp4";
              segments.push(gname);
              console.log(W, H, x, y, w, h, c, s, e);
              execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -vf "drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=${c}" -c:v libx264 -c:a aac ${gname} -y`);
              videoInfo = await (new Promise((resolve, reject) => {
                ffmpeg.ffprobe(gname, (err, data) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(data.streams);
                  }
                });
              }));
              // console.log(videoInfo);
              break;
            }
          case 'Circle':
            {
              index++;
              let gname = "shape" + index.toString(10) + ".mp4";
              segments.push(gname);
              // console.log("okay");
              h = w;
              // console.log("fname = ", fname);
              // console.log(gname, fname, x, y, w, c, s, e);
              execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -filter_complex "color=${c}:s=${w}x${h},geq=lum='p(X+${x},Y+${y})':a='if(lt(pow(X-${w / 2},2)+pow(Y-${h / 2},2),pow(${Math.max(w / 2 - 5, 0)}, 2)),0,if(gt(pow(X-${w / 2},2)+pow(Y-${h / 2},2),pow(${w / 2},2)),0,255))'[c];[0][c]overlay=${x}:${y}:shortest=1" -c:v libx264 -c:a aac ${gname} -y`);
              break;
            }
          case 'LineToDown':
            {
              // console.log("okay");
              index++;
              let gname = "shape" + index.toString(10) + ".mp4";
              segments.push(gname);
              // console.log("okay2");
              // console.log("here = ", x, y, h, w, c);
              h = w;
              y += h / Math.sqrt(2) - h / 2 / Math.sqrt(2);
              h /= Math.sqrt(2);
              w /= Math.sqrt(2);
              // console.log(x, y, h, w, c);
              y = Math.trunc(y);
              h = Math.trunc(h);
              w = Math.trunc(w);
              // console.log("x = ", x, y, h, w, c);
              execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -filter_complex "color=${c}:s=${w}x${h},geq=lum='p(X+${x},Y+${y})':a='if(gt(X-Y, 3), 0, if(gt(Y-X,3),0,255))'[c];[0][c]overlay=${x}:${y}:shortest=1" -c:v libx264 -c:a aac ${gname} -y`);
              break;
            }
          case 'LineToUp':
            {
              index++;
              let gname = "shape" + index.toString(10) + ".mp4";
              segments.push(gname);
              w /= Math.sqrt(2);
              w = Math.trunc(w);
              h = w;
              execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -filter_complex "color=${c}:s=${w}x${h},geq=lum='p(X+${x},Y+${y})':a='if(gt(X+Y, ${w-10}), 0, if(lt(X+Y,${w-15}),0,255))'[c];[0][c]overlay=${x}:${y}:shortest=1" -c:v libx264 -c:a aac ${gname} -y`);
              break;
            }
          case 'Vertical':
            {
              index++;
              let gname = "shape" + index.toString(10) + ".mp4";
              segments.push(gname);
              execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -filter_complex "color=${c}:s=5x${w},geq=lum='p(X+${x},Y+${y})':a=255[c];[0][c]overlay=${Math.max(x-2,0)}:${y}:shortest=1" -c:v libx264 -c:a aac ${gname} -y`);
              break;
            }
          case 'Horizontal':
            {
              index++;
              let gname = "shape" + index.toString(10) + ".mp4";
              segments.push(gname);
              execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -filter_complex "color=${c}:s=${w}x5,geq=lum='p(X+${x},Y+${y})':a=255[c];[0][c]overlay=${x}:${Math.max(y-2,0)}:shortest=1" -c:v libx264 -c:a aac ${gname} -y`);
              break;
            }
        }
        last = shape.to;
      }
      if (timeInSeconds(last) < length) {
        index++;
        let gname = "shape" + index.toString(10) + ".mp4";
        segments.push(gname);
        execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(last)} -to ${timeSecondsToString(length)} -c:v libx264 -c:a aac ${gname} -y`);
        gname = "shape" + Math.random() * 1e9 + ".mp4";
        index++;
      }
      let commandString = "ffmpeg";
      for (let name of segments) {
        commandString += ` -i ${name}`;
      }
      commandString += ' -filter_complex "';
      for (let i in segments) {
        commandString += `[${i}:v][${i}:a]`;
      }
      commandString += ` concat=${segments.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" -c:v libx264 -c:a aac shape.mp4 -y`;
      execSync(commandString);
      for (let name of segments) {
        fs.unlinkSync(name);
      }
      fname = "shape.mp4";
    }
    if (request.audios) {
      let last = "0";
      request.audios.sort((a, b) => (timeInSeconds(a.from) - timeInSeconds(b.from)));
      let segments = [];
      let index = 0;
      for (let audio of request.audios) {
        if (timeInSeconds(last) < timeInSeconds(audio.from)) {
          index++;
          let gname = "audio" + index.toString(10) + ".mp4";
          segments.push(gname);
          execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(last)} -to ${normalizeTimeFromFrontEnd(s)} -c:v libx264 -c:a aac ${gname} -y`);
        }
        {
          let s = audio.from;
          let e = audio.to;
          let a = audio.filename;
          index++;
          let gname = "audio" + index.toString(10) + ".mp4";
          segments.push(gname);
          console.log("gname = ", gname);
          execSync(`ffmpeg -hide_banner -loglevel error -i ${fname} -ss ${normalizeTimeFromFrontEnd(s)} -to ${normalizeTimeFromFrontEnd(e)} -c:v libx264 -c:a aac temp.mp4 -y`);
          execSync(`ffmpeg -hide_banner -loglevel error -i temp.mp4 -i public/audios/${a} -c:v libx264 - filter_complex "[0:a][1:a] amix=inputs=2:duration=longest [audio_out]" ${gname} -y`);
        }
        last = audio.to;
      }
      if (timeInSeconds(last) < length) {
        index++;
        let gname = "audio" + index.toString(10) + ".mp4";
        segments.push(gname);
        execSync(`ffmpeg - hide_banner - loglevel error - i ${fname} -ss ${normalizeTimeFromFrontEnd(last)} -to ${timeSecondsToString(length)} -c:v libx264 - c:a aac ${gname} -y`);
        index++;
      }
      // console.log("segmentsize = ", index);
      let commandString = "ffmpeg";
      for (let name of segments) {
        commandString += ` - i ${name} `;
      }
      commandString += ' -filter_complex "';
      for (let i in segments) {
        commandString += `[${i}:v][${i}: a]`;
      }
      commandString += ` concat = ${segments.length}: v = 1: a = 1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -c:a aac shape.mp4 -y`;
      execSync(commandString);
      for (let name of segments) {
        fs.unlinkSync(name);
      }
      fname = "audio.mp4";
    }
    // console.log(t_start, c_start, c_end, t_end);
    if (c_start > t_start && c_end < t_end) {
      execSync("ffmpeg -hide_banner -loglevel error -i " + fname + " -ss " + timeSecondsToString(t_start) + " -to " + timeSecondsToString(c_start) + " -c:v libx264 -c:a aac " + "output1.mp4 -y");
      concatList.push("output1.mp4");
      execSync("ffmpeg -hide_banner -loglevel error -i " + fname + " -ss " + timeSecondsToString(c_end) + " -to " + timeSecondsToString(t_end) + " -c:v libx264 -c:a aac " + "output2.mp4 -y");
      concatList.push("output2.mp4");
      let commandString = "ffmpeg -hide_banner -loglevel error";
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
      // console.log("output1.mp4\n", videoInfo);
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
      // console.log("output2.mp4\n", videoInfo);

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
      execSync("ffmpeg -hide_banner -loglevel error -i " + fname + " -ss " + timeSecondsToString(c_end) + " -to " + timeSecondsToString(t_end) + " -c:v libx264 -c:a aac " + newName);
    } else if (t_start < c_start) {
      // console.log(t_start, c_start);
      execSync("ffmpeg -hide_banner -loglevel error -i " + fname + " -ss " + timeSecondsToString(t_start) + " -to " + timeSecondsToString(c_start) + " -c:v libx264 -c:a aac " + newName);
    }

    if (fs.existsSync("output1.mp4")) {
      fs.unlinkSync('output1.mp4');
    }
    if (fs.existsSync("shape.mp4")) {
      fs.unlinkSync('shape.mp4');
    }
    if (fs.existsSync("audio.mp4")) {
      fs.unlinkSync('audio.mp4');
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
  let wh = await getWidthAndHeight(nname);
  return res.json({
    statusOK: true,
    filename: nname,
    filecount,
    duration,
    ...wh
  });
});

module.exports = router;
