// --- Required librairies ---
const fs = require('fs');

// --- Required modules ---
const discord = require('./discord.js');
const db = require('./db.js');

// --- Load config ---
const config = JSON.parse(fs.readFileSync('./config.json'));

discord.login(config.discord.token, config.discord.default_prefix);