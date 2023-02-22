var express = require('express');
var router = express.Router();
const multer = require('multer');
var path = require('path');
var fs = require('fs');
const { execSync } = require("child_process");
var ffmpeg = require('fluent-ffmpeg');

if (fs.existsSync("subtitles.srt")) {
	fs.unlinkSync('subtitles.srt');
}
let arr = [
	{
		from: '00:00:00',
		to: '00:00:02',
		text: "This is the first sentence"
	},
	{
		from: '00:00:03',
		to: '00:00:05',
		text: "This is the second sentence"
	}
];

let index = 0;
for (let item of arr) {
	index++;
	// console.log(index);
	fs.appendFileSync("subtitles.srt", "" + index + "\n");
	fs.appendFileSync("subtitles.srt", item.from + ",000 ---> " + item.to + ",000");
	fs.appendFileSync("subtitles.srt", item.text)
}