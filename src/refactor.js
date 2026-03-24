const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
    
    // Replace nav
    content = content.replace(/<nav[\s\S]*?<\/nav>/, '<!-- INJECT:NAV -->');
    
    // Replace footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/, '<!-- INJECT:FOOTER -->');
    
    // Remove whatsapp button (handling possible comments)
    content = content.replace(/<!-- WhatsApp Float Button -->[\s\S]*?<\/svg>\s*<\/a>/, '');
    content = content.replace(/<a href="https:\/\/wa\.me[^>]*class="whatsapp-float"[\s\S]*?<\/svg>\s*<\/a>/, '');
    
    fs.writeFileSync(path.join(srcDir, file), content);
    console.log(`Refactored ${file}`);
});
