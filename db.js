// --- Required librairies ---
const fs = require('fs');

// --- Configs ---
const config = JSON.parse(fs.readFileSync('./config.json')).json_db;

// -- JSON parse error resolve --
function json_resolve(str) {
    str = str.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    str = str.replace(/[\u0000-\u001F]+/g, ""); 
    return str;
}

module.exports = {
    getTable: function (table_name) {
        let table = JSON.parse(fs.readFileSync('./db/' + table_name + '.json'));
        return table;
    },
    get: function (table_name, row, column) {
		if (!fs.existsSync('./db/')) fs.mkdirSync('./db/', { recursive: true });
		if (!fs.existsSync('./db/' + table_name + '.json')) fs.writeFileSync('./db/' + table_name + '.json', "{}");
        let table = JSON.parse(fs.readFileSync('./db/' + table_name + '.json'));
        if (!table[row]) return false;
        if (!table[row][column]) return false;
        return table[row][column];
    },
    set: function (table_name, row, column, data) {
		if (!fs.existsSync('./db/')) fs.mkdirSync('./db/', { recursive: true });
        let table = JSON.parse(fs.readFileSync('./db/' + table_name + '.json'));
        if (!table[row]) table[row] = {};
        table[row][column] = data;
        fs.writeFileSync('./db/' + table_name + '.json', JSON.stringify(table));
    },
    resolve: json_resolve
};
 