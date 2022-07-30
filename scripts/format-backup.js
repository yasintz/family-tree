const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../backup/current.json');

const content = fs.readFileSync(filePath, 'utf-8');

fs.writeFileSync(filePath, JSON.stringify(JSON.parse(content), null, 2));
