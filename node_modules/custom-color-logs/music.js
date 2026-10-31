const path = require('path');
require("dotenv").config();
const player = require('play-sound')({}); 
const checkTypo = require(path.join(__dirname, 'stringChecker.js'));
const bios = path.join(__dirname, "music", "bios.mp3");
const windows = path.join(__dirname, "music", 'windows-xp.mp3');
const names = ["windows-xp", "bios", "custom"];
let SOUND_PATH;
let play_error_sound = process.env.PLAY_ERROR_SOUND === 'true';
let type_of_error_sound = process.env.ERROR_SOUND_TYPE || "windows-xp";
const custom_path = process.env.CUSTOM_SOUND_PATH;
if (type_of_error_sound === "custom" && !custom_path) {
    type_of_error_sound = "windows-xp";
}
type_of_error_sound = checkTypo(type_of_error_sound, names).word;
if (play_error_sound) {
    if (type_of_error_sound === names[0]) SOUND_PATH = windows;
    else if (type_of_error_sound === names[1]) SOUND_PATH = bios;
    else if (type_of_error_sound === names[2]) SOUND_PATH = custom_path;
}
async function playErrorSound() {
    if (!play_error_sound || !SOUND_PATH) {
        process.stdout.write('\x07');
        return;
    }
    player.play(SOUND_PATH, (err) => {
        if (err) {
            process.stdout.write('\x07');
        }
    });
}
module.exports = { playErrorSound };