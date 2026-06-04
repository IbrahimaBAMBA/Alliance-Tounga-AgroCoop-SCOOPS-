const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const zip = new AdmZip();
const distDir = path.join(__dirname, 'dist');
const zipPath = path.join(__dirname, 'dist.zip');

console.log('Zipping dist folder contents...');

if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

zip.addLocalFolder(distDir);
zip.writeZip(zipPath);

console.log('Successfully created dist.zip using adm-zip!');
